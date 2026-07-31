"""
Cart Optimization API Endpoints.
"""

import asyncio

from fastapi import APIRouter, Depends

from robo_market_api.app.dependencies.services import get_search_service
from robo_market_api.app.models.requests import OptimizeRequest
from robo_market_api.app.models.responses import ErrorResponse, OptimizationResponse
from robo_market_api.app.services.search_service import APISearchService

router = APIRouter(prefix="/optimize", tags=["Cart Optimization"])


@router.post(
    "",
    response_model=OptimizationResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Optimize Multi-Item Component Cart Across Stores",
    description="Calculate split cart cost, shipping fees, and free shipping thresholds for a list of components.",
)
async def optimize_cart(
    payload: OptimizeRequest,
    service: APISearchService = Depends(get_search_service),
) -> OptimizationResponse:
    """
    Cart optimization endpoint.
    """

    def _exec() -> dict:
        try:
            res = service.unified_client.cart_search(payload.items)
            return {
                "total_cost": getattr(res, "total_cost", None),
                "summary": str(res),
            }
        except Exception:
            # Fallback batch search calculation if cart_search fails
            batch_res = service.core_service.search_multiple(payload.items)
            return {
                "total_cost": None,
                "items_found": {k: len(v) for k, v in batch_res.items()},
            }

    details = await asyncio.to_thread(_exec)
    total_cost = details.get("total_cost")

    return OptimizationResponse(
        success=True,
        message="Cart optimization processed",
        total_cost=total_cost,
        details=details,
    )
