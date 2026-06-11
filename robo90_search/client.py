from curl_cffi import requests
import re
import json
import urllib.parse


class Robo90Client:
    def __init__(self):
        self.base_url = "https://www.robo90.com/arama"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }

    def search_component(self, query: str, page: int = 1, stock: int = 1):
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
                stoktaki_urunler.append(json.loads(clean_p))

            return stoktaki_urunler

        except Exception as e:
            print(f"[Robo90Client] Arama yapılırken hata oluştu: {e}")
            return []
