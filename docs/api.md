# REST API Reference Guide (`robo_market_api`)

The `robo_market_api` module provides a production FastAPI REST API layer.

---

## 🚀 Server Launch

```bash
# Launch via CLI command
robo-api

# Or directly via Uvicorn
uvicorn robo_market_api.app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc API Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔑 Bring Your Own API Key (BYOK) Headers

The API supports passing LLM API keys via HTTP Headers or request payloads:

| Header Name | Description | Example |
| :--- | :--- | :--- |
| `X-API-Key` | Generic LLM API Key | `sk-...` / `gsk_...` |
| `X-Provider` | Target LLM Provider | `openai`, `gemini`, `anthropic`, `deepseek`, `groq`, `ollama`, `mock` |
| `X-OpenAI-API-Key` | OpenAI Specific Key | `sk-proj-...` |
| `X-Gemini-API-Key` | Google Gemini Specific Key | `AIzaSy...` |
| `X-Anthropic-API-Key` | Anthropic Claude Key | `sk-ant-api...` |

---

## 📡 Endpoints Summary

### 1. `GET /health`
Returns system health status, active scrapers count, and version.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "1.4.0",
  "active_scrapers": ["Robolink", "Robotistan", "Robo90", "Direncnet"]
}
```

---

### 2. `GET /api/v1/search`
Perform concurrent search across e-commerce stores.

- **Query Parameters**:
  - `q` (`string`, required): Search keyword (e.g. `ESP32`).
  - `limit` (`integer`, optional, default `10`): Limit per store.
  - `sort` (`boolean`, optional, default `true`): Sort by price ascending.

**Response `200 OK`**:
```json
{
  "query": "ESP32",
  "total_results": 12,
  "results": [
    {
      "name": "ESP32 WROOM-32D DEVKIT V4",
      "price": 223.70,
      "currency": "TL",
      "store": "Robotistan",
      "url": "https://www.robotistan.com/esp32-wroom32d-devkitv4",
      "image_url": "https://cdn.robotistan.com/...",
      "in_stock": true
    }
  ]
}
```

---

### 3. `POST /api/v1/cart/optimize`
Calculate split-cart optimization and store free shipping limits.

- **Request Body**:
```json
{
  "items": ["ESP32-WROOM", "5V Relay Module", "OLED Display"]
}
```

---

### 4. `POST /api/v1/agent/analyze`
Execute the AI Hardware Agent pipeline.

- **Request Body**:
```json
{
  "prompt": "WiFi connected plant watering system",
  "project_type": "IoT / Akıllı Ev",
  "provider": "openai",
  "api_key": "sk-proj-..."
}
```
