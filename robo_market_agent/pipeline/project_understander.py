"""
Step 1: Project Requirements Extractor Step
"""

from pathlib import Path

from robo_market_agent.models.agent_models import ProjectRequirements
from robo_market_agent.pipeline.base import BasePipelineStep

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


class ProjectUnderstanderStep(BasePipelineStep[str, ProjectRequirements]):
    """
    Step 1: Understand project description and extract structured ProjectRequirements.
    """

    def execute(self, input_data: str) -> ProjectRequirements:
        system_prompt = (PROMPTS_DIR / "system.txt").read_text(encoding="utf-8")
        template = (PROMPTS_DIR / "understand_project.txt").read_text(encoding="utf-8")
        prompt = template.format(user_input=input_data)

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=ProjectRequirements,
            system_prompt=system_prompt,
        )
