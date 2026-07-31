"""
API Search Service wrapping core robo_market_service and robo_market_search functions.
"""

import asyncio
from typing import Dict, List, Optional

from robo_market_api.app.models.responses import ProductModel, ProviderInfo
from robo_market_search import Product, UnifiedSearchClient, search_provider
from robo_market_service import SearchService as CoreSearchService
from robo_market_service import ServiceSearchRequest


class APISearchService:
    """
    Search service interface for REST API layer.
    Executes synchronous core scraping and caching logic off the main async event loop.
    """

    SUPPORTED_PROVIDERS = [
        ProviderInfo(name="robotistan", display_name="Robotistan", base_url="https://www.robotistan.com", status="active"),
        ProviderInfo(
            name="robolink", display_name="Robolink Market", base_url="https://www.robolinkmarket.com", status="active"
        ),
        ProviderInfo(name="robo90", display_name="Robo90", base_url="https://www.robo90.com", status="active"),
        ProviderInfo(name="direncnet", display_name="Direnç.net", base_url="https://www.direnc.net", status="active"),
    ]

    def __init__(self) -> None:
        self.core_service = CoreSearchService()
        self.unified_client = UnifiedSearchClient()

    def _convert_product(self, product: Product) -> ProductModel:
        """
        Convert core Product dataclass to API ProductModel Pydantic model.
        """
        price_val = float(product.price) if product.price is not None else 0.0
        formatted_price = f"{price_val:,.2f} TL".replace(",", "X").replace(".", ",").replace("X", ".")

        # Resolve store string safely
        store_str = getattr(product.store, "value", str(product.store)).lower()

        return ProductModel(
            title=product.name or product.title or "",
            price=price_val,
            formatted_price=formatted_price,
            url=product.url or "",
            image_url=getattr(product, "image_url", None) or getattr(product, "image", None),
            store=store_str,
            in_stock=getattr(product, "in_stock", True),
            sku=getattr(product, "sku", None),
        )

    async def search(
        self,
        query: str,
        limit: Optional[int] = None,
        sort_by_price: bool = True,
        use_cache: bool = True,
        expand_synonyms: bool = True,
    ) -> List[ProductModel]:
        """
        Perform product search off-thread.
        """

        def _exec() -> List[Product]:
            req = ServiceSearchRequest(
                query=query,
                limit_per_store=limit or 10,
                expand_synonyms=expand_synonyms,
            )
            res = self.core_service.search_single(req)
            return res.products

        products = await asyncio.to_thread(_exec)
        return [self._convert_product(p) for p in products]

    async def batch_search(
        self,
        queries: List[str],
        limit: Optional[int] = 5,
    ) -> Dict[str, List[ProductModel]]:
        """
        Perform batch search for multiple queries.
        """
        results: Dict[str, List[ProductModel]] = {}
        for q in queries:
            results[q] = await self.search(query=q, limit=limit)
        return results

    async def search_provider(
        self,
        provider: str,
        query: str,
        limit: Optional[int] = None,
    ) -> List[ProductModel]:
        """
        Search targeting a single store provider.
        """

        def _exec() -> List[Product]:
            return search_provider(provider_name=provider, query=query, limit=limit)

        products = await asyncio.to_thread(_exec)
        return [self._convert_product(p) for p in products]

    def get_providers(self) -> List[ProviderInfo]:
        """
        Return supported store providers.
        """
        return self.SUPPORTED_PROVIDERS
