"""
API Agent Service wrapping robo_market_agent capabilities.
"""

from typing import Any, Dict, Optional

from robo_market_api.app.core.errors import APIException
from robo_market_api.app.core.logging import logger

try:
    from robo_market_agent import RoboMarketAgent

    AGENT_AVAILABLE = True
except ImportError:
    RoboMarketAgent = None  # type: ignore
    AGENT_AVAILABLE = False


class APIAgentService:
    """
    Service layer for AI Agent endpoints.
    """

    def __init__(self) -> None:
        self.agent = RoboMarketAgent() if AGENT_AVAILABLE and RoboMarketAgent is not None else None

    async def analyze_requirements(self, prompt: str, project_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze hardware project requirements.
        """
        if not AGENT_AVAILABLE or self.agent is None:
            raise APIException(
                status_code=501,
                message="RoboMarketAgent module is not configured or LLM credentials missing.",
                error_code="NOT_IMPLEMENTED",
            )
        try:
            # Execute agent analysis
            res = self.agent.run(prompt)
            return {"raw_output": str(res)}
        except Exception as exc:
            logger.error(f"Agent analysis failed: {exc}")
            raise APIException(
                status_code=500,
                message=f"Agent analysis failed: {exc!s}",
                error_code="AGENT_EXECUTION_ERROR",
            )

    async def generate_bom(self, prompt: str, budget: Optional[float] = None) -> Dict[str, Any]:
        """
        Generate Bill of Materials (BOM) for hardware requirements.
        """
        if not AGENT_AVAILABLE or self.agent is None:
            raise APIException(
                status_code=501,
                message="BOM generation is not implemented yet. LLM provider key required.",
                error_code="NOT_IMPLEMENTED",
            )
        return {"bom": [], "budget": budget}
