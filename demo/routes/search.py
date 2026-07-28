"""
Main web views router (Index, Search).
"""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING

from fastapi import APIRouter, Form, Request, status
from fastapi.responses import HTMLResponse

if TYPE_CHECKING:
    from fastapi.templating import Jinja2Templates

logger = logging.getLogger("demo.routes")

router = APIRouter()


@router.get("/", response_class=HTMLResponse, include_in_schema=False)
async def index(request: Request) -> HTMLResponse:
    """Ana sayfa — boş arama arayüzü."""
    templates: Jinja2Templates = request.app.state.templates
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/search", response_class=HTMLResponse, include_in_schema=False)
async def search(
    request: Request,
    query: str = Form(...),
    limit: int = Form(5),
) -> HTMLResponse:
    """
    HTMX partial endpoint.

    Arama sorgusunu alır, UnifiedSearchClient ile tüm marketleri
    paralel tarar ve yalnızca sonuç kartları HTML'ini döndürür.
    """
    templates: Jinja2Templates = request.app.state.templates
    query = query.strip()
    if not query:
        return HTMLResponse(content="", status_code=status.HTTP_204_NO_CONTENT)

    limit = max(1, min(limit, 20))  # 1–20 arasında sınırla
    logger.info("Search  query=%r  limit=%d", query, limit)

    try:
        from robo_market_search.unified.client import UnifiedSearchClient

        client = UnifiedSearchClient()
        loop = asyncio.get_event_loop()

        # Senkron scraper'ı thread pool üzerinden asenkron çalıştır.
        products = await loop.run_in_executor(
            None,
            lambda: client.search(query=query, limit_per_store=limit),
        )

        logger.info("Found %d products for %r", len(products), query)

        return templates.TemplateResponse(
            "partials/results.html",
            {
                "request": request,
                "products": products,
                "query": query,
                "limit": limit,
            },
        )

    except Exception as exc:
        logger.exception("Search error for query=%r: %s", query, exc)
        return templates.TemplateResponse(
            "partials/error.html",
            {"request": request, "error": str(exc)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
