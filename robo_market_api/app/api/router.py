"""
Main API Router aggregating versioned endpoints.
"""

from fastapi import APIRouter

from robo_market_api.app.api.v1 import v1_router
from robo_market_api.app.core.config import settings

api_router = APIRouter()
api_router.include_router(v1_router, prefix=settings.API_V1_PREFIX)

__all__ = ["api_router"]
