import json
import logging
import re
from typing import List, Set
import urllib.parse

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.robo90")


@register_store
class Robo90Client(BaseStore):
    name: str = "Robo90"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.base_url = "https://www.robo90.com/arama"
        self.headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

    def search(self, query: str, limit: int = 10) -> List[Product]:
        results = self.search_component(query=query, page=1, stock=1)
        return results[:limit]

    def search_component(self, query: str, page: int = 1, stock: int = 1) -> List[Product]:
        """
        Robo90 üzerinde arama yapar ve ürünleri döndürür.
        """
        encoded_query = urllib.parse.quote(query)
        target_url = f"{self.base_url}?q={encoded_query}&stock={stock}&pg={page}"

        try:
            response = requests.get(target_url, headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()
            html_content = response.text

            raw_products = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", html_content)

            stoktaki_urunler = []
            for p in raw_products:
                clean_p = p.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
                try:
                    item = json.loads(clean_p)

                    url_path = item.get("url", "")
                    full_url = url_path if url_path.startswith("http") else f"https://www.robo90.com/{url_path}"

                    price_str = str(item.get("total_sale_price", "0.0")).replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0

                    image_url = ""
                    if "image" in item:
                        image_url = item["image"]

                    stoktaki_urunler.append(
                        Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=image_url,
                            store="Robo90",
                            in_stock=stock == 1 or item.get("stockAmount", 1) > 0,
                        )
                    )
                except json.JSONDecodeError:
                    continue

            return stoktaki_urunler

        except Exception as e:
            logger.error("Robo90 aramasında hata oluştu: %s", e)
            return []
