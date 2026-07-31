"""
Step 3: Hardware Compatibility Validator Step
"""

from robo_market_agent.models.agent_models import BOM, CompatibilityReport
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.prompts import get_prompt


class CompatibilityCheckerStep(BasePipelineStep[BOM, CompatibilityReport]):
    """
    Step 3: Validate electrical voltage, current, pinout, and pin compatibility across BOM.
    """

    def execute(self, input_data: BOM) -> CompatibilityReport:
        system_prompt = get_prompt("system.txt")
        template = get_prompt("compatibility_check.txt")
        prompt = template.format(bom_json=input_data.model_dump_json(indent=2))

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=CompatibilityReport,
            system_prompt=system_prompt,
        )
