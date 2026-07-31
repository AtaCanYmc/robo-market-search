"""
Tests for store providers endpoints.
"""

from unittest.mock import patch

from fastapi.testclient import TestClient

from robo_market_api.app.main import app
from robo_market_search.shared.models import Product

client = TestClient(app)


def test_list_providers():
    response = client.get("/api/v1/providers")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] == 4
    provider_names = [p["name"] for p in data["providers"]]
    assert "robotistan" in provider_names
    assert "robolink" in provider_names


def test_search_specific_provider_invalid():
    response = client.post(
        "/api/v1/providers/unknown_store",
        json={"query": "ESP32"},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "INVALID_PROVIDER"


@patch("robo_market_api.app.services.search_service.search_provider")
def test_search_specific_provider_valid(mock_search_provider):
    mock_search_provider.return_value = [
        Product(name="ESP32 Board", price=150.0, currency="TL", url="https://robotistan.com/esp32", store="robotistan")
    ]

    response = client.post(
        "/api/v1/providers/robotistan",
        json={"query": "ESP32", "limit": 2},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["provider"] == "robotistan"
    assert data["count"] == 1
    assert data["products"][0]["title"] == "ESP32 Board"
