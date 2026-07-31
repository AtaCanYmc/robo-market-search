"""
DeepSeek Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class DeepSeekProvider(BaseLLMProvider):
    """
    DeepSeek API provider implementation (DeepSeek-V3 / DeepSeek-R1).
    Uses OpenAI-compatible client endpoint base_url="https://api.deepseek.com".
    """

    def __init__(self, api_key: str = "", model_name: str = "deepseek-chat", base_url: str = "https://api.deepseek.com"):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = base_url

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            import openai
        except ImportError:
            raise ImportError("openai package is required to use DeepSeekProvider. Install with `pip install openai`.")

        client = (
            openai.OpenAI(api_key=self.api_key, base_url=self.base_url)
            if self.api_key
            else openai.OpenAI(base_url=self.base_url)
        )
        schema_json = response_model.model_json_schema()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append(
            {
                "role": "user",
                "content": f"{prompt}\n\nPlease output ONLY valid JSON matching this schema:\n{schema_json}",
            }
        )

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            response_format={"type": "json_object"},
        )
        content_text = response.choices[0].message.content or "{}"
        return response_model.model_validate_json(content_text)

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            import openai
        except ImportError:
            raise ImportError("openai package is required to use DeepSeekProvider. Install with `pip install openai`.")

        client = (
            openai.OpenAI(api_key=self.api_key, base_url=self.base_url)
            if self.api_key
            else openai.OpenAI(base_url=self.base_url)
        )
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
        )
        return response.choices[0].message.content or ""
