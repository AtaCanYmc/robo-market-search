"""
Unit tests for core robo_market_search layer.
"""

import pytest

from robo_market_search import search, search_multiple, search_provider
from robo_market_search.shared.models import Product


def test_search_provider_invalid():
    with pytest.raises(ValueError, match="Unknown provider"):
        search_provider("invalid_store_name", "esp32")


def test_search_functions_contract(monkeypatch):
    dummy_product = Product(
        name="Test ESP32 Dev Board",
        price=150.0,
        currency="TL",
        url="https://example.com/esp32",
        store="Robotistan",
    )

    # Patch underlying UnifiedSearchClient.search method
    monkeypatch.setattr(
        "robo_market_search.unified.client.UnifiedSearchClient.search",
        lambda self, query, limit_per_store=10: [dummy_product],
    )

    res = search("ESP32", limit=5)
    assert len(res) == 1
    assert res[0].name == "Test ESP32 Dev Board"

    res_multi = search_multiple(["ESP32", "Relay"], limit=5)
    assert "ESP32" in res_multi
    assert "Relay" in res_multi
