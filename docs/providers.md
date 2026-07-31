# Provider Development Guide

This guide explains how to add support for a new e-commerce store (e.g. `Motorobit`, `KartalOtomasyon`, `Ozdisan`) to **Robo Market Search**.

---

## 🏗️ Provider Architecture

Every store provider inherits from `BaseStoreClient` (or implements the standard client interface):

```
Store Provider Request Pipeline:
User Query ➔ Search URL ➔ HTTP Request (curl_cffi / Token) ➔ HTML / JSON Response ➔ BeautifulSoup / Regex Parser ➔ Normalized Product List
```

---

## 🛠️ Step-by-Step Tutorial: Adding a New Store Client

### Step 1: Create a new file in `robo_market_search/<store_name>/client.py`

```python
"""
New Store Scraper Client for Motorobit
"""

import logging
from typing import List, Optional
from bs4 import BeautifulSoup
from curl_cffi import requests

from robo_market_search.shared.models import Product

logger = logging.getLogger("robo_market_search.motorobit")

class MotorobitClient:
    """
    Motorobit.com scraper client.
    """

    STORE_NAME = "Motorobit"
    BASE_URL = "https://www.motorobit.com"

    def __init__(self, timeout: int = 10) -> None:
        self.timeout = timeout
        self.session = requests.Session(impersonate="chrome")

    def search(self, query: str, limit: int = 10) -> List[Product]:
        url = f"{self.BASE_URL}/arama?q={query}"
        try:
            resp = self.session.get(url, timeout=self.timeout)
            if resp.status_code != 200:
                logger.warning(f"[{self.STORE_NAME}] HTTP {resp.status_code} returned.")
                return []
            
            return self._parse_html(resp.text, limit)
        except Exception as e:
            logger.error(f"[{self.STORE_NAME}] Error searching '{query}': {e}")
            return []

    def _parse_html(self, html: str, limit: int) -> List[Product]:
        soup = BeautifulSoup(html, "html.parser")
        products: List[Product] = []

        for card in soup.select(".product-item")[:limit]:
            name_el = card.select_one(".product-title")
            price_el = card.select_one(".product-price")
            link_el = card.select_one("a[href]")

            if not name_el or not price_el:
                continue

            name = name_el.text.strip()
            # Clean title tags like || metadata
            name = name.split("||")[0].strip()

            price_raw = price_el.text.replace(".", "").replace(",", ".").replace("TL", "").strip()
            try:
                price = float(price_raw)
            except ValueError:
                continue

            link = link_el["href"] if link_el else ""
            if link and not link.startswith("http"):
                link = f"{self.BASE_URL}{link}"

            products.append(
                Product(
                    name=name,
                    price=price,
                    store=self.STORE_NAME,
                    url=link,
                    in_stock=True
                )
            )

        return products
```

---

### Step 2: Register Provider in `UnifiedSearchClient`

In `robo_market_search/unified/client.py`:

1. Import your new client:
   ```python
   from robo_market_search.motorobit.client import MotorobitClient
   ```

2. Add to `STORE_NAMES` and default shipping rules:
   ```python
   STORE_NAMES = ["Robolink", "Robotistan", "Robo90", "Direncnet", "Motorobit"]

   SHIPPING_DEFAULTS["Motorobit"] = ShippingInfo(flat_rate=35.0, free_shipping_min=1500.0)
   ```

3. Instantiate in `UnifiedSearchClient.__init__`.

---

### Step 3: Write Unit Tests

Add a new test file in `tests/test_motorobit.py`:

```python
import pytest
from robo_market_search.motorobit.client import MotorobitClient

def test_motorobit_search():
    client = MotorobitClient()
    results = client.search("ESP32", limit=2)
    assert isinstance(results, list)
```
