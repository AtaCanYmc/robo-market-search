"""
SEO & Bot Metadata Endpoints (robots.txt, sitemap.xml, llm.txt).
"""

from __future__ import annotations

from fastapi import APIRouter, Response

router = APIRouter(tags=["SEO"])


@router.get("/robots.txt", include_in_schema=False)
async def robots_txt() -> Response:
    """Robots.txt dosyasını sunar."""
    content = """User-agent: *
Allow: /
Disallow: /search
Disallow: /export/

Sitemap: https://robo-market-search.vercel.app/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")


@router.get("/sitemap.xml", include_in_schema=False)
async def sitemap_xml() -> Response:
    """Sitemap.xml dosyasını sunar."""
    content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://robo-market-search.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://robo-market-search.vercel.app/api/docs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://robo-market-search.vercel.app/llm.txt</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
"""
    return Response(content=content, media_type="application/xml")


@router.get("/llm.txt", include_in_schema=False)
async def llm_txt() -> Response:
    """LLM / AI Bot Rehberi (llm.txt) sunar."""
    content = """# Robo Market Search (AI / LLM Guide)

> Robo Market Search is a unified, real-time search engine and client library for Turkish electronics & robotics stores (Robotistan, Robolink, Robo90, Direnç.net).

## Core Capabilities
- **Real-Time Parallel Scraping**: Concurrent search across all 4 markets with price normalization and live stock detection.
- **Cart Optimization**: Finds the cheapest single-store or multi-store split combination considering shipping rates.
- **Async & SQLite Caching**: High-performance asyncio engine with automatic TTL caching.

## Endpoints & API Reference
- Main Search Web Interface: https://robo-market-search.vercel.app/
- OpenAPI / Swagger Docs: https://robo-market-search.vercel.app/api/docs
- ReDoc API Docs: https://robo-market-search.vercel.app/api/redoc
- JSON Export Endpoint: `GET /export/json?query={term}`
- CSV Export Endpoint: `GET /export/csv?query={term}`

## Python Package Usage
```python
from robo_market_search.unified.client import UnifiedSearchClient

client = UnifiedSearchClient()

# Search across 4 stores (sorted by price)
products = client.search(query="ESP32", limit_per_store=5)

# Async search
products = await client.search_async(query="Arduino Uno", limit_per_store=5)
```

## Source Code & Licensing
- GitHub Repository: https://github.com/AtaCanYmc/robo-market-search
- License: Apache 2.0
"""
    return Response(content=content, media_type="text/plain; charset=utf-8")
