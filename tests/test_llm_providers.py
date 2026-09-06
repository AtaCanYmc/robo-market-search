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


def test_openai_connection_config_and_provider():
    from robo_market_agent.models.agent_models import OpenAIConnectionConfig
    from robo_market_agent.providers import OpenAIProvider

    # Test direct config instantiation
    config = OpenAIConnectionConfig(
        api_key="sk-test-key",
        base_url="https://openrouter.ai/api/v1",
        model_name="openai/gpt-4o",
        temperature=0.7,
        organization="org-123",
        extra_headers={"HTTP-Referer": "https://robomarket.com"},
    )
    assert config.api_key == "sk-test-key"
    assert config.base_url == "https://openrouter.ai/api/v1"
    assert config.model_name == "openai/gpt-4o"
    assert config.temperature == 0.7

    # Test OpenAIProvider initialized from config
    provider = OpenAIProvider(config=config)
    assert provider.api_key == "sk-test-key"
    assert provider.base_url == "https://openrouter.ai/api/v1"
    assert provider.model_name == "openai/gpt-4o"
    assert provider.temperature == 0.7
    assert provider.organization == "org-123"
    assert provider.extra_headers == {"HTTP-Referer": "https://robomarket.com"}

    # Test export back to config
    exported = provider.to_config()
    assert isinstance(exported, OpenAIConnectionConfig)
    assert exported.base_url == "https://openrouter.ai/api/v1"
    assert exported.model_name == "openai/gpt-4o"


def test_openai_provider_custom_parameters():
    from robo_market_agent.providers import OpenAIProvider

    provider = OpenAIProvider(
        api_key="sk-custom",
        base_url="http://localhost:11434/v1",
        model_name="llama3.1",
        temperature=0.0,
        timeout=30.0,
    )
    assert provider.api_key == "sk-custom"
    assert provider.base_url == "http://localhost:11434/v1"
    assert provider.model_name == "llama3.1"
    assert provider.temperature == 0.0
    assert provider.timeout == 30.0
