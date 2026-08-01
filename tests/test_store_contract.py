"""
Contract tests ensuring all registered store scrapers adhere to BaseStore standards and schema contracts.
"""

import pytest

from robo_market_search.providers.base import BaseStore, StoreCapability
from robo_market_search.providers.registry import default_registry
from robo_market_search.shared.models import Product


def test_registered_stores_exist():
    stores = default_registry.get_all()
    assert len(stores) >= 4
    assert "Robotistan" in stores
    assert "Direncnet" in stores
    assert "Robo90" in stores
    assert "Robolink" in stores


@pytest.mark.parametrize("store_name", ["Robotistan", "Direncnet", "Robo90", "Robolink"])
def test_store_class_contract(store_name):
    store_cls = default_registry.get(store_name)
    assert issubclass(store_cls, BaseStore)

    instance = store_cls()
    assert hasattr(instance, "name")
    assert instance.name == store_name
    assert hasattr(instance, "capabilities")
    assert StoreCapability.SEARCH in instance.capabilities

    assert hasattr(instance, "search")
    assert callable(instance.search)


def test_product_schema_contract():
    prod = Product(
        name="ESP32 Dev Board",
        price=149.90,
        currency="TL",
        url="https://example.com/esp32",
        store="TestStore",
        image_url="https://example.com/esp32.jpg",
        in_stock=True,
    )
    assert isinstance(prod.name, str)
    assert isinstance(prod.price, float)
    assert isinstance(prod.currency, str)
    assert isinstance(prod.url, str)
    assert isinstance(prod.store, str)
    assert isinstance(prod.in_stock, bool)
