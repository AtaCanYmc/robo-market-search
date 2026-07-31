# `robo_market_service` — Search Service Layer

`robo_market_service`, temel arama kütüphanesi (`robo_market_search`) ile üst seviye sistemler veya Yapay Zeka Ajanı (`robo_market_agent`) arasında bir köprü görevi gören **Servis Katmanıdır**.

> ⚡ **ÖNEMLİ:** Bu katman da **Yapay Zeka (AI) mantığından bağımsızdır**. Paralelleştirme, yeniden deneme (retry), önbellekleme (caching), eşanlamlı kelime genişletme (synonyms), tekilleştirme (deduplication) ve skorlama sıralaması gibi iş odaklı arama servis mantıklarını yönetir.

---

## Özellikler & Sorumluluklar
1. **Paralel & Eşzamanlı Arama**: Çoklu donanım aramasını arka planda paralel yönetir.
2. **Yeniden Deneme (Retries & Backoff)**: Bağlantı veya ağ hatalarında katlanarak artan zaman aşımı ile otomatik yeniden dener.
3. **Önbellek Yönetimi (`ServiceCache`)**: SQLite altyapısı ile mükerrer aramaları engeller.
4. **Sorgu Normalleştirme & Eşanlamlı Açılımı (`SynonymExpander`)**: Elektronik parça terimlerini otomatik genişletir (örn: "solenoid valve" -> "selenoid vana", "nodemcu" -> "esp32").
5. **Fuzzy Matching & Deduplication**: Benzersiz ürünleri tespit eder, başlık benzerliği, stok durumu ve fiyata göre akıllı skorlama yaparak sıralar.
6. **Sepet Optimizasyonu (`cart_search`)**: Tek mağaza vs. bölünmüş mağaza (split cart) kargo ve ürün toplam maliyetlerini kıyaslar.

---

## Dosya Yapısı

```
robo_market_service/
├── search_service.py   # Ana SearchService orkestratörü
├── synonym.py          # Elektronik bileşen eşanlamlı kütüphanesi (SynonymExpander)
├── cache.py            # SQLite arama önbelleği (ServiceCache)
├── models.py           # Servis istek ve yanıt veri modelleri (ServiceSearchRequest, ServiceSearchResult)
└── __init__.py         # Modül dışa aktarımları
```

---

## Kullanım Örnekleri

### 1. Tekli Arama ve Eşanlamlı Kelime Genişletme
```python
from robo_market_service import SearchService, ServiceSearchRequest

service = SearchService(use_cache=True)

request = ServiceSearchRequest(
    query="solenoid valve",
    limit_per_store=5,
    expand_synonyms=True  # "selenoid vana", "su vanası 12v" vb. otomatik genişletir
)

result = service.search_single(request)
print(f"Toplam Bulunan: {result.total_found} (Aranan Terimler: {result.expanded_queries})")

for p in result.products:
    print(f"[{p.store}] {p.name} - {p.price} TL")
```

### 2. Çoklu Komponentleri Eşzamanlı Arama
```python
from robo_market_service import SearchService

service = SearchService()

queries = ["ESP32 DevKit", "4 Channel Relay", "12V Power Supply"]
results = service.search_concurrent(queries, limit_per_store=3)

for query, srv_res in results.items():
    print(f"\nKomponent: {query} (Bulunan: {srv_res.total_found})")
    for p in srv_res.products:
        print(f"  - [{p.store}] {p.name} ({p.price} TL)")
```

### 3. Sepet Optimizasyonu (Cart Optimization)
```python
from robo_market_service import SearchService

service = SearchService()
cart_result = service.cart_search(["ESP32", "L298N", "HC-SR04"], limit_per_store=5)

if cart_result.best_split:
    print(f"🏆 En Optimal Genel Toplam (Bölünmüş Sipariş): {cart_result.best_split.grand_total} TL")
```
