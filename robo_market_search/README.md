# `robo_market_search` — Core Search Library Layer

`robo_market_search` projenin temel arama ve web kazıma (scraping) katmanıdır. Türkiye'nin en popüler 4 robotik ve elektronik pazarında (**Robolink, Robotistan, Robo90, Direnç.net**) eşzamanlı arama yapar.

> ⚠️ **ÖNEMLİ:** Bu katman **Sıfır Yapay Zeka (AI) Bağımlılığı** prensibiyle yazılmıştır. Kendi başına bağımsız, hafif ve ultra hızlı bir kütüphanedir.

---

## Özellikler
- **4 Büyük Mağaza Desteği**: Robolink, Robotistan, Robo90 ve Direnç.net mağazalarını tarar.
- **Standart Veri Yapısı**: Tüm sonuçları `Product` veri modelinde döndürür.
- **Yüksek Geriye Dönük Uyumluluk**: Mevcut `UnifiedSearchClient`, `RobotistanClient`, `RobolinkClient`, `Robo90Client`, `DirencnetClient` sınıflarını korur.

---

## Modül Yapısı

```
robo_market_search/
├── providers/        # Mağaza kazıyıcı istemciler (RobolinkClient, RobotistanClient, vb.)
├── models/           # Temel veri modelleri (Product, ShippingInfo, CartSearchResult)
├── search/           # Temel arama fonksiyonları (search, search_multiple, search_provider)
├── shared/           # Ortak HTTP istemcileri ve önbellek mekanizması
├── unified/          # Birleştirilmiş paralel arama istemcisi (UnifiedSearchClient)
├── cli/              # Komut satırı (CLI) aracı (robo-search)
├── mcp/              # Model Context Protocol sunucusu (robo-mcp)
└── bot/              # Telegram Bot sunucusu (robo-bot)
```

---

## Kullanım Örnekleri

### 1. Tüm Mağazalarda Arama Yapma (`search`)
```python
from robo_market_search import search

# Tüm mağazalarda 0 AI bağımlılığı ile hızlı arama
results = search("ESP32 DevKit", limit=5)

for product in results:
    print(f"[{product.store}] {product.name} - {product.price} TL -> {product.url}")
```

### 2. Birden Fazla Sorguyu Eşzamanlı Arama (`search_multiple`)
```python
from robo_market_search import search_multiple

queries = ["ESP32", "4 Kanal Röle", "12V Adaptör"]
results_dict = search_multiple(queries, limit=3)

for query, products in results_dict.items():
    print(f"\nSorgu: {query}")
    for p in products:
        print(f"  - [{p.store}] {p.name} ({p.price} TL)")
```

### 3. Belirli Bir Mağazada Arama Yapma (`search_provider`)
```python
from robo_market_search import search_provider

# Sadece Robotistan üzerinde arama yapma
results = search_provider("robotistan", "Relay", limit=5)

for p in results:
    print(f"[{p.store}] {p.name} - {p.price} TL")
```

---

## Bağımlılıklar
- `curl_cffi` (HTTP istekleri ve SSL/TLS taklitleri için)
- `beautifulsoup4` (HTML ayrıştırma için)
