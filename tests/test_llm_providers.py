"""
Unit tests for LLM Providers interface and Mock, Groq, DeepSeek providers.
"""

from robo_market_agent.models.agent_models import ProjectRequirements
from robo_market_agent.providers import DeepSeekProvider, GroqProvider, MockLLMProvider


def test_mock_llm_provider():
    provider = MockLLMProvider()
    reqs = provider.generate_structured("I want an irrigation system", ProjectRequirements)

    assert isinstance(reqs, ProjectRequirements)
    assert reqs.project_type == "Automated Irrigation System"
    assert "WiFi" in reqs.wireless_protocol

    text_resp = provider.generate_text("Explain the project")
    assert isinstance(text_resp, str)
    assert len(text_resp) > 0


def test_groq_and_deepseek_provider_instantiation():
    groq = GroqProvider(api_key="mock_key", model_name="llama-3.3-70b-versatile")
    assert groq.model_name == "llama-3.3-70b-versatile"

    deepseek = DeepSeekProvider(api_key="mock_key", model_name="deepseek-chat")
    assert deepseek.base_url == "https://api.deepseek.com"
    assert deepseek.model_name == "deepseek-chat"
