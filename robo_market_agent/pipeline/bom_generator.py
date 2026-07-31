"""
Step 2: Bill of Materials (BOM) Generator Step
"""

from robo_market_agent.models.agent_models import BOM, ProjectRequirements
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.prompts import get_prompt


class BOMGeneratorStep(BasePipelineStep[ProjectRequirements, BOM]):
    """
    Step 2: Generate complete hardware Bill of Materials (BOM) from requirements.
    """

    def execute(self, input_data: ProjectRequirements) -> BOM:
        system_prompt = get_prompt("system.txt")
        template = get_prompt("generate_bom.txt")
        prompt = template.format(requirements_json=input_data.model_dump_json(indent=2))

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=BOM,
            system_prompt=system_prompt,
        )
