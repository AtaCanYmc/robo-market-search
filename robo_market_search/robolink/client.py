import json
import re
from typing import List
from curl_cffi import requests

from robo_market_search.shared.constants import ROBOLINK_FALLBACK_TOKEN
from robo_market_search.shared.models import Product


class RobolinkClient:
    def __init__(self):
        self.base_site_url = "https://www.robolinkmarket.com"
        self.api_url = "https://api.aisearch.app/sites/2924/v1/search/query"

        # Gerçek tarayıcı başlıkları
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
            "Referer": self.base_site_url
        }
        self.client_token = self._find_current_token()

    def _find_current_token(self):
        """
        Sitenin kaynak kodundan aisearch JS dosyasını bulur ve token'ı doğrudan içinden çıkarır.
        Bu yöntem Playwright (tarayıcı) kullanmadan çok daha hızlı ve garantili çalışır.
        """
        try:
            # 1. Ana sayfadan aisearch.app JS dosyasının URL'sini bul
            response = requests.get(
                self.base_site_url + "?search_provider=aisearch",
                headers=self.headers,
                impersonate="safari15_5"
            )

            js_url_match = re.search(r'src=["\'](https://cdn\.aisearch\.app/[^"\']+\.js)["\']', response.text)

            if js_url_match:
                js_url = js_url_match.group(1)

                # 2. JS dosyasını indir
                js_response = requests.get(js_url, headers=self.headers, impersonate="safari15_5")
                js_content = js_response.text

                # 3. 2924 (Robolink site id) ile eşleşen token'ı bul: V2.init("2924", "TOKEN", ...)
                token_match = re.search(r'\("2924"\s*,\s*"([^"]+)"', js_content)
                if token_match:
                    actual_token = token_match.group(1)
                    print(f"[RobolinkClient] JS içinden güncel token bulundu: {actual_token}")
                    return actual_token
                else:
                    print("[RobolinkClient] aisearch JS dosyası bulundu ancak token ayıklanamadı.")
            else:
                print("[RobolinkClient] aisearch JS URL'si sayfa kaynağında bulunamadı.")

        except Exception as e:
            print(f"[RobolinkClient] Token aranırken hata oluştu: {e}")

        print("[RobolinkClient] Dinamik token bulunamadı, fallback token kullanılıyor.")
        return ROBOLINK_FALLBACK_TOKEN

    def search_component(self, query: str, limit: int = 5) -> List[Product]:
        """
        Dinamik token ile API üzerinden arama yapar.
        """
        # URL'de %2C encode hatasını önlemek için dict formatında temiz parametreler
        params = {
            "query": query,
            "expand": "product,filter,popularCategories,recommendation",
            "limit": limit,
            "page": 1,
            "client-token": self.client_token,
            "lang": "tr",
            "d": "www.robolinkmarket.com"
        }

        try:
            # API isteğinde de taklit (impersonate) kullanıyoruz
            response = requests.get(
                self.api_url,
                headers=self.headers,
                params=params,
                impersonate="safari15_5"
            )
            response.raise_for_status()
            text = response.text
            data = json.loads(text)

            items = data.get("products", [])

            parsed_products = []
            for itm in items:
                url_path = itm.get("url", "")
                full_url = url_path if url_path.startswith("http") else f"{self.base_site_url}{url_path}"

                # Image URL parsing
                image_url = ""
                images = itm.get("images", [])
                if images:
                    image_url = images[0]

                parsed_products.append(Product(
                    name=itm.get("name", "Ürün Adı Yok"),
                    price=float(itm.get("price", 0.0)),
                    currency=itm.get("currency", "TL"),
                    url=full_url,
                    image_url=image_url,
                    store="Robolink",
                    in_stock=itm.get("inStock", True)
                ))
            return parsed_products
        except Exception as e:
            print(f"[RobolinkClient] Arama yapılırken hata oluştu: {e}")
            return []
