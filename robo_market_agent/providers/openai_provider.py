"""
OpenAI Provider implementation for BaseLLMProvider.
Supports standard OpenAI endpoints and any OpenAI-compatible provider
(OpenRouter, DeepSeek, Groq, Ollama, vLLM, LM Studio, LocalAI, etc.).
"""

import os
from typing import Dict, Optional, Type, TypeVar, cast

from pydantic import BaseModel

from robo_market_agent.models.agent_models import OpenAIConnectionConfig
from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class OpenAIProvider(BaseLLMProvider):
    """
    OpenAI and OpenAI-compatible Chat Completions API Provider.
    Implements a comprehensive connection schema with configurable base_url, api_key,
    model_name, temperature, timeout, organization, and custom headers.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        base_url: Optional[str] = None,
        organization: Optional[str] = None,
        timeout: Optional[float] = None,
        temperature: Optional[float] = None,
        extra_headers: Optional[Dict[str, str]] = None,
        config: Optional[OpenAIConnectionConfig] = None,
    ):
        default_model = str(os.getenv("OPENAI_MODEL") or "gpt-4o")
        resolved_model = model_name or (config.model_name if config else None) or default_model
        self.model_name: str = resolved_model

        if config is not None:
            self.api_key = api_key if api_key is not None else (config.api_key or os.getenv("OPENAI_API_KEY", ""))
            self.base_url = base_url if base_url is not None else config.base_url
            self.temperature = temperature if temperature is not None else config.temperature
            self.organization = organization or config.organization
            self.timeout = timeout if timeout is not None else config.timeout
            self.extra_headers = extra_headers or config.extra_headers
        else:
            self.api_key = api_key if api_key is not None else os.getenv("OPENAI_API_KEY", "")
            self.base_url = base_url or os.getenv("OPENAI_BASE_URL", None)
            self.temperature = temperature if temperature is not None else 0.2
            self.organization = organization
            self.timeout = timeout or 60.0
            self.extra_headers = extra_headers

    def to_config(self) -> OpenAIConnectionConfig:
        """Return the current connection configuration as an OpenAIConnectionConfig model."""
        return OpenAIConnectionConfig(
            api_key=self.api_key,
            base_url=self.base_url or "https://api.openai.com/v1",
            model_name=self.model_name,
            temperature=self.temperature,
            organization=self.organization,
            timeout=self.timeout,
            extra_headers=self.extra_headers,
        )

    def _get_client(self):
        try:
            import openai
        except ImportError:
            raise ImportError("openai package is required to use OpenAIProvider. Install with `pip install openai`.")

        client_kwargs: Dict[str, object] = {}
        if self.api_key:
            client_kwargs["api_key"] = self.api_key
        if self.base_url:
            client_kwargs["base_url"] = self.base_url
        if self.organization:
            client_kwargs["organization"] = self.organization
        if self.timeout is not None:
            client_kwargs["timeout"] = self.timeout
        if self.extra_headers:
            client_kwargs["default_headers"] = self.extra_headers

        return openai.OpenAI(**client_kwargs)

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        client = self._get_client()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        # 1. Primary approach: Try native OpenAI structured outputs parse
        try:
            response = client.beta.chat.completions.parse(
                model=self.model_name,
                messages=messages,
                response_format=response_model,
                temperature=self.temperature,
            )
            parsed = response.choices[0].message.parsed
            if parsed is not None:
                return cast("T", parsed)
        except Exception:
            pass

        # 2. Resilient fallback for third-party OpenAI-compatible endpoints
        # (Ollama, DeepSeek, OpenRouter, vLLM, LM Studio, etc.) that do not support beta parse
        schema_json = response_model.model_json_schema()
        fallback_messages = []
        if system_prompt:
            fallback_messages.append({"role": "system", "content": system_prompt})
        fallback_messages.append(
            {
                "role": "user",
                "content": f"{prompt}\n\nPlease output ONLY valid JSON matching this schema:\n{schema_json}",
            }
        )

        try:
            response = client.chat.completions.create(
                model=self.model_name,
                messages=fallback_messages,
                response_format={"type": "json_object"},
                temperature=self.temperature,
            )
            content_text = response.choices[0].message.content or "{}"
            return response_model.model_validate_json(content_text)
        except Exception:
            # Ultimate fallback: without json_object response_format
            response = client.chat.completions.create(
                model=self.model_name,
                messages=fallback_messages,
                temperature=self.temperature,
            )
            content_text = response.choices[0].message.content or "{}"
            # Handle possible markdown backticks ```json ... ```
            cleaned = content_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return response_model.model_validate_json(cleaned.strip())

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        client = self._get_client()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=self.temperature,
        )
        return cast("str", response.choices[0].message.content or "")
