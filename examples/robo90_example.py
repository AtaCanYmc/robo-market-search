import sys
from pathlib import Path
from robo90_search import Robo90Client

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

if __name__ == "__main__":
    print("--- Robo90 İstemcisi Başlatılıyor ---")
    robo90_client = Robo90Client()

    search_keyword = "test"
    print(f"'{search_keyword}' kelimesi için arama başlatılıyor...\n")

    robo90_products = robo90_client.search_component(query=search_keyword, page=2)

    if robo90_products:
        print(f"Toplam {len(robo90_products)} ürün bulundu (Robo90):\n")
        for index, item in enumerate(robo90_products, 1):
            name = item.get("name", "Ürün Adı Yok")
            price = item.get("total_sale_price", "Fiyat Yok")
            print(f"[{index}] {name}")
            print(f"    💰 Fiyat: {price} TL")
            print("-" * 50)
    else:
        print("❌ Robo90 aramasında ürün dönmedi.")
