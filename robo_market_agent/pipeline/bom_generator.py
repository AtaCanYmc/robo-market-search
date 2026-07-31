"""
Step 2: Bill of Materials (BOM) Generator Step
"""

from pathlib import Path

from robo_market_agent.models.agent_models import BOM, ProjectRequirements
from robo_market_agent.pipeline.base import BasePipelineStep

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


class BOMGeneratorStep(BasePipelineStep[ProjectRequirements, BOM]):
    """
    Step 2: Generate complete hardware Bill of Materials (BOM) from requirements.
    """

    def execute(self, input_data: ProjectRequirements) -> BOM:
        system_prompt = (PROMPTS_DIR / "system.txt").read_text(encoding="utf-8")
        template = (PROMPTS_DIR / "generate_bom.txt").read_text(encoding="utf-8")
        prompt = template.format(requirements_json=input_data.model_dump_json(indent=2))

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=BOM,
            system_prompt=system_prompt,
        )
