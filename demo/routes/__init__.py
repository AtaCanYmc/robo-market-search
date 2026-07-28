"""
Demo route modules exporter.
"""

from routes.export import router as export_router
from routes.health import router as health_router
from routes.seo import router as seo_router
from routes.views import router as views_router

__all__ = ["export_router", "health_router", "seo_router", "views_router"]
