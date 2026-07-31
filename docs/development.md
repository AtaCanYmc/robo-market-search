# Development Guide

This document covers local development, testing, code formatting, and release workflows for contributors.

---

## 🛠️ Repository Layout

```
robo-market-search/
├── robo_market_search/        # Core SDK & Scrapers
│   ├── robolink/              # Robolink client
│   ├── robotistan/            # Robotistan client
│   ├── robo90/                # Robo90 client
│   ├── direncnet/             # Direncnet client
│   ├── unified/               # Unified parallel search client
│   ├── cart/                  # Cart optimization & shipping calculator
│   ├── cli/                   # Typer CLI app
│   ├── mcp/                   # Model Context Protocol server
│   └── bot/                   # Aiogram Telegram Bot
├── robo_market_service/       # Caching, synonyms & ranking service
├── robo_market_agent/         # AI Hardware Agent & BYOK providers
├── robo_market_api/           # FastAPI REST API
├── demo/                      # Web UI & Backend Docker files
│   ├── frontend/              # Vite + React + Tailwind SPA
│   └── backend/               # REST API container launcher
├── docs/                      # Documentation suite & ADRs
├── tests/                     # Pytest suite
├── pyproject.toml             # Package metadata & tool configs
└── MANIFEST.in                # Package data rules
```

---

## 🧪 Running Tests & Quality Checks

### 1. Pytest Test Suite
```bash
# Run all unit tests
pytest

# Run tests with coverage report
pytest --cov=robo_market_search --cov=robo_market_agent --cov=robo_market_api
```

---

### 2. Linting & Formatting (`Ruff` & `MyPy`)

We enforce strict code formatting using **Ruff** and type checking via **MyPy**:

```bash
# Run Ruff linting check
ruff check .

# Fix auto-fixable issues
ruff check --fix .

# Run Ruff formatting check
ruff format --check .

# Run MyPy static type check
mypy .
```

---

### 3. Pre-commit Hooks

Ensure pre-commit hooks are installed locally before committing code:

```bash
pre-commit install
pre-commit run --all-files
```

---

## 🚀 Release Process (`release-please`)

Releases are fully automated via GitHub Actions using **Google Release Please**:

1. Merge PRs with [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`, `docs: ...`).
2. Release Please automatically creates/updates a Release PR with `CHANGELOG.md` updates.
3. When the Release PR is merged, GitHub Actions builds and publishes wheels to PyPI and GitHub Releases.
