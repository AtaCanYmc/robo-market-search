"""
Tests for AI Hardware Agent API endpoints with Bring Your Own API Key (BYOK).
"""

from fastapi.testclient import TestClient

from robo_market_api.app.main import app

client = TestClient(app)


def test_agent_analyze_mock_provider() -> None:
    """
    Test agent analysis endpoint using mock provider.
    """
    response = client.post(
        "/api/v1/agent/analyze",
        json={
            "prompt": "ESP32 smart plant watering system",
            "project_type": "IoT",
            "provider": "mock",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["provider"] == "mock"


def test_agent_analyze_byok_headers() -> None:
    """
    Test agent analysis endpoint passing BYOK key via HTTP headers.
    """
    response = client.post(
        "/api/v1/agent/analyze",
        headers={
            "X-API-Key": "test-byok-key-12345",
            "X-Provider": "mock",
        },
        json={
            "prompt": "Smart Arduino Relay Box",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["byok_active"] is True


def test_agent_bom_mock_provider() -> None:
    """
    Test agent BOM generation endpoint.
    """
    response = client.post(
        "/api/v1/agent/bom",
        json={
            "prompt": "Arduino LED matrix display",
            "budget": 250.0,
            "provider": "mock",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "bom" in data["data"]
