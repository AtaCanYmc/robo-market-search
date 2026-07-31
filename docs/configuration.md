# Configuration Guide

Robo Market Search can be configured via environment variables, configuration files (`config.json`), or programmatic parameter overrides.

---

## ⚙️ Environment Variables Table

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `LOG_LEVEL` | String | `INFO` | Logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `CACHE_ENABLED` | Boolean | `true` | Enable/disable search result caching in `SearchService` |
| `CACHE_TTL_SECONDS` | Integer | `7200` | Search result cache expiration time (default 2 hours) |
| `ROBO_AGENT_PROVIDER` | String | `openai` | Default LLM provider for AI Agent (`openai`, `gemini`, `anthropic`, `deepseek`, `groq`, `ollama`, `mock`) |
| `ROBO_AGENT_KEY` | String | None | Default API Key for LLM provider |
| `HOST` | String | `0.0.0.0` | REST API server binding host |
| `PORT` | Integer | `8000` | REST API server port |
| `BOT_TOKEN` | String | None | Telegram Bot token from @BotFather |

---

## 🚚 Free Shipping Thresholds & Overrides

Shipping costs and free shipping threshold limits can be configured per store.

### Default Thresholds (TL)

- **Robotistan**: 1500.0 TL
- **Robolink**: 1500.0 TL
- **Robo90**: 1500.0 TL
- **Direnç.net**: 1500.0 TL
- **Flat Shipping Fee**: 60.0 TL (applied when order total is below threshold)

### Overriding via CLI

```bash
robo-search cart "ESP32" "Relay Module" \
  --free-robotistan 1000 \
  --free-robolink 1200 \
  --shipping-robotistan 50
```

### Overriding via Python SDK

```python
from robo_market_search import UnifiedSearchClient, ShippingInfo

client = UnifiedSearchClient()

overrides = {
    "Robotistan": ShippingInfo(flat_rate=50.0, free_shipping_min=1000.0),
    "Robolink": ShippingInfo(flat_rate=40.0, free_shipping_min=1200.0),
}

result = client.cart_search(
    queries=["ESP32", "0.96 OLED"],
    shipping_overrides=overrides
)
```

---

## 🔑 AI Agent BYOK Config File

The `robo-agent` CLI tool persists configured API keys locally at:
- **macOS / Linux**: `~/.config/robo-market-agent/config.json`
- **Windows**: `%APPDATA%\robo-market-agent\config.json`

Example `config.json`:

```json
{
  "default_provider": "deepseek",
  "providers": {
    "openai": {
      "api_key": "sk-proj-..."
    },
    "deepseek": {
      "api_key": "sk-..."
    },
    "groq": {
      "api_key": "gsk_..."
    }
  }
}
```

Manage stored credentials using CLI commands:

```bash
robo-agent config set --provider deepseek --api-key "sk-..." --default
robo-agent config show
robo-agent config clear
```
