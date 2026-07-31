"""
Step 3: Hardware Compatibility Validator Step
"""

from pathlib import Path

from robo_market_agent.models.agent_models import BOM, CompatibilityReport
from robo_market_agent.pipeline.base import BasePipelineStep

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


class CompatibilityCheckerStep(BasePipelineStep[BOM, CompatibilityReport]):
    """
    Step 3: Validate electrical voltage, current, pinout, and pin compatibility across BOM.
    """

    def execute(self, input_data: BOM) -> CompatibilityReport:
        system_prompt = (PROMPTS_DIR / "system.txt").read_text(encoding="utf-8")
        template = (PROMPTS_DIR / "compatibility_check.txt").read_text(encoding="utf-8")
        prompt = template.format(bom_json=input_data.model_dump_json(indent=2))

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=CompatibilityReport,
            system_prompt=system_prompt,
        )
