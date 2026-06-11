from curl_cffi import requests
import re
import json


class DirencnetClient:
    def __init__(self):
        self.base_url = "https://www.direnc.net/srv/service/product/loader"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "*/*"
        }

    def search_component(self, query: str, limit: int = 0):
        """
        Direnç.net üzerinde arama yapar ve sayfalandırmayı takip ederek 
        stoktaki tüm ürünleri getirir.
        Eğer limit belirtilirse (limit > 0), limit sayısına ulaşıldığında durur.
        """
        all_products = []
        page = 1

        while True:
            params = {
                "arama": "",
                "q": query,
                "stock": "1",
                "link": "arama",
                "pg": page
            }

            try:
                # curl_cffi impersonate kullanarak engelleri aşıyoruz
                response = requests.get(self.base_url, params=params, headers=self.headers, impersonate="safari15_5")
                response.raise_for_status()

                # Eğer gelen içerik boşsa veya ürün script'i barındırmıyorsa döngüden çık
                if not response.text or "PRODUCT_DATA.push" not in response.text:
                    break

                # Gelen HTML içindeki saf JSON ürün datalarını regex ile ayıkla
                matches = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", response.text)

                # Eğer bu sayfadan hiç ürün ayıklanamadıysa dur
                if not matches:
                    break

                for match in matches:
                    clean_json = match.replace("\\'", "'").replace('\\"', '"')
                    try:
                        product_data = json.loads(clean_json)
                        all_products.append(product_data)

                        # Limit kontrolü
                        if limit > 0 and len(all_products) >= limit:
                            return all_products
                    except Exception:
                        continue

                page += 1

            except Exception as e:
                print(f"[DirencnetClient] Sayfa {page} çekilirken hata oluştu: {e}")
                break

        return all_products
