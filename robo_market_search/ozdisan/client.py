from concurrent.futures import ThreadPoolExecutor
import json
import logging
import re
from typing import List, Set

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.ozdisan")


@register_store
class OzdisanClient(BaseStore):
    name: str = "Ozdisan"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.api_url = "https://www.ozdisan.com/api/layout/header"
        self.base_url = "https://www.ozdisan.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.ozdisan.com/",
        }

    def search(self, query: str, limit: int = 10) -> List[Product]:
        return self.search_component(query=query, limit=limit)

    def _resolve_category_slug(self, category: dict) -> str:
        slugs = category.get("slugs", [])
        for s in slugs:
            if s.get("langCode") == "tr" or s.get("isDefault"):
                return s.get("slug", "")
        if slugs:
            return slugs[0].get("slug", "")
        return category.get("slug", "")

    def _fetch_product_details(self, product_url: str) -> tuple[float, str, bool]:
        """Fetch individual product page to extract real-time price, currency and stock."""
        try:
            resp = requests.get(product_url, headers=self.headers, impersonate="safari15_5", timeout=5)
            match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', resp.text, re.DOTALL)
            if not match:
                return 0.0, "TL", False

            page_data = json.loads(match.group(1))
            props = page_data.get("props", {}).get("pageProps", {})
            out_of_stock = props.get("outOfStock", True)
            init_price = props.get("initialPrice")
            avail = props.get("data", {}).get("availability", {})
            total_stock = avail.get("totalStock", 0)

            price = 0.0
            currency = "TL"
            if init_price and isinstance(init_price, dict):
                p_data = init_price.get("response", {}).get("data", {})
                packages = p_data.get("packages", [])
                if packages and packages[0].get("priceBreaks"):
                    prices = packages[0]["priceBreaks"][0].get("prices", [])
                    for prc in prices:
                        if prc.get("currency") in ("TRY", "TL"):
                            price = float(prc.get("totalPrice") or prc.get("price") or 0.0)
                            currency = "TL"
                            break
                    if price == 0.0 and prices:
                        price = float(prices[0].get("totalPrice") or prices[0].get("price") or 0.0)
                        currency = prices[0].get("currency", "TL")

            in_stock = (not out_of_stock) and (total_stock > 0)
            return price, currency, in_stock
        except Exception as e:
            logger.debug("Ozdisan product detail fetch failed for %s: %s", product_url, e)
            return 0.0, "TL", False

    def search_component(self, query: str, limit: int = 10, fetch_details: bool = True) -> List[Product]:
        """
        Ozdisan üzerinde arama yapar ve ürünleri döndürür.
        """
        try:
            resp = requests.get(
                self.api_url,
                params={"text": query},
                headers=self.headers,
                impersonate="safari15_5",
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            variants = data.get("variants", [])[:limit]

            # ponytail: concurrency via standard ThreadPoolExecutor up to min(limit, 5) workers
            items_to_fetch = []
            for v in variants:
                sku = v.get("sku", "")
                description = v.get("description", "")
                name = f"{sku} - {description}" if description else sku or "Ürün Adı Yok"

                cat_slug = self._resolve_category_slug(v.get("category", {}))
                var_slug = v.get("slug", "")
                url = f"{self.base_url}/p/{cat_slug}/{var_slug}" if cat_slug and var_slug else f"{self.base_url}/p/{var_slug}"

                image_url = ""
                for media in v.get("medias", []):
                    if media.get("field") == "Picture":
                        image_url = media.get("path", "")
                        break

                items_to_fetch.append(
                    {
                        "name": name,
                        "url": url,
                        "image_url": image_url,
                    }
                )

            if not fetch_details or not items_to_fetch:
                return [
                    Product(
                        name=item["name"],
                        price=0.0,
                        currency="TL",
                        url=item["url"],
                        image_url=item["image_url"],
                        store="Ozdisan",
                        in_stock=False,
                    )
                    for item in items_to_fetch
                ]

            max_workers = min(len(items_to_fetch), 5)
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                details = list(executor.map(lambda item: self._fetch_product_details(item["url"]), items_to_fetch))

            results = []
            for item, (price, currency, in_stock) in zip(items_to_fetch, details):
                results.append(
                    Product(
                        name=item["name"],
                        price=price,
                        currency=currency,
                        url=item["url"],
                        image_url=item["image_url"],
                        store="Ozdisan",
                        in_stock=in_stock,
                    )
                )
            return results

        except Exception as e:
            logger.error("Ozdisan aramasında hata oluştu: %s", e)
            return []
