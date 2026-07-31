"""
Abstract Base Pipeline Step class for robo_market_agent.
Each pipeline step is implemented as an independent class following SOLID principles.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from robo_market_agent.providers.base import BaseLLMProvider

InputT = TypeVar("InputT")
OutputT = TypeVar("OutputT")


class BasePipelineStep(ABC, Generic[InputT, OutputT]):
    """
    Independent pipeline step executing a single step in the agent workflow.
    """

    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm = llm_provider

    @abstractmethod
    def execute(self, input_data: InputT) -> OutputT:
        """
        Execute the step logic.
        """
        pass
