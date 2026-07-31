"""
Health check API endpoints.
"""

from fastapi import APIRouter

from robo_market_api.app.core.config import settings
from robo_market_api.app.models.responses import HealthResponse

router = APIRouter(tags=["Health Check"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Returns status ok if API service is healthy and operational.",
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.
    """
    return HealthResponse(status="ok", version=settings.API_VERSION)
