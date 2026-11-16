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


def test_motorobit_parser(monkeypatch):
    from robo_market_search.motorobit.client import MotorobitClient

    sample_html = """
    <html>
    <script>
    PRODUCT_DATA.push(JSON.parse('{\\"id\\":\\"123\\",\\"name\\":\\"ESP32 WROOM\\",\\"total_sale_price\\":150.5,\\"url\\":\\"/esp32-wroom\\",\\"image\\":\\"https://motorobit.com/img.jpg\\",\\"available\\":true,\\"quantity\\":10}'));
    </script>
    </html>
    """

    class DummyResponse:
        status_code = 200
        text = sample_html

        def raise_for_status(self):
            pass

    monkeypatch.setattr(
        "robo_market_search.motorobit.client.requests.get",
        lambda *args, **kwargs: DummyResponse(),
    )

    client = MotorobitClient()
    products = client.search("esp32", limit=5)
    assert len(products) == 1
    p = products[0]
    assert p.name == "ESP32 WROOM"
    assert p.price == 150.5
    assert p.store == "Motorobit"
    assert p.url == "https://www.motorobit.com/esp32-wroom"
    assert p.image_url == "https://motorobit.com/img.jpg"
    assert p.in_stock is True


def test_ozdisan_parser(monkeypatch):
    from robo_market_search.ozdisan.client import OzdisanClient

    sample_header_data = {
        "variants": [
            {
                "sku": "STM32F401RET6",
                "description": "ARM Cortex-M4 MCU",
                "slug": "stm32f401ret6-12345",
                "category": {"slugs": [{"slug": "mcu-kategorisi", "langCode": "tr"}]},
                "medias": [{"field": "Picture", "path": "https://cdn.ozdisan.com/img.jpg"}],
            }
        ]
    }

    sample_product_html = """
    <script id="__NEXT_DATA__" type="application/json">
    {
        "props": {
            "pageProps": {
                "outOfStock": false,
                "data": {
                    "availability": {"totalStock": 100}
                },
                "initialPrice": {
                    "response": {
                        "data": {
                            "packages": [
                                {
                                    "priceBreaks": [
                                        {
                                            "prices": [
                                                {"currency": "TRY", "price": 185.50, "totalPrice": 185.50}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
    </script>
    """

    class DummyResp:
        def __init__(self, text="", json_data=None):
            self.text = text
            self._json = json_data
            self.status_code = 200

        def raise_for_status(self):
            pass

        def json(self):
            return self._json

    def mock_get(url, *args, **kwargs):
        if "layout/header" in url:
            return DummyResp(json_data=sample_header_data)
        return DummyResp(text=sample_product_html)

    monkeypatch.setattr(
        "robo_market_search.ozdisan.client.requests.get",
        mock_get,
    )

    client = OzdisanClient()
    products = client.search("stm32", limit=5)
    assert len(products) == 1
    p = products[0]
    assert "STM32F401RET6" in p.name
    assert p.price == 185.50
    assert p.currency == "TL"
    assert p.store == "Ozdisan"
    assert p.in_stock is True
    assert p.url == "https://www.ozdisan.com/p/mcu-kategorisi/stm32f401ret6-12345"
    assert p.image_url == "https://cdn.ozdisan.com/img.jpg"


def test_direncnet_json_parser(monkeypatch):
    from robo_market_search.direncnet.client import DirencnetClient

    sample_json = {
        "data": [
            {
                "id": "18248",
                "title": "ESP32-WROOM-32D 4MB Flash WiFi ve Bluetooth Modül",
                "price_sell_with_vat": "272,21",
                "price_sell": 226.84,
                "url": "/esp32-wroom-32d-wifi-modul",
                "image": "https://www.direnc.net/img.jpg",
                "stock": 1,
            }
        ]
    }

    class DummyResp:
        status_code = 200

        def json(self):
            return sample_json

    monkeypatch.setattr(
        "robo_market_search.direncnet.client.requests.post",
        lambda *args, **kwargs: DummyResp(),
    )

    client = DirencnetClient()
    products = client.search("ESP32", limit=5)
    assert len(products) == 1
    p = products[0]
    assert p.name == "ESP32-WROOM-32D 4MB Flash WiFi ve Bluetooth Modül"
    assert p.price == 272.21
    assert p.currency == "TL"
    assert p.store == "Direncnet"
    assert p.in_stock is True
    assert p.url == "https://www.direnc.net/esp32-wroom-32d-wifi-modul"
    assert p.image_url == "https://www.direnc.net/img.jpg"


def test_direncnet_html_dom_fallback(monkeypatch):
    from robo_market_search.direncnet.client import DirencnetClient

    class FailResp:
        status_code = 500

    monkeypatch.setattr(
        "robo_market_search.direncnet.client.requests.post",
        lambda *args, **kwargs: FailResp(),
    )

    sample_html = """
    <html>
    <body>
        <div data-toggle="product">
            <a href="/esp32-s3-board" data-toggle="product-url" title="ESP32-S3 Board">
                <span data-toggle="product-title">ESP32-S3 Board</span>
            </a>
            <img data-toggle="product-image" data-src="https://www.direnc.net/esp32s3.jpg" />
            <span data-toggle="price-sell-vat">349,34 TL</span>
        </div>
    </body>
    </html>
    """

    class DummyHtmlResp:
        status_code = 200
        text = sample_html

    monkeypatch.setattr(
        "robo_market_search.direncnet.client.requests.Session.get",
        lambda *args, **kwargs: DummyHtmlResp(),
    )

    client = DirencnetClient()
    products = client.search("ESP32", limit=5)
    assert len(products) == 1
    p = products[0]
    assert p.name == "ESP32-S3 Board"
    assert p.price == 349.34
    assert p.currency == "TL"
    assert p.store == "Direncnet"
    assert p.in_stock is True
    assert p.url == "https://www.direnc.net/esp32-s3-board"
    assert p.image_url == "https://www.direnc.net/esp32s3.jpg"
