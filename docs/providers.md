# Provider Development & Framework Plugin Guide

This guide explains how to add support for a new e-commerce store provider (e.g. `Motorobit`, `Robitshop`, `KartalOtomasyon`, `Ozdisan`) to **Robo Market Search** using the modular **BaseStore** plugin architecture.

---

## 🏗️ Provider Architecture

Every store provider inherits from `BaseStore` and registers itself with `@register_store`:

```
Store Provider Pipeline:
Fetch HTML/JSON ➔ Validate Response ➔ Parse Items ➔ Normalize to Product ➔ Filter & Sort
```

---

## 🛠️ Step-by-Step Tutorial: Adding a New Store Client

### Step 1: Create a new class extending `BaseStore`

```python
"""
Store Scraper Client for Motorobit
"""

import logging
from typing import List, Set
from curl_cffi import requests

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import register_store
from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.motorobit")


@register_store
class MotorobitClient(BaseStore):
    """
    Motorobit.com scraper client.
    """

    name: str = "Motorobit"
    capabilities: Set[StoreCapability] = {
        StoreCapability.SEARCH,
        StoreCapability.STOCK_STATUS,
        StoreCapability.IMAGE_URL,
    }

    def __init__(self, timeout: int = 10) -> None:
        self.timeout = timeout
        self.base_url = "https://www.motorobit.com/arama"

    def search(self, query: str, limit: int = 10) -> List[Product]:
        """
        Execute search and return normalized Product dataclasses.
        """
        params = {"q": query}
        try:
            resp = requests.get(
                self.base_url,
                params=params,
                timeout=self.timeout,
                impersonate="safari15_5",
            )
            resp.raise_for_status()
            return self._parse_html(resp.text, limit)
        except Exception as e:
            logger.error("[%s] Error searching '%s': %s", self.name, query, e)
            return []

    def _parse_html(self, html_content: str, limit: int) -> List[Product]:
        products = []
        # Parse products into Product dataclasses...
        return products[:limit]
```

### Step 2: Register & Query Stores Dynamically

```python
from robo_market_search.providers.registry import default_registry

# List registered stores
print(default_registry.list_stores())
# Output: ['Robotistan', 'Direncnet', 'Robo90', 'Robolink', 'Motorobit']

# Retrieve store class
store_cls = default_registry.get("Motorobit")
store_instance = store_cls()

# Check capabilities
if store_instance.supports(StoreCapability.STOCK_STATUS):
    print("Motorobit supports stock checks!")
```
