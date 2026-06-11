import json
import os
import re
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
                    print(f"[Sistem] JS içinden güncel token bulundu: {actual_token}")
                    return actual_token
                else:
                    print("[Sistem] aisearch JS dosyası bulundu ancak token ayıklanamadı.")
            else:
                print("[Sistem] aisearch JS URL'si sayfa kaynağında bulunamadı.")
                
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
