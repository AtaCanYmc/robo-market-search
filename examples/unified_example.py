import sys
import time
from pathlib import Path

# Kütüphaneyi lokal test edebilmek için ana dizini path'e ekliyoruz
sys.path.append(str(Path(__file__).parent.parent))

from robo_market_search import UnifiedSearchClient

if __name__ == "__main__":
    print("--- Birleştirilmiş Arama (Unified Search) Başlatılıyor ---")
    
    start_time = time.time()
    unified_client = UnifiedSearchClient()
    
    search_keyword = "arduino"
    print(f"\n'{search_keyword}' kelimesi için tüm marketlerde eşzamanlı arama başlatılıyor...\n")
    
    # Her marketten en fazla 5 sonuç isteyelim (toplam 20 edebilir)
    all_products = unified_client.search(query=search_keyword, limit_per_store=5)
    
    if all_products:
        print(f"\n✅ Toplam {len(all_products)} ürün bulundu ve ucuzdan pahalıya sıralandı:\n")
        
        for index, item in enumerate(all_products, 1):
            stock_status = "Stokta Var" if item.in_stock else "Stokta Yok"
            
            print(f"[{index}] {item.name}")
            print(f"    🏪 Market: {item.store}")
            print(f"    💰 Fiyat : {item.price} {item.currency}")
            print(f"    📦 Stok  : {stock_status}")
            print(f"    🔗 Link  : {item.url}")
            print("-" * 50)
    else:
        print("❌ Hiçbir markette ürün bulunamadı.")
        
    end_time = time.time()
    print(f"⏳ Toplam işlem süresi: {end_time - start_time:.2f} saniye")
