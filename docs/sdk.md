# Python SDK Reference

The `robo_market_search` Python SDK allows developers to perform concurrent product searches, cart optimization, and hardware AI analysis directly inside Python applications.

---

## 📦 Core Classes Overview

```python
from robo_market_search import UnifiedSearchClient, Product, CartSearchResult
from robo_market_service import SearchService
from robo_market_agent import RoboMarketAgent
```

---

## 1. `UnifiedSearchClient`

`UnifiedSearchClient` is the primary interface for querying stores concurrently.

### Constructor
```python
UnifiedSearchClient(
    use_cache: bool = True,
    cache_ttl_seconds: int = 7200
)
```

### Methods

#### `search(query: str, limit_per_store: int = 10, stores: List[str] = None) -> List[Product]`
Searches all four stores in parallel, filters results, and sorts products from lowest to highest price.

- **Parameters**:
  - `query` (`str`): Product keyword (e.g. `"ESP32-WROOM"`).
  - `limit_per_store` (`int`, optional): Maximum products to fetch per store (default `10`).
  - `stores` (`List[str]`, optional): Specific store names to query (default all: `["Robolink", "Robotistan", "Robo90", "Direncnet"]`).
- **Returns**: `List[Product]`

#### `cart_search(queries: List[str], limit_per_store: int = 5, shipping_overrides: Dict[str, ShippingInfo] = None) -> CartSearchResult`
Performs multi-item component searching and evaluates store shipping thresholds to calculate single-store and split-cart optimization.

- **Parameters**:
  - `queries` (`List[str]`): List of component names to purchase.
  - `limit_per_store` (`int`): Candidates fetched per store per component.
  - `shipping_overrides` (`Dict[str, ShippingInfo]`): Custom store shipping rules.
- **Returns**: `CartSearchResult`

---

## 2. `Product` Data Model

Represents a normalized e-commerce product returned from any store scraper.

```python
class Product(BaseModel):
    name: str                   # Cleaned product title
    price: float                # Product price in TL
    currency: str = "TL"        # Currency code
    store: str                  # Store name ("Robotistan", "Robolink", "Robo90", "Direncnet")
    url: str                    # Direct URL to product page
    image_url: Optional[str]    # Direct image CDN URL
    in_stock: Optional[bool]    # Availability status (True, False, None)
    sku: Optional[str]          # Stock Keeping Unit if available
```

---

## 3. `RoboMarketAgent`

High-level AI Agent for hardware project analysis, BOM extraction, and compatibility validation.

```python
from robo_market_agent import RoboMarketAgent

agent = RoboMarketAgent(
    provider="openai",        # "openai", "gemini", "anthropic", "deepseek", "groq", "ollama", "mock"
    api_key="sk-..."          # LLM API key
)

report = agent.run(
    user_input="WiFi connected plant watering system with 4 valves and OLED display",
    project_type="IoT / Akıllı Ev"
)

print(report.summary_markdown)
```

---

## 💡 Code Examples

### Basic Parallel Search

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()
products = client.search("OLED Display", limit_per_store=3)

for p in products:
    print(f"{p.store:12} | {p.name[:35]:35} | {p.price:7.2f} TL | Stock: {p.in_stock}")
```

### Cart Optimization

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()
cart_res = client.cart_search(["ESP32-WROOM", "Relay 5V", "OLED Display 0.96"])

label, cheapest_total = cart_res.best_overall()
print(f"Optimal Strategy: {label} (Total: {cheapest_total:.2f} TL)")
```
