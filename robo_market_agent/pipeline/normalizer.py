"""
Step 5: Product Normalizer Step
Recognizes variant naming conventions (e.g., ESP32 DevKit, NodeMCU, ESP-WROOM-32) as related products.
"""

import difflib
from typing import List

from robo_market_agent.models.agent_models import ComponentSearchResult
from robo_market_agent.pipeline.base import BasePipelineStep


class ProductNormalizerStep(BasePipelineStep[List[ComponentSearchResult], List[ComponentSearchResult]]):
    """
    Step 5: Normalize products and group variants.
    """

    def execute(self, input_data: List[ComponentSearchResult]) -> List[ComponentSearchResult]:
        normalized_list: List[ComponentSearchResult] = []
        for item in input_data:
            target_name = item.component.name.lower()
            # Sort matches by title similarity to target component name
            sorted_matches = sorted(
                item.matches,
                key=lambda m: difflib.SequenceMatcher(None, target_name, m.name.lower()).ratio(),
                reverse=True,
            )
            normalized_list.append(
                ComponentSearchResult(
                    component=item.component,
                    query_used=item.query_used,
                    matches=sorted_matches,
                )
            )
        return normalized_list
