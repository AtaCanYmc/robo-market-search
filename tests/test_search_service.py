"""
Unit tests for robo_market_service layer.
"""

from robo_market_search.shared.models import Product
from robo_market_service.search_service import SearchService
from robo_market_service.synonym import SynonymExpander


def test_synonym_expander():
    expander = SynonymExpander()
    expanded = expander.expand("esp32")
    assert "esp32" in expanded
    assert "esp32 devkit" in expanded or "nodemcu" in [e.lower() for e in expanded]


def test_search_service_deduplication():
    service = SearchService(use_cache=False)
    p1 = Product(name="ESP32 Board", price=100.0, currency="TL", url="http://store.com/p1", store="Robotistan")
    p2 = Product(name="ESP32 Board", price=100.0, currency="TL", url="http://store.com/p1", store="Robotistan")
    p3 = Product(name="ESP32 Board", price=120.0, currency="TL", url="http://store.com/p2", store="Robolink")

    deduped = service._deduplicate_products([p1, p2, p3])
    assert len(deduped) == 2


def test_search_service_ranking():
    service = SearchService(use_cache=False)
    p1 = Product(name="Other item", price=50.0, currency="TL", url="http://store.com/p1", store="Robotistan")
    p2 = Product(name="ESP32 DevKit Board", price=100.0, currency="TL", url="http://store.com/p2", store="Robolink")

    ranked = service._rank_products("ESP32 DevKit", [p1, p2])
    assert len(ranked) == 2
    # p2 should rank higher due to title match relevance discount
    assert ranked[0].name == "ESP32 DevKit Board"
