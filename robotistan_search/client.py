from curl_cffi import requests
import uuid
import re
import os
from typing import List
from dotenv import load_dotenv
from robo_shared.models import Product

load_dotenv()


class RobotistanClient:
    def __init__(self, fallback_token: str = None):
        if fallback_token is None:
            fallback_token = os.getenv("ROBOTISTAN_FALLBACK_TOKEN", "e9c72484-3c49-4e2d-bfef-4d7ce838d87b")
            
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            "Origin": "https://www.robotistan.com",
            "Referer": "https://www.robotistan.com/"
        }

        # Segmentify için her başlatmada benzersiz bir session/user id üretmek engelleri aşmak için faydalıdır.
        self.session_id = str(uuid.uuid4())
        self.user_id = str(uuid.uuid4())

        # Dinamik token bulma
        self.client_token = self._find_current_token(fallback_token)

    def _find_current_token(self, fallback_token: str) -> str:
        """
        Ana sayfaya gidip Segmentify için gereken güncel apiKey değerini dinamik olarak çeker.
        Bulamazsa fallback_token kullanır.
        """
        try:
            response = requests.get("https://www.robotistan.com/", headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()

            # HTML içerisinde 'apikey': '...' arıyoruz
            match = re.search(r"'apikey'\s*:\s*'([^']+)'", response.text)
            if match:
                token = match.group(1)
                print(f"[Sistem] Robotistan için güncel token bulundu: {token}")
                return token

            # Bulunamazsa cdn linki içerisindeki url path'inden deneyelim
            match = re.search(r"cdn\.segmentify\.com/([^/]+)/segmentify\.js", response.text)
            if match:
                token = match.group(1)
                print(f"[Sistem] Robotistan için güncel token bulundu (cdn linkinden): {token}")
                return token

        except Exception as e:
            print(f"[Hata] Token aranırken hata oluştu: {e}")

        print("[Sistem] Dinamik token bulunamadı, fallback token kullanılıyor.")
        return fallback_token

    def search_component(self, query: str, limit: int = 200, page: int = 1) -> List[Product]:
        """
        Robotistan üzerinde Segmentify altyapısı kullanılarak arama yapar.

        :arg query: Arama kelimesi
        :arg limit: Kaç ürün döneceği (Segmentify API'sine gönderilir, ancak gerçek dönen ürün sayısı farklı olabilir)
        :arg page: Hangi sayfanın döneceği (Segmentify API'sine gönderilir, ancak gerçek dönen ürünler farklı olabilir)
        """
        api_url = f"https://per2.segmentify.com/add/events/v1.json?apiKey={self.client_token}"
        
        # Segmentify v1 yapısı genellikle bir array kabul eder.
        # İletilen örnek payload'a uygun olarak güncellenmiştir.
        payload = [{
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
            "ordering": {
                "page": page,
                "sort": "BEST_MATCH"
            },
            "filters": [],
            "count": limit  # Eklenebilir, limit belirlemek için faydalıdır
        }]

        try:
            response = requests.post(api_url, json=payload, headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()

            data = response.json()

            if "search" in data and len(data["search"]) > 0 and len(data["search"][0]) > 0:
                raw_products = data["search"][0][0].get("products", [])
                parsed_products = []
                for item in raw_products:
                    url_path = item.get("url", "")
                    full_url = url_path if url_path.startswith("http") else f"https:{url_path}" if url_path.startswith("//") else f"https://www.robotistan.com{url_path}"
                    
                    price_str = str(item.get("price", "0.0")).replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0
                        
                    parsed_products.append(Product(
                        name=item.get("name", "Ürün Adı Yok"),
                        price=price,
                        currency="TL",
                        url=full_url,
                        image_url=item.get("image", ""),
                        store="Robotistan",
                        in_stock=item.get("inStock", True)
                    ))
                return parsed_products
            else:
                return []

        except Exception as e:
            print(f"[RobotistanClient] Arama yapılırken hata oluştu: {e}")
            return []
