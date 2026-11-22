# Getting Started with Robo Market Search

**Robo Market Search** queries Turkey's 6 major electronics and robotics stores (**Robotistan, Robolink, Robo90, Direnç.net, Özdisan, Motorobit**) in parallel, ranks live prices, optimizes split-store shipping thresholds, and generates hardware BOMs via BYOK LLM providers.

- Launch Demo (20s): [Watch on YouTube](https://youtu.be/zGbcepQuVU0)

---

## Architecture Overview

Rather than a single scraper script, the repository is structured as a **4-layered ecosystem**:

1. **Core SDK (`robo_market_search`)**: Zero-AI-dependency Python library with parallel store scrapers, dynamic token refreshers, and split-cart optimization logic.
2. **Search Service (`robo_market_service`)**: Service layer providing memory/disk caching, synonym expansion, deduplication, and product ranking.
3. **AI Hardware Agent (`robo_market_agent`)**: Autonomous hardware BOM generator and compatibility checker supporting **Bring Your Own API Key (BYOK)** for OpenAI, Gemini, Anthropic, DeepSeek, Groq, and Ollama.
4. **REST API and Interfaces (`robo_market_api`, Tauri + Vite Desktop/Web UI, CLI, MCP Server, Telegram Bot)**: Access methods sharing the same core.

---

## Quick Start

### 0. Docker (Fastest Local Stack)

```bash
git clone https://github.com/AtaCanYmc/robo-market-search.git
cd robo-market-search
docker compose up -d
```

### 1. Command Line Interface (CLI)

```bash
# Install CLI
pipx install "robo-market-search[cli]"

# Search for a product across all 6 stores
robo-search "ESP32-WROOM" --limit 5

# Calculate split-cart optimization for multiple components
robo-search cart "ESP32-WROOM" "5V Relay Module" "OLED Display"
```

---

### 2. Python SDK

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()

# Parallel live search across all 6 stores
results = client.search("Arduino Uno R3", limit_per_store=3)

for product in results:
    print(f"[{product.store}] {product.name} - {product.price} TL (Stock: {product.in_stock})")
```

---

### 3. REST API and Desktop UI

```bash
pip install "robo-market-search[api]"
robo-api
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Desktop App: Run `npm run desktop:dev` in `app/frontend/` or download a binary from [GitHub Releases](https://github.com/AtaCanYmc/robo-market-search/releases).

---

## Documentation Index

Explore the full documentation suite:

| Topic | Description | Link |
| :--- | :--- | :--- |
| **Architecture** | 4-Layer design, ThreadPool engine, scrapers and token refreshers | [architecture.md](architecture.md) |
| **Installation** | Full installation matrix (`pipx`, `brew`, `curl`, `pip`, `docker`) | [installation.md](installation.md) |
| **Configuration** | Environment variables, BYOK keys, free shipping thresholds | [configuration.md](configuration.md) |
| **Python SDK** | Complete API reference for `UnifiedSearchClient` and models | [sdk.md](sdk.md) |
| **CLI Reference** | Command guide for `robo-search` and `robo-agent` | [cli.md](cli.md) |
| **MCP Server** | Claude Desktop, Cursor and VS Code MCP integration | [mcp.md](mcp.md) |
| **Telegram Bot** | Setting up `robo-bot` with BotFather and webhooks | [telegram.md](telegram.md) |
| **REST API** | OpenAPI endpoints, BYOK HTTP headers and Pydantic models | [api.md](api.md) |
| **Providers Guide** | Step-by-step tutorial on adding new store scrapers | [providers.md](providers.md) |
| **Development** | Contributing, running pytest, ruff formatting and CI/CD | [development.md](development.md) |
| **Troubleshooting** | Fixing 403 Cloudflare, token refresh, and LLM SDK errors | [troubleshooting.md](troubleshooting.md) |
| **FAQ** | Technical Frequently Asked Questions | [faq.md](faq.md) |
| **Roadmap** | Feature roadmap and upcoming milestones | [roadmap.md](roadmap.md) |
| **Architecture Decision Records (ADRs)** | Architectural decisions rationale | [adr/](adr/) |
