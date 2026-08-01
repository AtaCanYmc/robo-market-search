"""
Abstract BaseStore interface and StoreCapability definition for robo_market_search plugins.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from enum import Enum, auto
from typing import List, Set

from robo_market_search.shared.models import Product


class StoreCapability(Enum):
    """Capabilities supported by a store provider."""

    SEARCH = auto()
    STOCK_STATUS = auto()
    IMAGE_URL = auto()
    CATEGORY = auto()
    CART_OPTIMIZATION = auto()


class BaseStore(ABC):
    """
    Abstract base class for all store scrapers/providers in robo_market_search.
    Enables third-party plugins and uniform scraper contracts.
    """

    name: str = "BaseStore"
    capabilities: Set[StoreCapability] = {StoreCapability.SEARCH, StoreCapability.STOCK_STATUS, StoreCapability.IMAGE_URL}

    @abstractmethod
    def search(self, query: str, limit: int = 10) -> List[Product]:
        """
        Execute product search against the store.

        :param query: Search string/keyword.
        :param limit: Maximum number of products to return.
        :return: List of normalized Product objects.
        """
        pass

    def supports(self, capability: StoreCapability) -> bool:
        """Check if store supports a specific capability."""
        return capability in self.capabilities
