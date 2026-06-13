import sys
from pathlib import Path

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

from robo_market_search import RobolinkClient

if __name__ == "__main__":
    print("--- Robolink İstemcisi Başlatılıyor ---")

    # 1. Sınıfı instantiate ediyoruz (Başlangıçta otomatik token arayacak)
    client = RobolinkClient()

    print(f"\nKullanılan Aktif Token: {client.client_token}")
    print("-" * 50)

    # 2. Test etmek istediğimiz arama kelimesini tanımlayalım
    search_keyword = "arduino"
    print(f"'{search_keyword}' kelimesi için arama başlatılıyor...\n")

    # 3. Arama fonksiyonunu çağırıp ilk 5 sonucu getirelim
    products = client.search_component(query=search_keyword, limit=5)

    # 4. Sonuçları ekrana düzgün bir şekilde basalım
    if products:
        print(f"Toplam {len(products)} ürün bulundu:\n")
        for index, item in enumerate(products, 1):
            print(f"[{index}] {item.name}")
            print(f"       Cevap: {item}")
            print(f"    💰 Fiyat: {item.price} {item.currency}")
            print(f"    🔗 Link:  {item.url}")
            print("-" * 50)
    else:
        print("❌ Arama sonucunda hiçbir ürün dönmedi veya bir hata oluştu.")
