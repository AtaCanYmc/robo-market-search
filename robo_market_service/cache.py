"""
Cache service layer for robo_market_service.
Wraps underlying SQLite search cache engine.
"""

import sqlite3
from typing import List, Optional

from robo_market_search.shared.cache import SearchCache
from robo_market_search.shared.models import Product


class ServiceCache:
    """
    Service cache interface providing get and set methods for product search results.
    """

    def __init__(self, db_path: str = "search_cache.db", default_ttl_seconds: int = 7200) -> None:
        self.db_path = db_path
        self._cache = SearchCache(db_path=db_path, default_ttl_seconds=default_ttl_seconds)

    def get(self, query: str, limit: int = 10) -> Optional[List[Product]]:
        return self._cache.get(query, limit)

    def set(self, query: str, limit: int, products: List[Product]) -> None:
        self._cache.set(query, limit, products)

    def clear(self) -> None:
        """Clear cache database table."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM search_cache")
            conn.commit()
