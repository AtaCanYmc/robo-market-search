"""
Core functional search interface for robo_market_search.
Zero AI dependencies - direct search helper functions.
"""

from typing import Dict, List

from robo_market_search.direncnet.client import DirencnetClient
from robo_market_search.robo90.client import Robo90Client
from robo_market_search.robolink.client import RobolinkClient
from robo_market_search.robotistan.client import RobotistanClient
from robo_market_search.shared.models import Product
from robo_market_search.unified.client import UnifiedSearchClient

_CLIENT_MAP = {
    "robolink": RobolinkClient,
    "robotistan": RobotistanClient,
    "robo90": Robo90Client,
    "direncnet": DirencnetClient,
}


def search(query: str, limit: int = 10, use_cache: bool = True) -> List[Product]:
    """
    Search across all supported electronic component stores.

    Args:
        query: Search term (e.g. 'esp32 devkit')
        limit: Max results per store
        use_cache: Enable SQLite search cache

    Returns:
        List of matching Product objects sorted by price ascending.
    """
    client = UnifiedSearchClient(use_cache=use_cache)
    return client.search(query, limit_per_store=limit)


def search_multiple(queries: List[str], limit: int = 10, use_cache: bool = True) -> Dict[str, List[Product]]:
    """
    Search for multiple queries concurrently.

    Args:
        queries: List of search queries
        limit: Max results per store for each query
        use_cache: Enable SQLite search cache

    Returns:
        Dictionary mapping query to list of matching Products.
    """
    client = UnifiedSearchClient(use_cache=use_cache)
    results: Dict[str, List[Product]] = {}
    for q in queries:
        results[q] = client.search(q, limit_per_store=limit)
    return results


def search_provider(provider: str, query: str, limit: int = 10) -> List[Product]:
    """
    Search a specific store provider by name.

    Args:
        provider: Store name ('robolink', 'robotistan', 'robo90', 'direncnet')
        query: Search term
        limit: Max results

    Returns:
        List of matching Product objects.
    """
    key = provider.lower().strip()
    if key not in _CLIENT_MAP:
        raise ValueError(f"Unknown provider '{provider}'. Supported providers: {list(_CLIENT_MAP.keys())}")
    client_cls = _CLIENT_MAP[key]
    client = client_cls()
    if key == "robotistan":
        return client.search_component(query, limit, 1)
    elif key == "robo90":
        return client.search_component(query, 1, 1)[:limit]
    else:
        return client.search_component(query, limit)


__all__ = ["search", "search_multiple", "search_provider"]
