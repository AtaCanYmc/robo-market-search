"""
Step 4: Component Searcher Step
Performs concurrent store queries via SearchService.
"""

from typing import List

from robo_market_agent.models.agent_models import BOM, ComponentSearchResult, MatchedProduct
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.providers.base import BaseLLMProvider
from robo_market_service.search_service import SearchService


class ComponentSearcherStep(BasePipelineStep[BOM, List[ComponentSearchResult]]):
    """
    Step 4: Search for every component using SearchService concurrently.
    """

    def __init__(self, llm_provider: BaseLLMProvider, search_service: SearchService):
        super().__init__(llm_provider)
        self.search_service = search_service

    def execute(self, input_data: BOM) -> List[ComponentSearchResult]:
        queries = [comp.name for comp in input_data.components]
        service_results = self.search_service.search_concurrent(queries, limit_per_store=5)

        results: List[ComponentSearchResult] = []
        for comp in input_data.components:
            srv_res = service_results.get(comp.name)
            matches: List[MatchedProduct] = []
            if srv_res and srv_res.products:
                for p in srv_res.products:
                    matches.append(
                        MatchedProduct(
                            name=p.name,
                            price=p.price,
                            store=p.store,
                            url=p.url,
                            in_stock=p.in_stock,
                        )
                    )
            results.append(
                ComponentSearchResult(
                    component=comp,
                    query_used=comp.name,
                    matches=matches,
                )
            )
        return results
