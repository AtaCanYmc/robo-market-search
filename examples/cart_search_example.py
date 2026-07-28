"""
Sepet Arama ve Kargo Optimizasyonu (Cart Search with Shipping & Split Combination) Örneği.

Sha-Dox tarafından eklenen `cart_search` özelliğinin kullanımını gösterir.
Birden fazla malzeme almak istediğinizde tek mağazadan mı yoksa mağazalar arası
bölüşerek (split cart) mı almanın kargo ücretleriyle birlikte daha ucuza geleceğini hesaplar.
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

from robo_market_search import UnifiedSearchClient


def main() -> None:
    print("🛒 --- Sepet Optimizasyonu & Kargo Hesaplama Testi --- 🛒\n")

    client = UnifiedSearchClient()
    queries = ["ESP32", "L298N", "HC-SR04"]

    print(f"Aranan Ürün Listesi: {queries}\n")
    start = time.time()

    # Sepet araması yap
    result = client.cart_search(queries=queries, limit_per_store=5)
    elapsed = time.time() - start

    # 1. Her Mağaza İçin Tekil Sepet Özeti
    print("1️⃣ MAĞAZA BAZLI SEPET ÖZETLERİ:")
    print("=" * 60)
    for summary in result.store_summaries:
        status = "✅ Tüm Ürünler Var" if summary.has_all_items else f"❌ Eksikler Var ({', '.join(summary.missing_items)})"
        print(f"🏪 Market: {summary.store} [{status}]")
        print(f"   Ürün Toplamı : {summary.total_price:.2f} TL")
        print(f"   Kargo Ücreti  : {summary.shipping_cost:.2f} TL (Ücretsiz kargo barajı: {summary.free_shipping_min:.0f} TL)")
        print(f"   Genel Toplam  : {summary.total_with_shipping:.2f} TL")
        print("-" * 60)

    # 2. En Ucuz Tek Mağaza
    print("\n2️⃣ EN UCUZ TEK MAĞAZA KOMBİNASYONU:")
    if result.cheapest_store:
        cs = result.cheapest_store
        print(f"🏆 Mağaza: {cs.store}")
        print(f"   Toplam Tutarlar: {cs.total_price:.2f} TL Ürün + {cs.shipping_cost:.2f} TL Kargo = {cs.total_with_shipping:.2f} TL")
    else:
        print("❌ Tüm ürünlerin stokta olduğu tek bir mağaza bulunamadı.")

    # 3. Bölünmüş Sepet Optimizasyonu (Best Split)
    print("\n3️⃣ MAĞAZALAR ARASI EN UCUZ BÖLÜNMÜŞ SEPET (OPTIMAL SPLIT):")
    if result.best_split:
        bs = result.best_split
        print(f"💡 Genel Toplam Maliyet: {bs.grand_total:.2f} TL")
        for group in bs.groups:
            print(f"\n   📦 {group.store} Mağazasından Alınacaklar:")
            for item in group.items:
                print(f"      - {item.query}: {item.product.name} ({item.price:.2f} TL)")
            print(f"      Ara Toplam: {group.subtotal:.2f} TL | Kargo: {group.shipping:.2f} TL | Grup Toplamı: {group.total:.2f} TL")
    else:
        print("❌ Bölünmüş sepet oluşturulamadı.")

    print(f"\n⏳ İşlem {elapsed:.2f} saniyede tamamlandı.")


if __name__ == "__main__":
    main()
