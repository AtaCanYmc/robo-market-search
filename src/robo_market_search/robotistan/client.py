import logging
import re
from typing import List, Optional, Set
import uuid

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.constants import ROBOTISTAN_FALLBACK_TOKEN
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.robotistan")


@register_store
class RobotistanClient(BaseStore):
    name: str = "Robotistan"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self, fallback_token: Optional[str] = None) -> None:
        if fallback_token is None:
            fallback_token = ROBOTISTAN_FALLBACK_TOKEN

        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            "Origin": "https://www.robotistan.com",
            "Referer": "https://www.robotistan.com/",
        }

        self.session_id = str(uuid.uuid4())
        self.user_id = str(uuid.uuid4())
        self.client_token = self._find_current_token(fallback_token)

    def _find_current_token(self, fallback_token: str) -> str:
        """
        Ana sayfaya gidip Segmentify için gereken güncel apiKey değerini dinamik olarak çeker.
        """
        try:
            response = requests.get("https://www.robotistan.com/", headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()

            match = re.search(r"'apikey'\s*:\s*'([^']+)'", response.text)
            if match:
                token = match.group(1)
                logger.debug("Robotistan güncel token bulundu: %s", token)
                return token

            match = re.search(r"cdn\.segmentify\.com/([^/]+)/segmentify\.js", response.text)
            if match:
                token = match.group(1)
                logger.debug("Robotistan güncel token bulundu (cdn linkinden): %s", token)
                return token

        except Exception as e:
            logger.warning("Robotistan token aranırken hata oluştu: %s", e)

        logger.debug("Robotistan dinamik token bulunamadı, fallback token kullanılıyor.")
        return fallback_token

    def search(self, query: str, limit: int = 10) -> List[Product]:
        return self.search_component(query=query, limit=limit, page=1)

    def search_component(self, query: str, limit: int = 200, page: int = 1) -> List[Product]:
        """
        Robotistan üzerinde Segmentify altyapısı kullanılarak arama yapar.
        """
        api_url = f"https://per2.segmentify.com/add/events/v1.json?apiKey={self.client_token}"

        payload = [
            {
                "name": "SEARCH",
                "userId": self.user_id,
                "sessionId": self.session_id,
                "device": "PC",
                "pageUrl": f"https://www.robotistan.com/searchandising?q={query}&page={page}&trigger=keyword",
                "referrer": "https://www.robotistan.com/",
                "browser": "Chrome",
                "os": "macOS",
                "osversion": "10.15.7",
                "userAgent": self.headers["User-Agent"],
                "lang": "TR",
                "currency": "TRY",
                "query": query,
                "type": "faceted",
                "ordering": {"page": page, "sort": "BEST_MATCH"},
                "filters": [],
                "count": limit,
            }
        ]

        try:
            response = requests.post(api_url, json=payload, headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()

            data = response.json()

            if "search" in data and len(data["search"]) > 0 and len(data["search"][0]) > 0:
                raw_products = data["search"][0][0].get("products", [])
                parsed_products = []
                for item in raw_products:
                    url_path = item.get("url", "")
                    full_url = (
                        url_path
                        if url_path.startswith("http")
                        else f"https:{url_path}"
                        if url_path.startswith("//")
                        else f"https://www.robotistan.com{url_path}"
                    )

                    price_str = str(item.get("price", "0.0")).replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0

                    parsed_products.append(
                        Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=item.get("image", ""),
                            store="Robotistan",
                            in_stock=item.get("inStock", True),
                        )
                    )
                return parsed_products[:limit]
            else:
                return []

        except Exception as e:
            logger.error("Robotistan aramasında hata oluştu: %s", e)
            return []
