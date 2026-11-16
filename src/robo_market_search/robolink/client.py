import json
import logging
import re
from typing import List, Set

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.constants import ROBOLINK_FALLBACK_TOKEN
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.robolink")


@register_store
class RobolinkClient(BaseStore):
    name: str = "Robolink"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.base_site_url = "https://www.robolinkmarket.com"
        self.api_url = "https://api.aisearch.app/sites/2924/v1/search/query"

        self.headers = {"Accept": "*/*", "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8", "Referer": self.base_site_url}
        self.client_token = self._find_current_token()

    def _find_current_token(self) -> str:
        """
        Sitenin kaynak kodundan aisearch JS dosyasını bulur ve token'ı doğrudan içinden çıkarır.
        """
        try:
            response = requests.get(
                self.base_site_url + "?search_provider=aisearch", headers=self.headers, impersonate="safari15_5"
            )

            js_url_match = re.search(r'src=["\'](https://cdn\.aisearch\.app/[^"\']+\.js)["\']', response.text)

            if js_url_match:
                js_url = js_url_match.group(1)

                js_response = requests.get(js_url, headers=self.headers, impersonate="safari15_5")
                js_content = js_response.text

                token_match = re.search(r'\("2924"\s*,\s*"([^"]+)"', js_content)
                if token_match:
                    actual_token = token_match.group(1)
                    logger.debug("Robolink JS içinden güncel token bulundu: %s", actual_token)
                    return actual_token
                else:
                    logger.debug("Robolink aisearch JS dosyası bulundu ancak token ayıklanamadı.")
            else:
                logger.debug("Robolink aisearch JS URL'si sayfa kaynağında bulunamadı.")

        except Exception as e:
            logger.warning("Robolink token aranırken hata oluştu: %s", e)

        logger.debug("Robolink dinamik token bulunamadı, fallback token kullanılıyor.")
        return ROBOLINK_FALLBACK_TOKEN

    def search(self, query: str, limit: int = 10) -> List[Product]:
        return self.search_component(query=query, limit=limit)

    def search_component(self, query: str, limit: int = 5) -> List[Product]:
        """
        Dinamik token ile API üzerinden arama yapar.
        """
        params = {
            "query": query,
            "expand": "product,filter,popularCategories,recommendation",
            "limit": limit,
            "page": 1,
            "client-token": self.client_token,
            "lang": "tr",
            "d": "www.robolinkmarket.com",
        }

        try:
            response = requests.get(self.api_url, headers=self.headers, params=params, impersonate="safari15_5")
            response.raise_for_status()
            text = response.text
            data = json.loads(text)

            items = data.get("products", [])

            parsed_products = []
            for itm in items:
                url_path = itm.get("url", "")
                full_url = url_path if url_path.startswith("http") else f"{self.base_site_url}/{url_path}"

                image_url = ""
                images = itm.get("images", [])
                if images:
                    image_url = images[0]

                raw_name = itm.get("name", "Ürün Adı Yok")
                clean_name = raw_name.split("||")[0].strip() if raw_name else "Ürün Adı Yok"

                parsed_products.append(
                    Product(
                        name=clean_name,
                        price=float(itm.get("price", 0.0)),
                        currency=itm.get("currency", "TL"),
                        url=full_url,
                        image_url=image_url,
                        store="Robolink",
                        in_stock=itm.get("inStock", True),
                    )
                )
            return parsed_products
        except Exception as e:
            logger.error("Robolink aramasında hata oluştu: %s", e)
            return []
