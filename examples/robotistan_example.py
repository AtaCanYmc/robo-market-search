import sys
from pathlib import Path
from robotistan_search import RobotistanClient

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

if __name__ == "__main__":
    print("--- Robotistan İstemcisi Başlatılıyor ---")

    robotistan_client = RobotistanClient()

    search_keyword = "test"
    print(f"'{search_keyword}' kelimesi için arama başlatılıyor...\n")

    products = robotistan_client.search_component(query=search_keyword)

    if products:
        print(f"Toplam {len(products)} ürün bulundu (Robotistan):\n")
        # limit değişkeni segmentify API'sine gidiyor ama ilk 5 tanesini de biz kesip yazdırabiliriz.
        for index, item in enumerate(products, 1):
            name = item.get("name", "Ürün Adı Yok")
            price = item.get("price", "Fiyat Yok")
            url = item.get("url", "")

            # Linkin başında 'http' yoksa tamamla (genelde '//' ile başlıyor veya '/...' ile)
            if url.startswith("//"):
                full_url = "https:" + url
            elif url.startswith("/"):
                full_url = "https://www.robotistan.com" + url
            else:
                full_url = url

            print(f"[{index}] {name}")
            print(f"    💰 Fiyat: {price} TL")
            print(f"    🔗 Link: {full_url}")
            print("-" * 50)
    else:
        print("❌ Robotistan aramasında ürün dönmedi.")
