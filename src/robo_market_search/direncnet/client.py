import json
import logging
import re
from typing import List, Optional, Set
from urllib.parse import quote

from bs4 import BeautifulSoup
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
        self.base_search_url = "https://www.direnc.net/arama"
        self.json_search_url = "https://www.direnc.net/srv/service/product/search-json"
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.direnc.net/",
        }
        self.json_headers = {
            **self.headers,
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest",
        }

    def search(self, query: str, limit: int = 10) -> List[Product]:
        return self.search_component(query=query, limit=limit)

    def _normalize_url(self, raw_url: str) -> str:
        if not raw_url:
            return ""
        if raw_url.startswith("http"):
            return raw_url
        clean_path = raw_url.lstrip("/")
        return f"https://www.direnc.net/{clean_path}"

    def _parse_turkish_price(self, price_str: str) -> float:
        """Parse price string like '1.842,59' or '272,21' into float 1842.59."""
        try:
            cleaned = str(price_str).strip().replace("TL", "").replace("₺", "").strip()
            # If formatted like 1.842,59: remove thousands dots, replace comma with dot
            if "," in cleaned:
                cleaned = cleaned.replace(".", "").replace(",", ".")
            return float(cleaned)
        except (ValueError, TypeError):
            return 0.0

    def _search_via_json_api(self, query: str, limit: int) -> List[Product]:
        """
        Primary strategy: High-speed native JSON search endpoint.
        Returns parsed products directly in JSON format in ~150ms.
        """
        fetch_limit = min(max(limit, 10), 25)
        encoded_q = quote(query.strip())
        url = f"{self.json_search_url}/{encoded_q}?language=tr&limit={fetch_limit}"

        try:
            resp = requests.post(
                url,
                headers=self.json_headers,
                impersonate="chrome120",
                timeout=6,
            )
            if resp.status_code != 200:
                logger.debug("Direncnet search-json returned status %d", resp.status_code)
                return []

            data = resp.json().get("data", [])
            products: List[Product] = []

            for item in data:
                title = item.get("title") or item.get("name") or "Ürün Adı Yok"
                raw_price = item.get("price_sell_with_vat") or item.get("total_sale_price") or item.get("price_sell")
                price = self._parse_turkish_price(str(raw_price or "0.0"))

                raw_url = item.get("url", "")
                full_url = self._normalize_url(raw_url)
                image_url = item.get("image", "")

                stock_val = item.get("stock")
                if stock_val is None:
                    stock_val = item.get("quantity")
                try:
                    in_stock = float(stock_val) > 0 if stock_val is not None else True
                except (ValueError, TypeError):
                    in_stock = True

                products.append(
                    Product(
                        name=title,
                        price=price,
                        currency="TL",
                        url=full_url,
                        image_url=image_url,
                        store="Direncnet",
                        in_stock=in_stock,
                    )
                )

                if 0 < limit <= len(products):
                    break

            return products
        except Exception as e:
            logger.debug("Direncnet search-json exception: %s", e)
            return []

    def search_component(self, query: str, limit: int = 0) -> List[Product]:
        """
        Direnç.net üzerinde arama yapar.
        Öncelikle yüksek hızlı JSON servisini kullanır, gerekirse HTML arama sayfasına yedeklenir.
        """
        target_limit = limit if limit > 0 else 10

        # 1. Primary Strategy: Fast JSON API (covers up to 25 products)
        json_results = self._search_via_json_api(query=query, limit=target_limit)
        if json_results and (len(json_results) >= target_limit or target_limit <= 25):
            return json_results[:target_limit]

        all_products: List[Product] = list(json_results)
        seen_urls: Set[str] = {p.url for p in all_products}

        # 2. Secondary Strategy: Full HTML search page with pagination ('ps' parameter)
        page = 1
        session = requests.Session(impersonate="chrome120")

        def _is_cf_blocked(code: Optional[int], body: str) -> bool:
            if code in (403, 503):
                return True
            return (
                "<title>Just a moment...</title>" in body
                or "Attention Required! | Cloudflare" in body
                or "cf-browser-verification" in body
            )

        while len(all_products) < target_limit:
            response_text = None
            params = {"q": query, "ps": page}

            try:
                response = session.get(self.base_search_url, params=params, headers=self.headers, timeout=8)
                if response.status_code == 200:
                    response_text = response.text
                elif _is_cf_blocked(response.status_code, response.text):
                    logger.warning("Direncnet Cloudflare WAF / JS Challenge algılandı.")
                    break
            except Exception as e:
                logger.debug("Direncnet /arama sayfa %d çekilirken hata: %s", page, e)
                break

            if not response_text:
                break

            page_found = 0

            # 2a. Extract via embedded PRODUCT_DATA script
            matches = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", response_text)
            if matches:
                for match in matches:
                    clean_json = match.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
                    try:
                        try:
                            item = json.loads(clean_json, strict=False)
                        except json.JSONDecodeError:
                            item = json.loads(match, strict=False)

                        full_url = self._normalize_url(item.get("url", ""))
                        if full_url in seen_urls:
                            continue

                        price_str = str(item.get("total_sale_price", "0.0")).replace(",", ".")
                        try:
                            price = float(price_str)
                        except ValueError:
                            price = 0.0

                        image_url = item.get("image", "")

                        stock_val = item.get("quantity") or item.get("stockAmount") or item.get("stock")
                        try:
                            in_stock = float(stock_val) > 0 if stock_val is not None else True
                        except (ValueError, TypeError):
                            in_stock = True

                        prod = Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=image_url,
                            store="Direncnet",
                            in_stock=in_stock,
                        )
                        all_products.append(prod)
                        seen_urls.add(full_url)
                        page_found += 1

                        if 0 < target_limit <= len(all_products):
                            return all_products[:target_limit]
                    except Exception as err:
                        logger.debug("Direncnet PRODUCT_DATA parsing error: %s", err)
                        continue

            # 2b. DOM Parsing Fallback if PRODUCT_DATA was absent or yielded 0
            if page_found == 0:
                soup = BeautifulSoup(response_text, "html.parser")
                cards = soup.select('div[data-toggle="product"]')
                if not cards:
                    cards = soup.select('div[class*="group"][class*="relative"]')

                for card in cards:
                    link_el = card.select_one('a[data-toggle="product-url"]')
                    if not link_el:
                        continue

                    raw_href = link_el.get("href")
                    href_str = str(raw_href) if raw_href and not isinstance(raw_href, list) else ""
                    full_url = self._normalize_url(href_str)
                    if not full_url or full_url in seen_urls:
                        continue

                    title_span = link_el.select_one('span[data-toggle="product-title"]')
                    raw_title = link_el.get("title")
                    title_attr = str(raw_title) if raw_title and not isinstance(raw_title, list) else ""
                    title = title_span.text.strip() if title_span else title_attr.strip()
                    if not title:
                        continue

                    img_el = card.select_one('img[data-toggle="product-image"]')
                    image_url = ""
                    if img_el:
                        raw_src = img_el.get("data-src") or img_el.get("src")
                        if raw_src and not isinstance(raw_src, list):
                            image_url = str(raw_src)

                    price_span = card.select_one('span[data-toggle="price-sell-vat"]') or card.select_one(
                        '[data-toggle*="price"]'
                    )
                    price = self._parse_turkish_price(price_span.text if price_span else "0.0")

                    out_of_stock = card.select_one('[data-qa="product-out-of-stock"]') is not None

                    prod = Product(
                        name=title,
                        price=price,
                        currency="TL",
                        url=full_url,
                        image_url=image_url,
                        store="Direncnet",
                        in_stock=not out_of_stock,
                    )
                    all_products.append(prod)
                    seen_urls.add(full_url)
                    page_found += 1

                    if 0 < target_limit <= len(all_products):
                        return all_products[:target_limit]

            # If no items were extracted on this page, stop paginating
            if page_found == 0:
                break

            page += 1

        return all_products[:target_limit] if target_limit > 0 else all_products
