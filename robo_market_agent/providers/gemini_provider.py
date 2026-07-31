"""
Gemini Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            from google import genai
            from google.genai import types
        except ImportError:
            raise ImportError(
                "google-genai package is required to use GeminiProvider. Install with `pip install google-genai`."
            )

        client = genai.Client(api_key=self.api_key) if self.api_key else genai.Client()
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=response_model,
            system_instruction=system_prompt if system_prompt else None,
        )
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )
        return response_model.model_validate_json(response.text)

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            from google import genai
            from google.genai import types
        except ImportError:
            raise ImportError(
                "google-genai package is required to use GeminiProvider. Install with `pip install google-genai`."
            )

        client = genai.Client(api_key=self.api_key) if self.api_key else genai.Client()
        config = types.GenerateContentConfig(
            system_instruction=system_prompt if system_prompt else None,
        )
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )
        return response.text or ""
