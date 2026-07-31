"""
Step 7: Final Report Generator Step
Formats and synthesizes complete agent results into markdown format.
"""

from typing import Any, Dict

from robo_market_agent.models.agent_models import (
    BOM,
    CompatibilityReport,
    FinalAgentReport,
    OptimizationResult,
    ProjectRequirements,
)
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.prompts import get_prompt


class ReportGeneratorStep(BasePipelineStep[Dict[str, Any], FinalAgentReport]):
    """
    Step 7: Generate markdown summary report and wrap into FinalAgentReport.
    """

    def execute(self, input_data: Dict[str, Any]) -> FinalAgentReport:
        reqs: ProjectRequirements = input_data["requirements"]
        bom: BOM = input_data["bom"]
        comp: CompatibilityReport = input_data["compatibility"]
        opt: OptimizationResult = input_data["optimization"]

        system_prompt = get_prompt("system.txt")
        template = get_prompt("summarize_report.txt")

        prompt = template.format(
            requirements_summary=reqs.model_dump_json(indent=2),
            bom_summary=bom.model_dump_json(indent=2),
            compatibility_summary=comp.model_dump_json(indent=2),
            optimization_summary=opt.model_dump_json(indent=2),
        )

        markdown_summary = self.llm.generate_text(prompt=prompt, system_prompt=system_prompt)

        return FinalAgentReport(
            project_requirements=reqs,
            bom=bom,
            compatibility_report=comp,
            optimization_result=opt,
            summary_markdown=markdown_summary,
        )
