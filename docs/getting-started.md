# Getting Started with Robo Market Search

Welcome to **Robo Market Search**! This guide will help you quickly understand the ecosystem, install the tools, and perform your first e-commerce search across Turkey's leading electronics and robotics stores (**Robolink, Robotistan, Robo90, Direnç.net**).

---

## 🌟 What is Robo Market Search?

Robo Market Search is a production-grade, open-source Python e-commerce aggregator and hardware AI assistant. Rather than a single scraper script, it is structured as a **4-layered ecosystem**:

1. **Core SDK (`robo_market_search`)**: Zero-dependency Python library with parallel store scrapers, dynamic token refreshers, and cart optimization logic.
2. **Search Service (`robo_market_service`)**: High-level service layer providing memory/disk caching, synonym expansions, and product ranking.
3. **AI Hardware Agent (`robo_market_agent`)**: Otonom hardware BOM generator and compatibility checker supporting **Bring Your Own API Key (BYOK)** for OpenAI, Gemini, Claude, DeepSeek, Groq, and Ollama.
4. **REST API & Interfaces (`robo_market_api`, Vite Web UI, CLI, MCP Server, Telegram Bot)**: Access methods for any workflow.

---

## 🚀 Quick Start in 60 Seconds

### 1. Command Line Interface (CLI)

The fastest way to try Robo Market Search is via `pipx` or `pip`:

```bash
# Install CLI
pip install "robo-market-search[cli]"

# Search for a product across all 4 stores
robo-search "ESP32-WROOM" --limit 5

# Calculate split-cart optimization for multiple components
robo-search cart "ESP32-WROOM" "5V Relay Module" "OLED Display"
```

---

### 2. Python SDK

Include Robo Market Search in your own Python projects:

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()

# Eşzamanlı arama (4 markette paralel)
results = client.search("Arduino Uno R3", limit_per_store=3)

for product in results:
    print(f"[{product.store}] {product.name} - {product.price} TL (Stok: {product.in_stock})")
```

---

### 3. REST API & Web UI

Launch the production REST API server locally:

```bash
pip install "robo-market-search[api]"
robo-api
```
- Open Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Open Live Web Application: [https://robo-market-search.onrender.com](https://robo-market-search.onrender.com)

---

## 📚 Documentation Index

Explore the full documentation suite:

| Topic | Description | Link |
| :--- | :--- | :--- |
| **Architecture** | 4-Layer design, ThreadPool engine, scrapers & token refreshers | [architecture.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/architecture.md) |
| **Installation** | Full installation matrix (`pipx`, `brew`, `curl`, `pip`, `docker`) | [installation.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/installation.md) |
| **Configuration** | Environment variables, BYOK keys, free shipping thresholds | [configuration.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/configuration.md) |
| **Python SDK** | Complete API reference for `UnifiedSearchClient` & models | [sdk.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/sdk.md) |
| **CLI Reference** | Man-page style guide for `robo-search` & `robo-agent` | [cli.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/cli.md) |
| **MCP Server** | Claude Desktop, Cursor & VS Code MCP integration | [mcp.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/mcp.md) |
| **Telegram Bot** | Setting up `robo-bot` with BotFather and webhooks | [telegram.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/telegram.md) |
| **REST API** | OpenAPI endpoints, BYOK HTTP headers & Pydantic models | [api.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/api.md) |
| **Providers Guide** | Step-by-step tutorial on adding new store scrapers | [providers.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/providers.md) |
| **Development** | Contributing, running pytest, ruff formatting & CI/CD | [development.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/development.md) |
| **Troubleshooting** | Fixing 403 Cloudflare, token refresh, and LLM SDK errors | [troubleshooting.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/troubleshooting.md) |
| **FAQ** | Frequently Asked Questions | [faq.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/faq.md) |
| **Roadmap** | Future feature roadmap and upcoming milestones | [roadmap.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/roadmap.md) |
| **Architecture Decision Records (ADRs)** | Architectural decisions rationale | [adr/](file:///Users/atacan/PycharmProjects/robo-market-search/docs/adr/) |
