"""
Unit tests for new Framework features: Client alias, Event hooks, Exceptions, HTTPClient.
"""

from robo_market_search import CaptchaDetectedError, Client, RateLimitError, RoboMarketError
from robo_market_search.shared.models import Product


def test_client_alias_and_event_hooks():
    client = Client(use_cache=False)

    requests_logged = []
    products_logged = []
    results_logged = []

    client.on_request(lambda store, q: requests_logged.append((store, q)))
    client.on_product(lambda p: products_logged.append(p))
    client.on_result(lambda q, prods: results_logged.append((q, len(prods))))

    # Simulate emitting events
    client.events.emit_request("Robotistan", "ESP32")
    prod = Product(name="ESP32", price=100.0, currency="TL", url="http://x.com", store="Robotistan")
    client.events.emit_product(prod)
    client.events.emit_result("ESP32", [prod])

    assert len(requests_logged) == 1
    assert requests_logged[0] == ("Robotistan", "ESP32")
    assert len(products_logged) == 1
    assert products_logged[0].name == "ESP32"
    assert len(results_logged) == 1
    assert results_logged[0] == ("ESP32", 1)


def test_custom_exception_hierarchy():
    err = CaptchaDetectedError("Cloudflare active", store="Robotistan")
    assert isinstance(err, RoboMarketError)
    assert err.store == "Robotistan"
    assert "[Robotistan] Cloudflare active" in str(err)

    rate_err = RateLimitError("HTTP 429", store="Direncnet")
    assert isinstance(rate_err, RoboMarketError)
    assert rate_err.store == "Direncnet"
