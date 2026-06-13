from typing import List
from curl_cffi import requests
import re
import json
from robo_market_search.shared.models import Product


class DirencnetClient:
    def __init__(self):
        self.base_url = "https://www.direnc.net/srv/service/product/loader"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "*/*"
        }

    def search_component(self, query: str, limit: int = 0) -> List[Product]:
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
                    clean_json = match.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
                    try:
                        item = json.loads(clean_json)
                        
                        url_path = item.get("url", "")
                        full_url = url_path if url_path.startswith("http") else f"https://www.direnc.net{url_path}"
                        
                        price_str = str(item.get("total_sale_price", "0.0")).replace(",", ".")
                        try:
                            price = float(price_str)
                        except ValueError:
                            price = 0.0
                            
                        image_url = ""
                        if "image" in item:
                            image_url = item["image"]
                            
                        all_products.append(Product(
                            name=item.get("name", "Ürün Adı Yok"),
                            price=price,
                            currency="TL",
                            url=full_url,
                            image_url=image_url,
                            store="Direncnet",
                            in_stock=item.get("stockAmount", 1) > 0 or item.get("stock", 1) > 0
                        ))

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
