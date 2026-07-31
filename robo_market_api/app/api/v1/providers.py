"""
Store Providers API Endpoints.
"""

from fastapi import APIRouter, Depends, Path

from robo_market_api.app.core.errors import APIException
from robo_market_api.app.dependencies.services import get_search_service
from robo_market_api.app.models.requests import ProviderSearchRequest
from robo_market_api.app.models.responses import ErrorResponse, ProviderListResponse, ProviderSearchResponse
from robo_market_api.app.services.search_service import APISearchService

router = APIRouter(prefix="/providers", tags=["Store Providers"])


@router.get(
    "/",
    response_model=ProviderListResponse,
    summary="List Supported Store Providers",
    description="Returns metadata and status for all integrated electronic component stores.",
)
async def list_providers(
    service: APISearchService = Depends(get_search_service),
) -> ProviderListResponse:
    """
    Get supported providers list.
    """
    providers = service.get_providers()
    return ProviderListResponse(success=True, count=len(providers), providers=providers)


@router.post(
    "/{provider}",
    response_model=ProviderSearchResponse,
    responses={400: {"model": ErrorResponse}, 422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Search Specific Store Provider",
    description="Search products exclusively targeting a single store provider (robotistan, robolink, robo90, direncnet).",
)
async def search_specific_provider(
    payload: ProviderSearchRequest,
    provider: str = Path(..., description="Store provider identifier"),
    service: APISearchService = Depends(get_search_service),
) -> ProviderSearchResponse:
    """
    Search specific provider endpoint.
    """
    valid_providers = [p.name for p in service.get_providers()]
    normalized_provider = provider.lower().strip()

    if normalized_provider not in valid_providers:
        raise APIException(
            status_code=400,
            message=f"Unsupported store provider '{provider}'. Supported providers are: {', '.join(valid_providers)}",
            error_code="INVALID_PROVIDER",
        )

    products = await service.search_provider(
        provider=normalized_provider,
        query=payload.query,
        limit=payload.limit,
    )

    return ProviderSearchResponse(
        success=True,
        provider=normalized_provider,
        count=len(products),
        products=products,
    )
