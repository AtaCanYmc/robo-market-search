"""
Groq Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar
from pydantic import BaseModel
from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class GroqProvider(BaseLLMProvider):
    """
    Groq Cloud API provider implementation supporting ultra-fast open-weight LLMs (e.g., Llama 3, Mixtral, Qwen).
    """

    def __init__(self, api_key: str = "", model_name: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            from groq import Groq
        except ImportError:
            raise ImportError("groq package is required to use GroqProvider. Install with `pip install groq`.")

        client = Groq(api_key=self.api_key) if self.api_key else Groq()
        schema_json = response_model.model_json_schema()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({
            "role": "user",
            "content": f"{prompt}\n\nPlease output ONLY valid JSON matching this schema:\n{schema_json}",
        })

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            response_format={"type": "json_object"},
        )
        content_text = response.choices[0].message.content or "{}"
        return response_model.model_validate_json(content_text)

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            from groq import Groq
        except ImportError:
            raise ImportError("groq package is required to use GroqProvider. Install with `pip install groq`.")

        client = Groq(api_key=self.api_key) if self.api_key else Groq()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
        )
        return response.choices[0].message.content or ""
