"""
Tests for search API endpoints.
"""

from unittest.mock import AsyncMock, MagicMock

from fastapi.testclient import TestClient

from robo_market_api.app.dependencies.services import get_search_service
from robo_market_api.app.main import app
from robo_market_api.app.models.responses import ProductModel

client = TestClient(app)


def test_search_products():
    mock_service = MagicMock()
    mock_service.search = AsyncMock(
        return_value=[
            ProductModel(
                title="ESP32 Module",
                price=120.0,
                formatted_price="120,00 TL",
                url="https://robolinkmarket.com/esp32",
                store="robolink",
                in_stock=True,
            )
        ]
    )

    app.dependency_overrides[get_search_service] = lambda: mock_service

    try:
        response = client.post(
            "/api/v1/search",
            json={"query": "ESP32", "limit": 5},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["query"] == "ESP32"
        assert data["count"] == 1
        assert data["products"][0]["title"] == "ESP32 Module"
    finally:
        app.dependency_overrides.clear()


def test_search_validation_error():
    response = client.post(
        "/api/v1/search",
        json={"query": ""},  # Query min_length is 1
    )
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "VALIDATION_ERROR"


def test_batch_search_products():
    mock_service = MagicMock()
    mock_service.batch_search = AsyncMock(
        return_value={
            "ESP32": [
                ProductModel(
                    title="ESP32 Board",
                    price=150.0,
                    formatted_price="150,00 TL",
                    url="https://robotistan.com/esp32",
                    store="robotistan",
                    in_stock=True,
                )
            ],
            "Relay": [],
        }
    )

    app.dependency_overrides[get_search_service] = lambda: mock_service

    try:
        response = client.post(
            "/api/v1/search/batch",
            json={"queries": ["ESP32", "Relay"]},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["count"] == 2
        assert "ESP32" in data["results"]
        assert "Relay" in data["results"]
    finally:
        app.dependency_overrides.clear()
