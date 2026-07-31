"""
Unit tests for LLM Providers interface and Mock provider.
"""

from robo_market_agent.models.agent_models import ProjectRequirements
from robo_market_agent.providers.mock_provider import MockLLMProvider


def test_mock_llm_provider():
    provider = MockLLMProvider()
    reqs = provider.generate_structured("I want an irrigation system", ProjectRequirements)

    assert isinstance(reqs, ProjectRequirements)
    assert reqs.project_type == "Automated Irrigation System"
    assert "WiFi" in reqs.wireless_protocol

    text_resp = provider.generate_text("Explain the project")
    assert isinstance(text_resp, str)
    assert len(text_resp) > 0
