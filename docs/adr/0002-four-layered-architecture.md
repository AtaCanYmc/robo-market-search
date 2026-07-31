# ADR 0002: 4-Layered Decoupled Architecture

- **Status**: Accepted
- **Date**: 2026-07-31

---

## Context
As the project expanded from a core search SDK to include AI Hardware Agents, CLI tools, REST API servers, MCP servers, and Vite Web UI applications, keeping all logic in a single module caused tight coupling and heavy dependency bloat.

---

## Decision
Separate the codebase into four independent logical layers:
1. `robo_market_search`: Pure core search SDK (zero extra dependencies).
2. `robo_market_service`: Caching, synonyms & ranking service.
3. `robo_market_agent`: AI Hardware Agent & BYOK provider pipeline.
4. `robo_market_api` & Applications: FastAPI REST API, CLI, MCP Server, Web UI.

---

## Consequences
- **Positive**: Clean separation of concerns; developers importing SDK do not pull FastAPI or LLM packages.
- **Positive**: Easy testing and independent module maintenance.
- **Positive**: Plug-and-play architecture for new interfaces.
