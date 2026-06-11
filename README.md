# Robolink Search

Robolink Market üzerinde hızlı ve dinamik arama yapmanızı sağlayan Python istemci kütüphanesi.

## Kurulum

```bash
pip install robolink-search
```

## Kullanım

```python
from robolink_search import RobolinkClient

client = RobolinkClient()
results = client.search_component("esp32", limit=3)

for idx, item in enumerate(results, 1):
    print(f"{idx}. {item.get('name')} - Fiyat: {item.get('price')} TL")
```
