"""
Product Search API Endpoints.
"""

from fastapi import APIRouter, Depends

from robo_market_api.app.dependencies.services import get_search_service
from robo_market_api.app.models.requests import BatchSearchRequest, SearchRequest
from robo_market_api.app.models.responses import BatchSearchResponse, ErrorResponse, SearchResponse
from robo_market_api.app.services.search_service import APISearchService

router = APIRouter(prefix="/search", tags=["Product Search"])


@router.post(
    "",
    response_model=SearchResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Search Products Across All Turkish Stores",
    description="Unified search querying Robotistan, Robolink, Robo90, and Direnç.net in parallel.",
)
async def search_products(
    payload: SearchRequest,
    service: APISearchService = Depends(get_search_service),
) -> SearchResponse:
    """
    Search products endpoint.
    """
    products = await service.search(
        query=payload.query,
        limit=payload.limit,
        sort_by_price=payload.sort_by_price,
        use_cache=payload.use_cache,
        expand_synonyms=payload.expand_synonyms,
    )
    return SearchResponse(
        success=True,
        query=payload.query,
        count=len(products),
        products=products,
    )


@router.post(
    "/batch",
    response_model=BatchSearchResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Batch Search Multiple Components",
    description="Execute multiple product queries simultaneously across stores.",
)
async def batch_search_products(
    payload: BatchSearchRequest,
    service: APISearchService = Depends(get_search_service),
) -> BatchSearchResponse:
    """
    Batch search endpoint.
    """
    results = await service.batch_search(
        queries=payload.queries,
        limit=payload.limit,
    )
    return BatchSearchResponse(
        success=True,
        count=len(results),
        results=results,
    )
