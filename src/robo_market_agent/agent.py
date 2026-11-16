"""
RoboMarketAgent main orchestrator facade.
Pipeline Execution:
Understand Project -> Extract Requirements -> Generate BOM -> Validate Compatibility
-> Search Components -> Normalize Results -> Optimize Shopping Cart -> Generate Final Report
"""

from typing import Optional

from robo_market_agent.models.agent_models import FinalAgentReport
from robo_market_agent.pipeline import (
    BOMGeneratorStep,
    CompatibilityCheckerStep,
    ComponentSearcherStep,
    ProductNormalizerStep,
    ProjectUnderstanderStep,
    ReportGeneratorStep,
    ShoppingOptimizerStep,
)
from robo_market_agent.providers.base import BaseLLMProvider
from robo_market_agent.providers.mock_provider import MockLLMProvider
from robo_market_service.search_service import SearchService


class RoboMarketAgent:
    """
    AI Hardware Agent Orchestrator.
    Uses dependency injection for LLM provider and SearchService.
    """

    def __init__(
        self,
        llm_provider: Optional[BaseLLMProvider] = None,
        search_service: Optional[SearchService] = None,
    ):
        self.llm_provider = llm_provider or MockLLMProvider()
        self.search_service = search_service or SearchService()

        # Instantiate pipeline steps
        self.step_understander = ProjectUnderstanderStep(self.llm_provider)
        self.step_bom = BOMGeneratorStep(self.llm_provider)
        self.step_compatibility = CompatibilityCheckerStep(self.llm_provider)
        self.step_searcher = ComponentSearcherStep(self.llm_provider, self.search_service)
        self.step_normalizer = ProductNormalizerStep(self.llm_provider)
        self.step_optimizer = ShoppingOptimizerStep(self.llm_provider, self.search_service)
        self.step_reporter = ReportGeneratorStep(self.llm_provider)

    def run(self, user_project_description: str) -> FinalAgentReport:
        """
        Execute the full 7-step hardware planning and shopping optimization pipeline.

        Args:
            user_project_description: Free-form description of desired hardware project

        Returns:
            FinalAgentReport containing structured requirements, BOM, compatibility, cart optimization, and markdown report.
        """
        # Step 1: Understand Project & Extract Requirements
        requirements = self.step_understander.execute(user_project_description)

        # Step 2: Generate BOM
        bom = self.step_bom.execute(requirements)

        # Step 3: Validate Compatibility
        compatibility = self.step_compatibility.execute(bom)

        # Step 4: Search Components Concurrently
        raw_search_results = self.step_searcher.execute(bom)

        # Step 5: Normalize Product Matches
        normalized_results = self.step_normalizer.execute(raw_search_results)

        # Step 6: Optimize Shopping Cart
        optimization = self.step_optimizer.execute(normalized_results)

        # Step 7: Generate Final Report
        report = self.step_reporter.execute(
            {
                "requirements": requirements,
                "bom": bom,
                "compatibility": compatibility,
                "optimization": optimization,
            }
        )

        return report
