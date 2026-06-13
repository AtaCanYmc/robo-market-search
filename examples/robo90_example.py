import sys
from pathlib import Path

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

from robo_market_search import Robo90Client

if __name__ == "__main__":
    print("--- Robo90 İstemcisi Başlatılıyor ---")
    robo90_client = Robo90Client()

    search_keyword = "test"
    print(f"'{search_keyword}' kelimesi için arama başlatılıyor...\n")

    robo90_products = robo90_client.search_component(query=search_keyword, page=2)

    if robo90_products:
        print(f"Toplam {len(robo90_products)} ürün bulundu (Robo90):\n")
        for index, item in enumerate(robo90_products, 1):
            print(f"[{index}] {item.name}")
            print(f"       Cevap: {item}")
            print(f"    💰 Fiyat: {item.price} {item.currency}")
            print(f"    🔗 Link: {item.url}")
            print("-" * 50)
    else:
        print("❌ Robo90 aramasında ürün dönmedi.")
