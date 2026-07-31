"""
Ollama Provider implementation for BaseLLMProvider.
"""

from typing import Type, TypeVar

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class OllamaProvider(BaseLLMProvider):
    def __init__(self, host: str = "http://localhost:11434", model_name: str = "llama3.1"):
        self.host = host
        self.model_name = model_name

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        try:
            import ollama
        except ImportError:
            raise ImportError("ollama package is required to use OllamaProvider. Install with `pip install ollama`.")

        client = ollama.Client(host=self.host)
        schema_json = response_model.model_json_schema()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append(
            {
                "role": "user",
                "content": f"{prompt}\nOutput valid JSON matching schema:\n{schema_json}",
            }
        )

        res = client.chat(
            model=self.model_name,
            messages=messages,
            format="json",
        )
        content_text = res["message"]["content"]
        return response_model.model_validate_json(content_text)

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            import ollama
        except ImportError:
            raise ImportError("ollama package is required to use OllamaProvider. Install with `pip install ollama`.")

        client = ollama.Client(host=self.host)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        res = client.chat(model=self.model_name, messages=messages)
        return res["message"]["content"]
