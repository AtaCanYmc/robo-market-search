import json
import logging
import re
from typing import List, Set
import urllib.parse

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.motorobit")


@register_store
class MotorobitClient(BaseStore):
    name: str = "Motorobit"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.base_url = "https://www.motorobit.com/arama"
        self.headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

    def search(self, query: str, limit: int = 10) -> List[Product]:
        results = self.search_component(query=query, page=1)
        return results[:limit]

    def search_component(self, query: str, page: int = 1) -> List[Product]:
        """
        Motorobit üzerinde arama yapar ve ürünleri döndürür.
        """
        encoded_query = urllib.parse.quote(query)
        target_url = f"{self.base_url}?q={encoded_query}&pg={page}"

        try:
            response = requests.get(target_url, headers=self.headers, impersonate="safari15_5", timeout=10)
            response.raise_for_status()

            raw_products = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", response.text)

            products = []
            for p in raw_products:
                clean_p = p.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
                try:
                    item = json.loads(clean_p)
                    url_path = item.get("url", "")
                    full_url = url_path if url_path.startswith("http") else f"https://www.motorobit.com{url_path}"

                    price_val = item.get("total_sale_price") or item.get("price") or 0.0
                    try:
                        price = float(str(price_val).replace(",", "."))
                    except (ValueError, TypeError):
                        price = 0.0

                    image_url = item.get("image", "")

                    available = item.get("available", False)
                    qty = item.get("quantity", 0)
                    try:
                        is_in_stock = bool(available) and int(qty) > 0
                    except (ValueError, TypeError):
                        is_in_stock = bool(available)

                    products.append(
                        Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=image_url,
                            store="Motorobit",
                            in_stock=is_in_stock,
                        )
                    )
                except json.JSONDecodeError:
                    continue

            return products
        except Exception as e:
            logger.error("Motorobit aramasında hata oluştu: %s", e)
            return []
