"""
Event / Hook system for robo_market_search allowing extensions, custom loggers, and metrics.
"""

from __future__ import annotations

import logging
from typing import Callable, List

from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.events")

RequestCallback = Callable[[str, str], None]  # (store_name, query)
ProductCallback = Callable[[Product], None]  # (product)
ErrorCallback = Callable[[str, Exception], None]  # (store_name, exception)
ResultCallback = Callable[[str, List[Product]], None]  # (query, products)


class EventDispatcher:
    """Event dispatcher managing hook listeners for client operations."""

    def __init__(self) -> None:
        self._request_listeners: List[RequestCallback] = []
        self._product_listeners: List[ProductCallback] = []
        self._error_listeners: List[ErrorCallback] = []
        self._result_listeners: List[ResultCallback] = []

    def on_request(self, callback: RequestCallback) -> RequestCallback:
        """Register a callback executed before a store request."""
        self._request_listeners.append(callback)
        return callback

    def on_product(self, callback: ProductCallback) -> ProductCallback:
        """Register a callback executed whenever a product is parsed."""
        self._product_listeners.append(callback)
        return callback

    def on_error(self, callback: ErrorCallback) -> ErrorCallback:
        """Register a callback executed when a store search encounters an error."""
        self._error_listeners.append(callback)
        return callback

    def on_result(self, callback: ResultCallback) -> ResultCallback:
        """Register a callback executed when search completes for a query."""
        self._result_listeners.append(callback)
        return callback

    def emit_request(self, store_name: str, query: str) -> None:
        for cb in self._request_listeners:
            try:
                cb(store_name, query)
            except Exception as e:
                logger.error("Error in on_request hook: %s", e)

    def emit_product(self, product: Product) -> None:
        for cb in self._product_listeners:
            try:
                cb(product)
            except Exception as e:
                logger.error("Error in on_product hook: %s", e)

    def emit_error(self, store_name: str, exception: Exception) -> None:
        for cb in self._error_listeners:
            try:
                cb(store_name, exception)
            except Exception as e:
                logger.error("Error in on_error hook: %s", e)

    def emit_result(self, query: str, results: List[Product]) -> None:
        for cb in self._result_listeners:
            try:
                cb(query, results)
            except Exception as e:
                logger.error("Error in on_result hook: %s", e)
