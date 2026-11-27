# Product Roadmap

This document defines the development milestones, architecture evolution, and release schedule for Robo Market Search.

The project follows [Semantic Versioning 2.0.0](https://semver.org/). Releases are automated through Conventional Commits and [Release Please](https://github.com/googleapis/release-please).

---

## Milestone Overview

| Milestone | Target Scope | Status | Focus Area |
| :--- | :--- | :--- | :--- |
| **v1.0.0 - v1.9.0** | Foundation & Ecosystem | Completed | Core scrapers, Unified Search, MCP server, Telegram bot, Vite Web UI. |
| **v1.10.0** | Desktop App & Store Expansion | Completed | Tauri v2 desktop app, Özdisan & Motorobit scrapers, `src/` migration, Release Please automation. |
| **v1.11.0** | Pipeline & Automation | Completed | Full Dependabot ecosystem coverage, automated pre-commit updates, CI optimizations. |
| **v1.12.0** | Desktop Packaging & Scraper Expansion | Current Release | Desktop release pipeline, Python sidecar, Bruno API collection. Redis cache and circuit breaker carried to v1.13.0. |
| **v1.13.0** | Cache, Resilience & Streaming | Planned | Redis cache, circuit breaker, SSE streaming for agent reasoning traces. |
| **v2.0.0** | Graph & Multi-Currency | Future Architecture | Component pin-compatibility graph, multi-currency conversion, unified GraphQL API. |

---

## Detailed Milestones

### Completed Milestones

#### v1.0.0 - v1.9.0: Foundation & Multi-Interface Support
- Core HTTP client with `curl_cffi` browser fingerprint impersonation.
- Scraper engines for Robotistan, Robolink, Robo90, and Direncnet.
- Unified search orchestrator with parallel query execution and deduplication.
- Split-cart shopping cost optimizer with store-specific free shipping thresholds.
- Fast-path containerization with root and demo Dockerfiles.
- REST API layer built on FastAPI with BYOK (Bring Your Own API Key) authentication.
- Model Context Protocol (MCP) server for Claude Desktop and AI editor integration.
- Telegram bot interface for real-time component queries and cart calculation.
- Web demonstration application using React 18, Tailwind CSS v3, and Vite.

#### v1.10.0: Desktop App, Store Expansion & Packaging Hardening
- Complete redesign of the terminal interface using Rich with rounded box layouts.
- Clickable terminal hyperlinks (OSC 8) for product titles and direct store links.
- Smart subcommand routing: queries such as `robo-search "ESP32"` execute without explicit `search` keyword.
- Best-price detection with visual in-stock badges.
- Official Homebrew Tap distribution via `atacanymc/tap/robo-market-search`.
- Scraper engine expansion with Özdisan and Motorobit client integrations.
- Tauri v2 cross-platform desktop application with traffic-light drag regions, custom activity sidebar, status bar, and keyboard shortcuts (`⌘1`..`⌘4`, `⌘B`, `⌘K`).
- Dynamic package metadata resolution across Python (`importlib.metadata`) and Frontend (`package.json`).
- Automated multi-target version bumping with Release Please.

---

### In Progress & Upcoming Milestones

#### v1.11.0: Automation & Dependency Governance (Completed)
- [x] Dynamic CLI package version resolution via `importlib.metadata`.
- [x] Repository-wide Dependabot configuration covering root, `/app/backend`, `/app/frontend`, Dockerfiles, and GitHub Actions.
- [x] Automated weekly pre-commit hook update workflow via GitHub Actions.
- [x] Dependency synchronization across Python packages and frontend build manifests.

#### v1.12.0: Scraper Expansion & Desktop Packaging (Current)
- **New Scraper Integrations**:
  - [x] Implement `OzdisanClient` for industrial electronic components and IC distribution.
  - [x] Implement `MotorobitClient` for robotics and automation hardware.
- **Desktop Application Packaging (Tauri v2)**:
  - [x] Cross-platform desktop release pipeline for macOS (.dmg), Windows (.msi/.exe), and Linux (.AppImage/.deb).
  - [x] Standalone Python sidecar integration with zero external Python dependency.
- **API Tooling**:
  - [x] Bruno collection in [`bruno/`](bruno/) with endpoint requests and assertions, runnable with `make test-api`.

#### v1.13.0: Cache, Resilience & Streaming
- **Distributed Cache Layer**:
  - [x] Optional Redis backend (`ROBO_REDIS_URL`, `pip install "robo-market-search[redis]"`) alongside the SQLite cache.
  - [x] Implement TTL-based cache invalidation per market source.
- **Scraper Resilience**:
  - [x] Circuit-breaker pattern to gracefully isolate failing market endpoints.
  - [x] Fallback `User-Agent` rotation after a bot-protection challenge.
  - Catalog pagination recovery.
- **Agent Streaming Protocol**:
  - Server-Sent Events (SSE) endpoint in `robo_market_api` for step-by-step BOM generation.
  - Real-time token streaming from LLM providers (OpenAI, Anthropic, Gemini, Groq, Ollama).
- **Platform Security**:
  - Track upstream Tauri GTK3 migration to clear the `glib` 0.18 advisory on Linux builds.
- **Price Alerting**:
  - Webhook delivery mechanism for component price drops and restock alerts.
  - Configurable target price threshold alerts via CLI and REST API.
- **Cloud Hosting & Deploy Templates**:
  - [x] Free cloud hosting guide (`docs/hosting.md`) covering Oracle Cloud Always Free, Hugging Face Spaces (Docker), and Google Cloud Run.
  - [x] Hugging Face Spaces `Dockerfile` and `README.md` template in `docs/hosting.md`.
  - Oracle Cloud Always Free setup template.

#### v2.0.0: Advanced Component Graph & Enterprise Features
- **Component Equivalence Graph**:
  - Pin-to-pin and functional replacement suggestion engine for out-of-stock items.
  - Datasheet parameter normalization (voltage, footprint, current rating).
- **Internationalization & Currency**:
  - Multi-currency normalization (USD, EUR, TRY) using central bank exchange feeds.
  - Multi-language catalog matching for international components.
- **Client SDK Generation**:
  - Automated TypeScript client generation from OpenAPI specifications.
  - Python SDK asynchronous client parity across all endpoints.

---

## Release Process

Releases follow an automated continuous delivery flow:

```mermaid
flowchart LR
    A["Pull Request Merged"] --> B["Release Please Action"]
    B --> C{"Version Bump Needed?"}
    C -->|Yes| D["Generate Release PR"]
    D --> E["Merge Release PR"]
    E --> F["Create GitHub Release & Tag"]
    F --> G["Publish to PyPI"]
    F --> H["Update Homebrew Formula"]
    C -->|No| I["No Release Action"]
```

---

## Feedback & Feature Proposals

Feature proposals and roadmap suggestions should follow the structured issue templates:

1. Check existing initiatives in the [Issue Tracker](https://github.com/AtaCanYmc/robo-market-search/issues).
2. Open a feature request using the structured GitHub Issue template with clear technical motivation and verification steps.
3. For architectural modifications, submit an Architecture Decision Record (ADR) draft in [`docs/adr/`](docs/adr/).
