"""
DeepSeek Provider implementation using standard OpenAI format.
"""

from robo_market_agent.providers.openai_provider import OpenAIProvider


class DeepSeekProvider(OpenAIProvider):
    """
    DeepSeek API provider implementation (DeepSeek-V3 / DeepSeek-R1).
    Uses OpenAI-compatible client endpoint base_url="https://api.deepseek.com".
    """

    def __init__(
        self,
        api_key: str = "",
        model_name: str = "deepseek-chat",
        base_url: str = "https://api.deepseek.com",
        **kwargs,
    ):
        super().__init__(api_key=api_key, model_name=model_name, base_url=base_url, **kwargs)
