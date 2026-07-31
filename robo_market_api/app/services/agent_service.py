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
) -> BaseLLMProvider:
    """
    Factory to instantiate LLM provider with custom user API key or system defaults.
    """
    provider = (provider_name or "gemini").lower().strip()

    if provider == "openai":
        return OpenAIProvider(api_key=api_key or "", model_name=model_name or "gpt-4o")
    elif provider == "anthropic":
        return AnthropicProvider(api_key=api_key or "", model_name=model_name or "claude-3-5-sonnet-20241022")
    elif provider == "ollama":
        return OllamaProvider(model_name=model_name or "qwen2.5-coder")
    elif provider == "deepseek":
        return DeepSeekProvider(api_key=api_key or "", model_name=model_name or "deepseek-chat")
    elif provider == "groq":
        return GroqProvider(api_key=api_key or "", model_name=model_name or "llama-3.3-70b-versatile")
    elif provider == "mock":
        return MockLLMProvider()
    else:  # default gemini
        return GeminiProvider(api_key=api_key or "", model_name=model_name or "gemini-2.0-flash")


class APIAgentService:
    """
    Service layer for AI Agent endpoints supporting Bring Your Own API Key (BYOK).
    """

    async def analyze_requirements(
        self,
        prompt: str,
        project_type: Optional[str] = None,
        api_key: Optional[str] = None,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Analyze hardware project requirements using designated LLM provider and BYOK key.
        """
        if not AGENT_AVAILABLE or RoboMarketAgent is None:
            raise APIException(
                status_code=501,
                message="RoboMarketAgent module is not available in environment.",
                error_code="NOT_IMPLEMENTED",
            )

        try:
            llm_provider = create_llm_provider(provider_name=provider, api_key=api_key, model_name=model_name)
            agent_instance = RoboMarketAgent(llm_provider=llm_provider)

            # Execute agent analysis pipeline
            res = agent_instance.run(prompt)
            return {
                "provider": provider or "gemini",
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
    ) -> Dict[str, Any]:
        """
        Generate Bill of Materials (BOM) for hardware requirements using BYOK.
        """
        if not AGENT_AVAILABLE or RoboMarketAgent is None:
            raise APIException(
                status_code=501,
                message="RoboMarketAgent module is not available in environment.",
                error_code="NOT_IMPLEMENTED",
            )

        try:
            llm_provider = create_llm_provider(provider_name=provider, api_key=api_key, model_name=model_name)
            agent_instance = RoboMarketAgent(llm_provider=llm_provider)

            res = agent_instance.run(prompt)
            bom_data = res.bom.model_dump() if hasattr(res.bom, "model_dump") else []
            return {
                "provider": provider or "gemini",
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
