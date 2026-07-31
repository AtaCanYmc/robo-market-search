"""
Prompt loading utilities for robo_market_agent with safe fallback defaults.
"""

from pathlib import Path

PROMPTS_DIR = Path(__file__).parent

DEFAULT_PROMPTS = {
    "system.txt": "You are RoboMarketAgent, an expert hardware engineering and electronics shopping assistant in Turkey.",
    "understand_project.txt": "Analyze the following user project description and extract structured requirements:\nUser Description: {user_input}",
    "generate_bom.txt": "Generate a detailed Bill of Materials (BOM) for the following project requirements:\n{requirements_json}",
    "compatibility_check.txt": "Validate electrical voltage, pinout, and component compatibility for this BOM:\n{bom_json}",
    "summarize_report.txt": "Generate a comprehensive Markdown summary report for this hardware build:\nRequirements: {requirements_summary}\nBOM: {bom_summary}\nCompatibility: {compatibility_summary}\nOptimization: {optimization_summary}",
}


def get_prompt(filename: str) -> str:
    """
    Safely load prompt text from file or return fallback default if file is missing.
    """
    file_path = PROMPTS_DIR / filename
    if file_path.exists():
        try:
            return file_path.read_text(encoding="utf-8")
        except Exception:
            pass
    return DEFAULT_PROMPTS.get(filename, "")
