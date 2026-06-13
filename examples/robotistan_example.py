import sys
from pathlib import Path

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

from robo_market_search import RobotistanClient

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
            print(f"[{index}] {item.name}")
            print(f"       Cevap: {item}")
            print(f"    💰 Fiyat: {item.price} {item.currency}")
            print(f"    🔗 Link: {item.url}")
            print("-" * 50)
    else:
        print("❌ Robotistan aramasında ürün dönmedi.")
