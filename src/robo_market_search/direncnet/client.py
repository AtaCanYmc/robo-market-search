import json
import logging
import re
from typing import List, Optional, Set
from urllib.parse import quote

from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.direncnet")


@register_store
class DirencnetClient(BaseStore):
    name: str = "Direncnet"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.base_url = "https://www.direnc.net/arama"
        self.catalog_url = "https://www.direnc.net/index.php?do=catalog/results"
        self.loader_url = "https://www.direnc.net/srv/service/product/loader"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
            "Referer": "https://www.direnc.net/",
        }

    def search(self, query: str, limit: int = 10) -> List[Product]:
        return self.search_component(query=query, limit=limit)

    def search_component(self, query: str, limit: int = 0) -> List[Product]:
        """
        Direnç.net üzerinde arama yapar ve sayfalandırmayı takip ederek ürünleri getirir.
        """
        all_products = []
        page = 1
        session = requests.Session(impersonate="safari15_5")

        def _is_cf_blocked(code: Optional[int], body: str) -> bool:
            if code in (403, 503):
                return True
            return (
                "<title>Just a moment...</title>" in body
                or "Attention Required! | Cloudflare" in body
                or "cf-browser-verification" in body
            )

        while True:
            response_text = None
            last_status = None
            last_reason = None
            last_error = None
            is_cf_challenge = False

            # Primary Strategy: GET search HTML page
            params = {"q": query, "pg": page}
            try:
                response = session.get(self.base_url, params=params, headers=self.headers, timeout=10)
                last_status = response.status_code
                last_reason = response.reason
                if response.status_code == 200 and "PRODUCT_DATA.push" in response.text:
                    response_text = response.text
                elif _is_cf_blocked(response.status_code, response.text):
                    is_cf_challenge = True
            except Exception as e:
                last_error = str(e)
                logger.debug("Direncnet /arama sayfa %d çekilirken hata oluştu: %s", page, e)

            # Secondary Strategy: GET catalog results endpoint
            if not response_text and not is_cf_challenge:
                try:
                    response = session.get(self.catalog_url, params=params, headers=self.headers, timeout=10)
                    last_status = response.status_code
                    last_reason = response.reason
                    if response.status_code == 200 and "PRODUCT_DATA.push" in response.text:
                        response_text = response.text
                    elif _is_cf_blocked(response.status_code, response.text):
                        is_cf_challenge = True
                except Exception as e:
                    last_error = str(e)
                    logger.debug("Direncnet /catalog sayfa %d çekilirken hata oluştu: %s", page, e)

            # Fallback Strategy: GET AJAX loader service endpoint
            if not response_text and not is_cf_challenge:
                loader_params = {"arama": "", "q": query, "link": "arama", "pg": page}
                loader_headers = dict(self.headers)
                loader_headers.update(
                    {
                        "Accept": "*/*",
                        "X-Requested-With": "XMLHttpRequest",
                        "Referer": f"https://www.direnc.net/arama?q={quote(query)}",
                    }
                )
                try:
                    response = session.get(self.loader_url, params=loader_params, headers=loader_headers, timeout=10)
                    last_status = response.status_code
                    last_reason = response.reason
                    if response.status_code == 200 and "PRODUCT_DATA.push" in response.text:
                        response_text = response.text
                    elif _is_cf_blocked(response.status_code, response.text):
                        is_cf_challenge = True
                except Exception as e:
                    last_error = str(e)
                    logger.debug("Direncnet /loader sayfa %d çekilirken hata oluştu: %s", page, e)

            if not response_text:
                if is_cf_challenge:
                    logger.error("Direncnet Cloudflare Bot Koruması: JS Challenge / Doğrulama sayfası döndü.")
                elif last_status == 403:
                    logger.error("Direncnet HTTP 403 Forbidden: Cloudflare WAF veya IP erişim engeli devrede.")
                elif last_status in (429, 503):
                    logger.error("Direncnet HTTP %d: Hız sınırı veya sunucu geçici olarak kullanılamıyor.", last_status)
                elif last_status and last_status != 200:
                    logger.error("Direncnet HTTP %d (%s) döndü.", last_status, last_reason)
                elif last_error:
                    logger.error("Direncnet bağlantı hatası: %s", last_error)
                break

            matches = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", response_text)
            if not matches:
                break

            for match in matches:
                clean_json = match.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
                try:
                    try:
                        item = json.loads(clean_json, strict=False)
                    except json.JSONDecodeError:
                        item = json.loads(match, strict=False)

                    url_path = item.get("url", "")
                    full_url = url_path if url_path.startswith("http") else f"https://www.direnc.net/{url_path}"

                    price_str = str(item.get("total_sale_price", "0.0")).replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0

                    image_url = ""
                    if "image" in item:
                        image_url = item["image"]

                    stock_val = item.get("quantity")
                    if stock_val is None:
                        stock_val = item.get("stockAmount")
                    if stock_val is None:
                        stock_val = item.get("stock")

                    try:
                        in_stock = float(stock_val) > 0 if stock_val is not None else True
                    except (ValueError, TypeError):
                        in_stock = True

                    all_products.append(
                        Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=image_url,
                            store="Direncnet",
                            in_stock=in_stock,
                        )
                    )

                    if 0 < limit <= len(all_products):
                        return all_products
                except Exception as err:
                    logger.debug("Direncnet item parsing error: %s", err)
                    continue

            page += 1

        return all_products
