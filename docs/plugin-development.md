# Store Plugin Development Guide

`robo-market-search` uses a modular **Commerce Search Framework** architecture. Anyone can implement and register a custom e-commerce store provider by extending `BaseStore` and using the `@register_store` decorator.

---

## 🛠️ 1. Core Architecture

To create a store plugin, your class must:
1. Inherit from `robo_market_search.providers.base.BaseStore`.
2. Define a unique `name` attribute.
3. Specify supported capabilities (`StoreCapability`).
4. Implement the `search(self, query: str, limit: int = 10) -> List[Product]` method.
5. Register with `@register_store`.

---

## 📝 2. Step-by-Step Implementation Example

Here is a full example of adding a custom store provider (e.g. `Robitshop`):

```python
import logging
from typing import List, Set
from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product
from robo_market_search.shared.exceptions import ParsingError, NetworkError

logger = logging.getLogger("robo_market_search.robitshop")


@register_store
class RobitshopClient(BaseStore):
    name: str = "Robitshop"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self) -> None:
        self.base_url = "https://www.robitshop.com/search"
        self.headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

    def search(self, query: str, limit: int = 10) -> List[Product]:
        """
        Execute product search and return standardized Product dataclasses.
        """
        params = {"q": query}
        try:
            response = requests.get(
                self.base_url,
                params=params,
                headers=self.headers,
                impersonate="safari15_5",
            )
            response.raise_for_status()

            # Implement your parser pipeline (Fetch -> Parse -> Normalize)
            products = self._parse_html(response.text)
            return products[:limit]

        except Exception as exc:
            logger.error("Robitshop search error for query '%s': %s", query, exc)
            return []

    def _parse_html(self, html_content: str) -> List[Product]:
        # Parse HTML / JSON into Product objects
        products = []
        # ... parsing logic ...
        return products
```

---

## ⚙️ 3. Capability Matrix

Your plugin can declare supported features via `StoreCapability`:

- `StoreCapability.SEARCH`: Supports basic keyword search.
- `StoreCapability.STOCK_STATUS`: Provides real-time stock availability (`in_stock`).
- `StoreCapability.IMAGE_URL`: Returns product thumbnail image URLs.
- `StoreCapability.CATEGORY`: Provides category metadata.

Check capabilities programmatically:
```python
store = RobitshopClient()
if store.supports(StoreCapability.STOCK_STATUS):
    print("Store supports stock verification!")
```

---

## 🧪 4. Testing Your Plugin

Ensure your custom store satisfies contract tests by adding a unit test:

```python
from robo_market_search.providers.registry import default_registry
from robo_market_search.providers.base import BaseStore

def test_custom_store_registration():
    assert "Robitshop" in default_registry.list_stores()
    store_cls = default_registry.get("Robitshop")
    assert issubclass(store_cls, BaseStore)
```
