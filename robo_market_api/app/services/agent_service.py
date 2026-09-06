"""
API Agent Service wrapping robo_market_agent capabilities with Bring Your Own API Key (BYOK) support.
"""

from typing import Any, Dict, Optional

from robo_market_api.app.core.errors import APIException
from robo_market_api.app.core.logging import logger

try:
    from robo_market_agent import RoboMarketAgent
    from robo_market_agent.providers import (
        AnthropicProvider,
        BaseLLMProvider,
        DeepSeekProvider,
        GeminiProvider,
        GroqProvider,
        MockLLMProvider,
        OllamaProvider,
        OpenAIProvider,
    )

    AGENT_AVAILABLE = True
except ImportError:
    RoboMarketAgent = None  # type: ignore
    AGENT_AVAILABLE = False


def create_llm_provider(
    provider_name: Optional[str] = None,
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
    base_url: Optional[str] = None,
    temperature: Optional[float] = None,
    organization: Optional[str] = None,
    extra_headers: Optional[Dict[str, str]] = None,
) -> BaseLLMProvider:
    """
    Factory to instantiate LLM provider with custom user API key or system defaults.
    Direct OpenAI format is the default AI connection.
    """
    from robo_market_api.app.core.config import settings

    provider = (provider_name or settings.ROBO_AGENT_PROVIDER or "openai").lower().strip()
    effective_api_key = api_key or settings.OPENAI_API_KEY or settings.ROBO_AGENT_KEY or ""
    effective_base_url = base_url or settings.OPENAI_BASE_URL or settings.ROBO_AGENT_BASE_URL
    effective_model = model_name or settings.OPENAI_MODEL or settings.ROBO_AGENT_MODEL

    if provider == "openai":
        return OpenAIProvider(
            api_key=effective_api_key,
            model_name=effective_model or "gpt-4o",
            base_url=effective_base_url,
            temperature=temperature,
            organization=organization,
            extra_headers=extra_headers,
        )
    elif provider == "deepseek":
        return DeepSeekProvider(
            api_key=effective_api_key,
            model_name=effective_model or "deepseek-chat",
            base_url=effective_base_url or "https://api.deepseek.com",
            temperature=temperature,
        )
    elif provider == "groq":
        return GroqProvider(api_key=effective_api_key, model_name=effective_model or "llama-3.3-70b-versatile")
    elif provider == "anthropic":
        return AnthropicProvider(api_key=effective_api_key, model_name=effective_model or "claude-3-5-sonnet-20241022")
    elif provider == "ollama":
        return OllamaProvider(
            host=effective_base_url or effective_api_key or "http://localhost:11434", model_name=effective_model or "llama3.1"
        )
    elif provider == "mock":
        return MockLLMProvider()
    elif provider == "gemini":
        return GeminiProvider(api_key=effective_api_key, model_name=effective_model or "gemini-2.0-flash")
    else:
        # Fallback to direct OpenAI-compatible format for any custom provider
        return OpenAIProvider(
            api_key=effective_api_key,
            model_name=effective_model or "gpt-4o",
            base_url=effective_base_url,
            temperature=temperature,
            organization=organization,
            extra_headers=extra_headers,
        )


class APIAgentService:
    """
    Service layer for AI Agent endpoints supporting Bring Your Own API Key (BYOK)
    and Direct OpenAI-compatible Connection Schema.
    """

    async def analyze_requirements(
        self,
        prompt: str,
        project_type: Optional[str] = None,
        api_key: Optional[str] = None,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: Optional[float] = None,
        organization: Optional[str] = None,
        extra_headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Analyze hardware project requirements using designated LLM provider and BYOK key / OpenAI format.
        """
        if not AGENT_AVAILABLE or RoboMarketAgent is None:
            raise APIException(
                status_code=501,
                message="RoboMarketAgent module is not available in environment.",
                error_code="NOT_IMPLEMENTED",
            )

        try:
            llm_provider = create_llm_provider(
                provider_name=provider,
                api_key=api_key,
                model_name=model_name,
                base_url=base_url,
                temperature=temperature,
                organization=organization,
                extra_headers=extra_headers,
            )
            agent_instance = RoboMarketAgent(llm_provider=llm_provider)

            # Execute agent analysis pipeline
            res = agent_instance.run(prompt)
            return {
                "provider": provider or "openai",
                "byok_active": bool(api_key),
                "requirements": res.project_requirements.model_dump()
                if hasattr(res.project_requirements, "model_dump")
                else str(res.project_requirements),
                "bom": res.bom.model_dump() if hasattr(res.bom, "model_dump") else str(res.bom),
                "compatibility": res.compatibility_report.model_dump()
                if hasattr(res.compatibility_report, "model_dump")
                else str(res.compatibility_report),
                "optimization": res.optimization_result.model_dump()
                if hasattr(res.optimization_result, "model_dump")
                else str(res.optimization_result),
                "report_summary": res.summary_markdown,
            }
        except Exception as exc:
            logger.error(f"Agent analysis failed: {exc}")
            # If execution failed due to provider auth or key missing
            raise APIException(
                status_code=400 if "API key" in str(exc) or "auth" in str(exc).lower() else 500,
                message=f"Agent analysis failed: {exc!s}. Please check your LLM API Key.",
                error_code="AGENT_EXECUTION_ERROR",
            )

    async def generate_bom(
        self,
        prompt: str,
        budget: Optional[float] = None,
        api_key: Optional[str] = None,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: Optional[float] = None,
        organization: Optional[str] = None,
        extra_headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate Bill of Materials (BOM) for hardware requirements using BYOK and OpenAI format.
        """
        if not AGENT_AVAILABLE or RoboMarketAgent is None:
            raise APIException(
                status_code=501,
                message="RoboMarketAgent module is not available in environment.",
                error_code="NOT_IMPLEMENTED",
            )

        try:
            llm_provider = create_llm_provider(
                provider_name=provider,
                api_key=api_key,
                model_name=model_name,
                base_url=base_url,
                temperature=temperature,
                organization=organization,
                extra_headers=extra_headers,
            )
            agent_instance = RoboMarketAgent(llm_provider=llm_provider)

            res = agent_instance.run(prompt)
            bom_data = res.bom.model_dump() if hasattr(res.bom, "model_dump") else []
            return {
                "provider": provider or "openai",
                "byok_active": bool(api_key),
                "bom": bom_data,
                "budget": budget,
            }
        except Exception as exc:
            logger.error(f"BOM generation failed: {exc}")
            raise APIException(
                status_code=500,
                message=f"BOM generation failed: {exc!s}. Please check your LLM API Key.",
                error_code="AGENT_EXECUTION_ERROR",
            )
