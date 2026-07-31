"""
AI Hardware Agent API Endpoints.
"""

from fastapi import APIRouter, Depends

from robo_market_api.app.dependencies.services import get_agent_service, get_search_service
from robo_market_api.app.models.requests import AgentRequest, OptimizeRequest, SearchRequest
from robo_market_api.app.models.responses import AgentResponse, ErrorResponse, OptimizationResponse, SearchResponse
from robo_market_api.app.services.agent_service import APIAgentService
from robo_market_api.app.services.search_service import APISearchService

router = APIRouter(prefix="/agent", tags=["AI Hardware Agent"])


@router.post(
    "/analyze",
    response_model=AgentResponse,
    responses={501: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="AI Hardware Requirement Analysis",
    description="Analyze natural language hardware description and identify required components.",
)
async def agent_analyze(
    payload: AgentRequest,
    agent_service: APIAgentService = Depends(get_agent_service),
) -> AgentResponse:
    """
    AI Agent project analysis endpoint.
    """
    result = await agent_service.analyze_requirements(prompt=payload.prompt, project_type=payload.project_type)
    return AgentResponse(
        success=True,
        message="Analysis completed",
        data=result,
    )


@router.post(
    "/bom",
    response_model=AgentResponse,
    responses={501: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Generate AI Bill of Materials (BOM)",
    description="Generate structured Bill of Materials with quantities and compatibility validation.",
)
async def agent_bom(
    payload: AgentRequest,
    agent_service: APIAgentService = Depends(get_agent_service),
) -> AgentResponse:
    """
    AI Agent BOM generation endpoint.
    """
    result = await agent_service.generate_bom(prompt=payload.prompt, budget=payload.budget)
    return AgentResponse(
        success=True,
        message="BOM generation completed",
        data=result,
    )


@router.post(
    "/search",
    response_model=SearchResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Agent-Guided Smart Search",
    description="AI-assisted product search with synonym expansion and semantic ranking.",
)
async def agent_search(
    payload: SearchRequest,
    search_service: APISearchService = Depends(get_search_service),
) -> SearchResponse:
    """
    Agent search endpoint.
    """
    products = await search_service.search(
        query=payload.query,
        limit=payload.limit,
        sort_by_price=payload.sort_by_price,
        use_cache=payload.use_cache,
        expand_synonyms=True,
    )
    return SearchResponse(
        success=True,
        query=payload.query,
        count=len(products),
        products=products,
    )


@router.post(
    "/optimize",
    response_model=OptimizationResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Agent Cart Optimization",
    description="AI-enhanced cart optimization and split store purchasing advice.",
)
async def agent_optimize(
    payload: OptimizeRequest,
    search_service: APISearchService = Depends(get_search_service),
) -> OptimizationResponse:
    """
    Agent cart optimization endpoint.
    """
    # Delegates to search_service cart search
    res = await search_service.batch_search(queries=payload.items)
    return OptimizationResponse(
        success=True,
        message="Agent cart optimization completed",
        total_cost=None,
        details={"matched_items": {k: len(v) for k, v in res.items()}},
    )
