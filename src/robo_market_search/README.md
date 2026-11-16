[← Ana Depoya Dön](../../README.md)

# `robo_market_search`: Temel Arama Kütüphanesi Katmanı

`robo_market_search`, projenin temel arama ve web kazıma (scraping) katmanıdır. Türkiye'nin en popüler 6 robotik ve elektronik pazarında (**Robotistan, Robolink, Robo90, Direnç.net, Özdisan, Motorobit**) eşzamanlı arama yapar.

> ⚠️ **ÖNEMLİ:** Bu katman **Sıfır Yapay Zeka (AI) Bağımlılığı** prensibiyle yazılmıştır. Kendi başına bağımsız, hafif ve ultra hızlı bir Python kütüphanesidir.

---

## Özellikler

- **6 Büyük Mağaza Desteği**: Robotistan, Robolink, Robo90, Direnç.net, Özdisan ve Motorobit mağazalarını tarar.
- **Standart Veri Yapısı**: Tüm sonuçları `Product` veri modelinde döndürür.
- **Yüksek Geriye Dönük Uyumluluk**: Mevcut `UnifiedSearchClient`, `RobotistanClient`, `RobolinkClient`, `Robo90Client`, `DirencnetClient`, `OzdisanClient` ve `MotorobitClient` sınıflarını korur.
- **Genişletilebilir Eklenti Mimarisi**: `BaseStore` ve `@register_store` ile yeni mağaza eklemeyi kolaylaştırır.

---

## Modül Yapısı

```
robo_market_search/
├── providers/        # Mağaza arayüzleri ve kayıt defteri (BaseStore, default_registry)
├── robotistan/       # Robotistan kazıyıcı istemcisi
├── robolink/         # Robolink Market kazıyıcı istemcisi
├── robo90/           # Robo90 kazıyıcı istemcisi
├── direncnet/        # Direnç.net JSON API ve HTML kazıyıcı istemcisi
├── ozdisan/          # Özdisan endüstriyel komponent istemcisi
├── motorobit/        # Motorobit robotik mağazası istemcisi
├── models/           # Temel veri modelleri (Product, ShippingInfo, CartSearchResult)
├── search/           # Temel arama fonksiyonları (search, search_multiple, search_provider)
├── cart/             # Sepet ve kargo optimizasyon algoritmaları
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
