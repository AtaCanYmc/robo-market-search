"""
Store provider registry allowing dynamic plugin registration for third-party stores.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Type

from robo_market_search.providers.base import BaseStore

logger = logging.getLogger("robo_market_search.registry")


class StoreRegistry:
    """Registry to manage built-in and 3rd-party store providers."""

    def __init__(self) -> None:
        self._stores: Dict[str, Type[BaseStore]] = {}

    def register(self, store_cls: Type[BaseStore]) -> Type[BaseStore]:
        """Register a store class."""
        store_name = getattr(store_cls, "name", store_cls.__name__)
        if store_name in self._stores:
            logger.info("Overwriting existing store registration for %s", store_name)
        self._stores[store_name] = store_cls
        logger.debug("Registered store provider: %s", store_name)
        return store_cls

    def unregister(self, store_name: str) -> None:
        """Unregister a store provider."""
        if store_name in self._stores:
            del self._stores[store_name]

    def get(self, store_name: str) -> Type[BaseStore]:
        """Retrieve store class by name."""
        if store_name not in self._stores:
            raise KeyError(f"Store '{store_name}' is not registered in StoreRegistry.")
        return self._stores[store_name]

    def list_stores(self) -> List[str]:
        """List all registered store names."""
        return list(self._stores.keys())

    def get_all(self) -> Dict[str, Type[BaseStore]]:
        """Return dict of all registered stores."""
        return dict(self._stores)


# Global default registry
default_registry = StoreRegistry()


def register_store(store_cls: Type[BaseStore]) -> Type[BaseStore]:
    """Decorator / function to register a store with the default global registry."""
    return default_registry.register(store_cls)
