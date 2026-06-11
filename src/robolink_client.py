import json
import re
import os
from curl_cffi import requests
from dotenv import load_dotenv

load_dotenv()


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
        Cloudflare'i taklit ederek sitenin kaynak kodundan güncel tokenı çeker.
        """
        try:
            # impersonate parametresi Cloudflare korumasını açar
            response = requests.get(
                self.base_site_url + "?search_provider=aisearch&query=test",
                headers=self.headers,
                impersonate="safari15_5"
            )

            js_files = re.findall(r'src="([^"]+\.js)"', response.text)
            print(js_files)

            for js_url in js_files:
                if not js_url.startswith("http"):
                    js_url = self.base_site_url + js_url

                js_response = requests.get(js_url, headers=self.headers, impersonate="safari15_5")
                js_content = js_response.text

                token_match = re.search(r'client-token["\']?\s*:\s*["\']([^"\']+)["\']', js_content)
                if not token_match:
                    token_match = re.search(r'client-token=([^&"\']+)', js_content)

                if token_match:
                    actual_token = token_match.group(1)
                    print(f"[Sistem] Cloudflare Atlatıldı! Güncel Token: {actual_token}")
                    return actual_token

        except Exception as e:
            print(f"Token aranırken hata oluştu: {e}")

        print("[Sistem] Dinamik token bulunamadı, fallback token kullanılıyor.")
        return os.environ.get("FALLBACK_TOKEN", "8slGSE3mxcMPePm2f5U5E-sWahphkQdA")

    def search_component(self, query: str, limit: int = 5):
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
            return items
        except Exception as e:
            print(f"Arama yapılırken hata oluştu: {e}")
            return []


# --- Test Main ---
if __name__ == "__main__":
    client = RobolinkClient()
    results = client.search_component("esp32", limit=3)

    for idx, item in enumerate(results, 1):
        print(f"{idx}. {item.get('name')} - Fiyat: {item.get('price')} TL")
