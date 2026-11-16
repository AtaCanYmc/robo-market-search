"""
Data models for robo_market_service layer.
"""

from dataclasses import dataclass, field
from typing import List, Optional

from robo_market_search.shared.models import Product


@dataclass
class ServiceSearchRequest:
    query: str
    limit_per_store: int = 10
    use_synonyms: bool = True
    expand_synonyms: bool = False
    providers: Optional[List[str]] = None


@dataclass
class ServiceSearchResult:
    query: str
    products: List[Product]
    expanded_queries: List[str] = field(default_factory=list)
    total_found: int = 0
