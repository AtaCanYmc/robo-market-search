from typing import List
from curl_cffi import requests
import re
import json
import urllib.parse
from robo_market_search.shared.models import Product


class Robo90Client:
    def __init__(self):
        self.base_url = "https://www.robo90.com/arama"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }

    def search_component(self, query: str, page: int = 1, stock: int = 1) -> List[Product]:
        """
        Robo90 üzerinde arama yapar ve sadece stokta olan ürünleri döndürür.

        :arg query: Arama kelimesi
        :arg page: Sayfa numarası (1'den başlayarak)
        :arg stock: 1 ise sadece stokta olan ürünler, 0 ise tüm ürünler (stokta olmayanlar dahil) döner.
        """
        # URL'yi oluştur: stokta olanlar (stock=1) ve limit
        encoded_query = urllib.parse.quote(query)
        target_url = f"{self.base_url}?q={encoded_query}&stock={stock}&pg={page}"

        try:
            # curl_cffi requests kullanarak engellemeleri aşmak için impersonate kullanılabilir
            # Şimdilik standart headers iş görüyor ancak impersonate de eklenebilir.
            response = requests.get(target_url, headers=self.headers, impersonate="safari15_5")
            response.raise_for_status()
            html_content = response.text

            # T-Soft'un her ürün için sayfaya bastığı PRODUCT_DATA script bloklarını Regex ile yakalıyoruz
            raw_products = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.*?)'\)\);", html_content)

            stoktaki_urunler = []
            for p in raw_products:
                # JSON karakter kaçışlarını (escape) temizle ve objeye dönüştür
                clean_p = p.replace("\\'", "'").replace('\\"', '"')
                try:
                    item = json.loads(clean_p)
                    
                    # URL ve Price parsing
                    url_path = item.get("url", "")
                    full_url = url_path if url_path.startswith("http") else f"https://www.robo90.com{url_path}"
                    
                    price_str = str(item.get("total_sale_price", "0.0")).replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0
                        
                    image_url = ""
                    if "image" in item:
                        image_url = item["image"]
                        
                    stoktaki_urunler.append(Product(
                        name=item.get("name", "Ürün Adı Yok"),
                        price=price,
                        currency="TL",
                        url=full_url,
                        image_url=image_url,
                        store="Robo90",
                        in_stock=stock == 1 or item.get("stockAmount", 1) > 0
                    ))
                except json.JSONDecodeError:
                    continue

            return stoktaki_urunler

        except Exception as e:
            print(f"[Robo90Client] Arama yapılırken hata oluştu: {e}")
            return []
