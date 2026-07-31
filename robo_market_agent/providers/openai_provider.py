"""
OpenAI Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = "gpt-4o"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            import openai
        except ImportError:
            raise ImportError("openai package is required to use OpenAIProvider. Install with `pip install openai`.")

        client = openai.OpenAI(api_key=self.api_key) if self.api_key else openai.OpenAI()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.beta.chat.completions.parse(
            model=self.model_name,
            messages=messages,
            response_format=response_model,
        )
        return response.choices[0].message.parsed

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            import openai
        except ImportError:
            raise ImportError("openai package is required to use OpenAIProvider. Install with `pip install openai`.")

        client = openai.OpenAI(api_key=self.api_key) if self.api_key else openai.OpenAI()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
        )
        return response.choices[0].message.content or ""
