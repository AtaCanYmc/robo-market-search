"""
Robo Market Search — Web Demo
FastAPI + Jinja2 + HTMX web uygulaması.

Kurulum ve çalıştırma:
    cd demo/
    python -m venv .venv && source .venv/bin/activate
    pip install -e .. && pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import logging
from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from routes.export import router as export_router
from routes.health import router as health_router
from routes.seo import router as seo_router
from routes.views import router as views_router

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("demo")

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"

# ── Jinja2 Templates ─────────────────────────────────────────────────────────
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# ── Store badge colour map (shared with all templates as a global) ────────────
STORE_COLORS: dict[str, str] = {
    "Robotistan": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Robolink": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "Robo90": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "Direncnet": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
}

# Inject once — available in every template without passing it explicitly.
templates.env.globals.update(STORE_COLORS=STORE_COLORS)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Robo Market Search Demo",
    description="Türkiye'nin elektronik marketlerinde gerçek zamanlı paralel arama",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Store templates in app state for access in route handlers
app.state.templates = templates

# ── Include Routers ──────────────────────────────────────────────────────────
app.include_router(views_router)
app.include_router(export_router)
app.include_router(seo_router)
app.include_router(health_router)
