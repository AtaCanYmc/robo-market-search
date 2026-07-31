"""
Abstract Base LLM Provider definition for robo_market_agent.
All concrete LLM providers (OpenAI, Anthropic, Gemini, Ollama, Mock) must inherit from BaseLLMProvider.
"""

from abc import ABC, abstractmethod
from typing import Type, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseLLMProvider(ABC):
    """
    Abstract LLM Provider interface.
    Decouples robo_market_agent from any specific LLM SDK or vendor.
    """

    @abstractmethod
    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        """
        Generate structured output conforming to a Pydantic model schema.

        Args:
            prompt: User/Task prompt
            response_model: Pydantic model class to parse into
            system_prompt: Optional system instructions

        Returns:
            An instance of response_model populated by the LLM.
        """
        pass

    @abstractmethod
    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        """
        Generate plain text response from the LLM.
        """
        pass
