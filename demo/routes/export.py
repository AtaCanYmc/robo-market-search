"""
Export Endpoints (JSON & CSV Data Downloads).
"""

from __future__ import annotations

import csv
import io
import json
import logging

from fastapi import APIRouter, Response

from robo_market_search.unified.client import UnifiedSearchClient

logger = logging.getLogger("demo.routes.export")

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/json", include_in_schema=False)
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


@router.get("/csv", include_in_schema=False)
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
