# Robo Market Search

Türkiye'nin en popüler 4 elektronik ve robotik pazarında (**Robolink, Robotistan, Robo90, Direnç.net**) tek satır kodla, çok hızlı ve eşzamanlı arama yapmanızı sağlayan Python istemci kütüphanesi.

## Özellikler
- **Unified Search (Birleştirilmiş Arama)**: 4 markette paralel (Thread) olarak eşzamanlı arama yapar ve ürünleri ucuzdan pahalıya sıralar.
- **Standart Veri Tipi**: Tüm sonuçlar, standart `Product` objesi olarak döner.
- **Dinamik Token Mimarisi**: API key veya token değişikliklerinde otomatik güncellenerek (regex ile ana sayfalardan kazıyarak) kesintisiz çalışır.

## Kurulum

PyPI üzerinden doğrudan kurabilirsiniz:

```bash
pip install robo-market-search
```

## Hızlı Başlangıç (Birleştirilmiş Arama)

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()
products = client.search(query="arduino", limit_per_store=5)

for p in products:
    print(f"[{p.store}] {p.name} - {p.price} {p.currency} (Stok: {p.in_stock})")
```

## Bireysel Market Araması

Sadece belirli bir markette arama yapmak isterseniz:

```python
from robo_market_search import RobotistanClient

client = RobotistanClient()
products = client.search_component("esp32", limit=3)
```

## Lisans
MIT License
