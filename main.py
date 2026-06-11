from src.robolink_client import RobolinkClient

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
            name = item.get("name", "Ürün Adı Yok")
            price = item.get("price", "Fiyat Yok")
            currency = item.get("currency", "TL")
            url_path = item.get("url", "")

            # Tam URL oluşturma
            full_url = url_path if url_path.startswith("http") else f"{client.base_site_url}{url_path}"

            print(f"[{index}] {name}")
            print(f"    💰 Fiyat: {price} {currency}")
            print(f"    🔗 Link:  {full_url}")
            print("-" * 50)
    else:
        print("❌ Arama sonucunda hiçbir ürün dönmedi veya bir hata oluştu.")
