# Python SDK Reference

The `robo_market_search` Python SDK provides a unified **Commerce Search Framework** for developers to perform concurrent product searches, event-driven logging, cart optimization, and hardware AI analysis directly inside Python applications.

---

## 📦 Core Imports Overview

```python
from robo_market_search import (
    Client,                  # Convenient alias for UnifiedSearchClient
    UnifiedSearchClient,
    Product,
    CartSearchResult,
    RoboMarketError,        # Base Exception
    CaptchaDetectedError,
    RateLimitError,
)
from robo_market_service import SearchService
from robo_market_agent import RoboMarketAgent
```

---

## 1. Quick Start (`Client`)

`Client` is the primary 3-line entry point for querying stores concurrently:

```python
from robo_market_search import Client

client = Client()
products = client.search("ESP32", limit_per_store=5)

for p in products:
    print(f"[{p.store}] {p.name} - {p.price} {p.currency}")
```

---

## 2. Event Hooks & Extensions (`EventDispatcher`)

Register callbacks to inspect HTTP requests, parsed products, error events, or search results:

```python
from robo_market_search import Client

client = Client()

# Event listeners
@client.on_request
def log_request(store_name: str, query: str):
    print(f"Searching {store_name} for '{query}'...")

@client.on_product
def inspect_product(product):
    if product.price < 50.0:
        print(f"Bargain alert: {product.name} at {product.price} TL")

@client.on_error
def handle_store_error(store_name: str, exc: Exception):
    print(f"Error on {store_name}: {exc}")

products = client.search("Arduino Uno")
```

---

## 3. Exception Handling Hierarchy

Catch granular errors mapped automatically by the framework:

```python
from robo_market_search import Client, CaptchaDetectedError, RateLimitError, RoboMarketError

client = Client()

try:
    results = client.search("ESP32-WROOM")
except CaptchaDetectedError as e:
    print(f"Bot protection triggered on store {e.store}: {e}")
except RateLimitError as e:
    print(f"Rate limited on {e.store}: {e}")
except RoboMarketError as e:
    print(f"General search error: {e}")
```

---

## 4. Cart Optimization (`cart_search`)

```python
results = client.cart_search(
    queries=["ESP32 WROOM", "OLED Display 0.96", "DHT22 Sensor"],
    limit_per_store=5
)

best_label, best_total = results.best_overall()
print(f"Optimal Purchase Plan: {best_label} -> Total: {best_total} TL")
```

---

## 5. `Product` Data Model

Represents a normalized e-commerce product returned from any store scraper.

```python
@dataclass
class Product:
    name: str                   # Cleaned product title
    price: float                # Product price in TL
    currency: str = "TL"        # Currency code ("TL")
    store: str                  # Store name ("Robotistan", "Robolink", "Robo90", "Direncnet")
    url: str                    # Direct URL to product page
    image_url: str = ""         # Thumbnail CDN URL
    in_stock: bool = True       # Availability status
```
