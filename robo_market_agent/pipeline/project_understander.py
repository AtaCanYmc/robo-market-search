"""
Step 1: Project Requirements Extractor Step
"""

from robo_market_agent.models.agent_models import ProjectRequirements
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.prompts import get_prompt


class ProjectUnderstanderStep(BasePipelineStep[str, ProjectRequirements]):
    """
    Step 1: Understand project description and extract structured ProjectRequirements.
    """

    def execute(self, input_data: str) -> ProjectRequirements:
        system_prompt = get_prompt("system.txt")
        template = get_prompt("understand_project.txt")
        prompt = template.format(user_input=input_data)

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=ProjectRequirements,
            system_prompt=system_prompt,
        )
