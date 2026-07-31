"""
Anthropic Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar, cast

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class AnthropicProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = "claude-3-5-sonnet-20241022"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            import anthropic
        except ImportError:
            raise ImportError("anthropic package is required to use AnthropicProvider. Install with `pip install anthropic`.")

        client = anthropic.Anthropic(api_key=self.api_key) if self.api_key else anthropic.Anthropic()
        schema_json = response_model.model_json_schema()
        full_prompt = f"{prompt}\n\nPlease output ONLY valid JSON matching this schema:\n{schema_json}"

        response = client.messages.create(
            model=self.model_name,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": full_prompt}],
        )
        content_text = response.content[0].text
        return response_model.model_validate_json(content_text)

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            import anthropic
        except ImportError:
            raise ImportError("anthropic package is required to use AnthropicProvider. Install with `pip install anthropic`.")

        client = anthropic.Anthropic(api_key=self.api_key) if self.api_key else anthropic.Anthropic()
        response = client.messages.create(
            model=self.model_name,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}],
        )
        return cast("str", response.content[0].text)
