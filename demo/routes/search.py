"""
Main web views router (Index, Search with filtering & pagination).
"""

from __future__ import annotations

import csv
import io
import json
import logging
import math
from typing import TYPE_CHECKING, List, Optional

from fastapi import APIRouter, Form, Request, Response, status
from fastapi.responses import HTMLResponse

if TYPE_CHECKING:
    from fastapi.templating import Jinja2Templates

from robo_market_search.unified.client import UnifiedSearchClient

logger = logging.getLogger("demo.routes")

router = APIRouter()


@router.get("/", response_class=HTMLResponse, include_in_schema=False)
async def index(request: Request) -> HTMLResponse:
    """Ana sayfa — boş arama arayüzü."""
    templates: Jinja2Templates = request.app.state.templates
    return templates.TemplateResponse(request=request, name="index.html")


@router.post("/search", response_class=HTMLResponse, include_in_schema=False)
async def search(
    request: Request,
    query: str = Form(...),
    limit: int = Form(10),
    page: int = Form(1),
    page_size: int = Form(6),
    store_filter: Optional[List[str]] = Form(None),
    stock_only: bool = Form(False),
    sort_by: str = Form("price_asc"),
    min_price: Optional[float] = Form(None),
    max_price: Optional[float] = Form(None),
) -> HTMLResponse:
    """
    HTMX partial endpoint.

    Arama sorgusunu alır, filtrelere ve sayfalama ayarlarına göre ürünleri süzüp
    sonuç kartlarını ve sayfalama barını dinamik HTML olarak döndürür.
    """
    templates: Jinja2Templates = request.app.state.templates
    query = query.strip()
    if not query:
        return HTMLResponse(content="", status_code=status.HTTP_204_NO_CONTENT)

    limit = max(1, min(limit, 20))
    logger.info("Search query=%r limit=%d page=%d sort=%s", query, limit, page, sort_by)

    try:
        client = UnifiedSearchClient()
        # Unified async arama (asyncio + önbellek katmanı)
        raw_products = await client.search_async(query=query, limit_per_store=limit)

        # ── 1. Bulunan Tüm Marketlerin Listesi (Filtre Paneli İçin) ──
        all_stores = sorted({p.store for p in raw_products})

        # ── 2. Filtreleme ──
        filtered_products = raw_products

        # Market filtresi
        if store_filter:
            selected_stores = set(store_filter)
            filtered_products = [p for p in filtered_products if p.store in selected_stores]

        # Stok filtresi
        if stock_only:
            filtered_products = [p for p in filtered_products if p.in_stock]

        # Fiyat filtresi
        if min_price is not None:
            filtered_products = [p for p in filtered_products if p.price >= min_price]
        if max_price is not None:
            filtered_products = [p for p in filtered_products if p.price <= max_price]

        # ── 3. Sıralama ──
        if sort_by == "price_asc":
            filtered_products.sort(key=lambda p: p.price)
        elif sort_by == "price_desc":
            filtered_products.sort(key=lambda p: p.price, reverse=True)
        elif sort_by == "name_asc":
            filtered_products.sort(key=lambda p: p.name.lower())
        elif sort_by == "store_asc":
            filtered_products.sort(key=lambda p: p.store)

        # ── 4. Sayfalama (Pagination) ──
        total_items = len(filtered_products)
        total_pages = max(1, math.ceil(total_items / page_size))
        current_page = max(1, min(page, total_pages))

        start_idx = (current_page - 1) * page_size
        end_idx = start_idx + page_size
        page_products = filtered_products[start_idx:end_idx]

        return templates.TemplateResponse(
            request=request,
            name="partials/results.html",
            context={
                "products": page_products,
                "total_items": total_items,
                "raw_total": len(raw_products),
                "query": query,
                "limit": limit,
                "all_stores": all_stores,
                # Pagination info
                "current_page": current_page,
                "total_pages": total_pages,
                "page_size": page_size,
                # Active filters state
                "selected_stores": store_filter or [],
                "stock_only": stock_only,
                "sort_by": sort_by,
                "min_price": min_price,
                "max_price": max_price,
            },
        )

    except Exception as exc:
        logger.exception("Search error for query=%r: %s", query, exc)
        return templates.TemplateResponse(
            request=request,
            name="partials/error.html",
            context={"error": str(exc)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/export/json", include_in_schema=False)
async def export_json(query: str, limit: int = 10) -> Response:
    """Arama sonuçlarını JSON dosyası olarak indirir."""
    query = query.strip()
    if not query:
        return Response(content="[]", media_type="application/json")

    client = UnifiedSearchClient()
    products = await client.search_async(query=query, limit_per_store=limit)

    data = [
        {
            "name": p.name,
            "price": p.price,
            "currency": p.currency,
            "store": p.store,
            "url": p.url,
            "image_url": p.image_url,
            "in_stock": p.in_stock,
        }
        for p in products
    ]

    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    filename = f"robo_search_{query.replace(' ', '_')}.json"

    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/export/csv", include_in_schema=False)
async def export_csv(query: str, limit: int = 10) -> Response:
    """Arama sonuçlarını CSV dosyası olarak indirir."""
    query = query.strip()
    if not query:
        return Response(content="", media_type="text/csv")

    client = UnifiedSearchClient()
    products = await client.search_async(query=query, limit_per_store=limit)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Ürün Adı", "Fiyat", "Para Birimi", "Market", "Stok Durumu", "Ürün Linki", "Görsel Linki"])

    for p in products:
        writer.writerow(
            [
                p.name,
                f"{p.price:.2f}",
                p.currency,
                p.store,
                "Stokta Var" if p.in_stock else "Tükendi",
                p.url,
                p.image_url or "",
            ]
        )

    csv_data = "\ufeff" + output.getvalue()  # UTF-8 BOM for Excel Turkish character support
    filename = f"robo_search_{query.replace(' ', '_')}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
