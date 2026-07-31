"""
SearchService implementation.
Provides parallel searching, retries, caching, query normalization, synonym expansion,
fuzzy matching, deduplication, and ranking.
"""

from __future__ import annotations

import difflib
import logging
import time
from typing import Dict, List, Set

from robo_market_search.search.api import search, search_provider
from robo_market_search.shared.models import CartSearchResult, Product
from robo_market_search.unified.client import UnifiedSearchClient
from robo_market_service.cache import ServiceCache
from robo_market_service.models import ServiceSearchRequest, ServiceSearchResult
from robo_market_service.synonym import SynonymExpander

logger = logging.getLogger("robo_market_service")


class SearchService:
    """
    High-level search service managing multi-provider searches, caching,
    synonym expansion, retry logic, fuzzy matching, and deduplication.
    """

    def __init__(
        self,
        use_cache: bool = True,
        cache_ttl_seconds: int = 7200,
        max_retries: int = 2,
        retry_delay_seconds: float = 0.5,
    ):
        self.use_cache = use_cache
        self.cache = ServiceCache(default_ttl_seconds=cache_ttl_seconds) if use_cache else None
        self.synonym_expander = SynonymExpander()
        self.max_retries = max_retries
        self.retry_delay_seconds = retry_delay_seconds
        self.unified_client = UnifiedSearchClient(use_cache=use_cache, cache_ttl_seconds=cache_ttl_seconds)

    def normalize_query(self, query: str) -> str:
        """
        Normalize query string by lowercasing, stripping extra whitespace, and removing special characters.
        """
        clean = " ".join(query.lower().strip().split())
        return clean

    def _deduplicate_products(self, products: List[Product]) -> List[Product]:
        """
        Deduplicate products based on normalized URL or name + store.
        """
        seen: Set[str] = set()
        deduped: List[Product] = []
        for p in products:
            key = p.url.strip().lower() if p.url else f"{p.store.lower()}:{p.name.lower()}"
            if key not in seen:
                seen.add(key)
                deduped.append(p)
        return deduped

    def _rank_products(self, query: str, products: List[Product]) -> List[Product]:
        """
        Rank products based on fuzzy title similarity to the query, stock status, and price.
        """
        clean_q = self.normalize_query(query)

        def score(p: Product) -> float:
            stock_penalty = 0.0 if p.in_stock else 500.0
            ratio = difflib.SequenceMatcher(None, clean_q, p.name.lower()).ratio()
            similarity_penalty = (1.0 - ratio) * 200.0
            return p.price + stock_penalty + similarity_penalty

        return sorted(products, key=score)

    def search_single(self, request: ServiceSearchRequest) -> ServiceSearchResult:
        """
        Execute a search request with retries, optional synonym expansion, deduplication, and ranking.
        """
        norm_q = self.normalize_query(request.query)

        # Check cache
        if self.use_cache and self.cache:
            cached = self.cache.get(norm_q, request.limit_per_store)
            if cached is not None:
                return ServiceSearchResult(
                    query=request.query,
                    products=cached,
                    expanded_queries=[request.query],
                    total_found=len(cached),
                )

        queries_to_search = [norm_q]
        if request.expand_synonyms:
            queries_to_search = self.synonym_expander.expand(norm_q)

        all_products: List[Product] = []

        for q in queries_to_search:
            products_for_q: List[Product] = []
            for attempt in range(self.max_retries + 1):
                try:
                    if request.providers:
                        for prov in request.providers:
                            res = search_provider(prov, q, limit=request.limit_per_store)
                            products_for_q.extend(res)
                    else:
                        res = search(q, limit=request.limit_per_store, use_cache=False)
                        products_for_q.extend(res)
                    break
                except Exception as exc:
                    logger.warning("Search attempt %d failed for query %r: %s", attempt + 1, q, exc)
                    if attempt < self.max_retries:
                        time.sleep(self.retry_delay_seconds * (2**attempt))

            all_products.extend(products_for_q)

        deduped = self._deduplicate_products(all_products)
        ranked = self._rank_products(norm_q, deduped)

        if self.use_cache and self.cache and ranked:
            self.cache.set(norm_q, request.limit_per_store, ranked)

        return ServiceSearchResult(
            query=request.query,
            products=ranked,
            expanded_queries=queries_to_search,
            total_found=len(ranked),
        )

    def search_concurrent(self, queries: List[str], limit_per_store: int = 5) -> Dict[str, ServiceSearchResult]:
        """
        Search multiple component queries concurrently.
        """
        results: Dict[str, ServiceSearchResult] = {}
        for q in queries:
            req = ServiceSearchRequest(query=q, limit_per_store=limit_per_store)
            results[q] = self.search_single(req)
        return results

    def cart_search(self, queries: List[str], limit_per_store: int = 5) -> CartSearchResult:
        """
        Calculate overall store options and split combinations using UnifiedSearchClient.
        """
        return self.unified_client.cart_search(queries, limit_per_store=limit_per_store)
