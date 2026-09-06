"""
AI Hardware Agent API Endpoints supporting Bring Your Own API Key (BYOK).
"""

from typing import Optional

from fastapi import APIRouter, Depends, Header

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
    description="Analyze natural language hardware description and identify required components with OpenAI-format and custom API key support.",
)
async def agent_analyze(
    payload: AgentRequest,
    agent_service: APIAgentService = Depends(get_agent_service),
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
    x_api_key: Optional[str] = Header(default=None, alias="X-API-Key"),
    x_openai_key: Optional[str] = Header(default=None, alias="X-OpenAI-API-Key"),
    x_openai_base_url: Optional[str] = Header(default=None, alias="X-OpenAI-Base-URL"),
    x_base_url: Optional[str] = Header(default=None, alias="X-Base-URL"),
    x_openai_model: Optional[str] = Header(default=None, alias="X-OpenAI-Model"),
    x_gemini_key: Optional[str] = Header(default=None, alias="X-Gemini-API-Key"),
    x_anthropic_key: Optional[str] = Header(default=None, alias="X-Anthropic-API-Key"),
    x_provider: Optional[str] = Header(default=None, alias="X-Provider"),
) -> AgentResponse:
    """
    AI Agent project analysis endpoint with Bring Your Own API Key (BYOK)
    and Direct OpenAI-compatible Connection Schema.
    """
    # Extract Bearer token if present
    auth_bearer = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_bearer = authorization[7:].strip()

    # Header & Payload precedence calculation
    effective_api_key = (
        payload.api_key
        or x_openai_key
        or auth_bearer
        or x_api_key
        or x_gemini_key
        or x_anthropic_key
    )
    effective_base_url = (
        payload.base_url
        or x_openai_base_url
        or x_base_url
    )
    effective_model = (
        payload.model_name
        or x_openai_model
    )
    effective_provider = payload.provider or x_provider or "openai"

    result = await agent_service.analyze_requirements(
        prompt=payload.prompt,
        project_type=payload.project_type,
        api_key=effective_api_key,
        provider=effective_provider,
        model_name=effective_model,
        base_url=effective_base_url,
        temperature=payload.temperature,
    )
    return AgentResponse(
        success=True,
        message="Analysis completed successfully",
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
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
    x_api_key: Optional[str] = Header(default=None, alias="X-API-Key"),
    x_openai_key: Optional[str] = Header(default=None, alias="X-OpenAI-API-Key"),
    x_openai_base_url: Optional[str] = Header(default=None, alias="X-OpenAI-Base-URL"),
    x_base_url: Optional[str] = Header(default=None, alias="X-Base-URL"),
    x_openai_model: Optional[str] = Header(default=None, alias="X-OpenAI-Model"),
    x_provider: Optional[str] = Header(default=None, alias="X-Provider"),
) -> AgentResponse:
    """
    AI Agent BOM generation endpoint with BYOK and OpenAI connection support.
    """
    auth_bearer = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_bearer = authorization[7:].strip()

    effective_api_key = payload.api_key or x_openai_key or auth_bearer or x_api_key
    effective_base_url = payload.base_url or x_openai_base_url or x_base_url
    effective_model = payload.model_name or x_openai_model
    effective_provider = payload.provider or x_provider or "openai"

    result = await agent_service.generate_bom(
        prompt=payload.prompt,
        budget=payload.budget,
        api_key=effective_api_key,
        provider=effective_provider,
        model_name=effective_model,
        base_url=effective_base_url,
        temperature=payload.temperature,
    )
    return AgentResponse(
        success=True,
        message="BOM generation completed successfully",
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
    res = await search_service.batch_search(queries=payload.items)
    return OptimizationResponse(
        success=True,
        message="Agent cart optimization completed",
        total_cost=None,
        details={"matched_items": {k: len(v) for k, v in res.items()}},
    )
