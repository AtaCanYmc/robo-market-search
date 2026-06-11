import sys
from pathlib import Path
from direncnet_search import DirencnetClient

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

if __name__ == "__main__":
    print("--- Direncnet İstemcisi Başlatılıyor ---")

    direncnet_client = DirencnetClient()

    search_keyword = "arduino"
    print(f"'{search_keyword}' kelimesi için arama başlatılıyor...\n")

    # limit=5 ile ilk 5 ürünü çekelim, aksi halde stoktaki yüzlerce ürünü çeker
    products = direncnet_client.search_component(query=search_keyword, limit=999)

    if products:
        print(f"Toplam {len(products)} ürün bulundu (Direncnet):\n")

        for index, item in enumerate(products, 1):
            name = item.get("name", "Ürün Adı Yok")
            price = item.get("total_sale_price", "Fiyat Yok")
            print(f"[{index}] {name}")
            print(f"    💰 Fiyat: {price} TL")
            print("-" * 50)
    else:
        print("❌ Direncnet aramasında ürün dönmedi.")
