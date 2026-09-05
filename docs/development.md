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

## ⚡ Quick Start with Makefile

A comprehensive [`Makefile`](file:///Users/atacan/PycharmProjects/robo-market-search/Makefile) is provided to automate common development workflows. If `.venv` exists, `make` targets automatically detect and use virtual environment binaries.

Run `make help` to inspect all available targets:

```bash
make help
```

### 📋 Makefile Command Reference

| Command | Description | Equivalent Underlying Command |
| :--- | :--- | :--- |
| `make setup` | Full dev setup (install all extras, dev tools & git hooks) | `pip install -e ".[all,dev]" && pre-commit install ...` |
| `make install` | Editable install of core package | `pip install -e .` |
| `make install-all` | Editable install with all optional features | `pip install -e ".[all]"` |
| `make install-dev` | Editable install with all features + dev tools | `pip install -e ".[all,dev]"` |
| `make test` | Run pytest test suite | `pytest` |
| `make test-v` | Verbose pytest execution with short tracebacks | `pytest -v --tb=short` |
| `make test-cov` | Pytest with cross-package coverage report | `pytest --cov=... --cov-report=term-missing tests/` |
| `make lint` | Check code with Ruff | `ruff check .` |
| `make lint-fix` | Auto-fix lint violations with Ruff | `ruff check --fix .` |
| `make format` | Format code using Ruff | `ruff format .` |
| `make format-check` | Verify formatting without modifying files | `ruff format --check .` |
| `make typecheck` | Run static type checking via Mypy hook | `pre-commit run mypy --all-files` |
| `make pre-commit` | Run all pre-commit hooks on all files | `pre-commit run --all-files` |
| `make check` | Run format-check, lint, and typecheck | Runs formatting check, lint & typecheck |
| `make fix` | Apply code formatting and auto-fixes | Runs `format` and `lint-fix` |
| `make run-api` | Launch FastAPI REST API with auto-reload (port 8000) | `uvicorn robo_market_api.app.main:app --reload` |
| `make run-agent` | Launch interactive AI hardware agent CLI | `python -m robo_market_agent.cli` |
| `make run-mcp` | Launch Model Context Protocol server | `python -m robo_market_search.mcp.server` |
| `make run-bot` | Launch Telegram bot | `python -m robo_market_search.bot.server` |
| `make run-cli` | Display CLI help menu | `python -m robo_market_search.cli.main --help` |
| `make docker-build` | Build API Docker image | `docker build -t robo-market-api .` |
| `make docker-up` | Start API container via Docker Compose | `docker compose up -d` |
| `make docker-down` | Stop API container via Docker Compose | `docker compose down` |
| `make demo-up` | Start full demo stack (Frontend + Backend) | `docker compose -f demo/docker-compose.yml up -d` |
| `make demo-down` | Stop full demo stack | `docker compose -f demo/docker-compose.yml down` |
| `make build` | Build wheel and sdist packages | `python -m build` |
| `make clean` | Remove build artifacts, caches, and `.pyc` files | Cleans `build/`, `dist/`, `__pycache__`, `.pytest_cache/` |

---

## 🧪 Running Tests & Quality Checks

### 1. Pytest Test Suite
```bash
# Run all unit tests
make test
# Or: pytest

# Run tests with verbose output
make test-v
# Or: pytest -v --tb=short

# Run tests with coverage report
make test-cov
# Or: pytest --cov=robo_market_search --cov=robo_market_agent --cov=robo_market_api --cov-report=term-missing tests/
```

---

### 2. Linting & Formatting (`Ruff` & `MyPy`)

We enforce strict code formatting using **Ruff** and type checking via **MyPy**:

```bash
# Check formatting and lint
make check

# Automatically format code and fix lint issues
make fix

# Or execute specific targets:
make lint          # Ruff lint check
make lint-fix      # Ruff lint auto-fix
make format        # Ruff format
make format-check  # Ruff format check
make typecheck     # Mypy static type check
```

---

### 3. Pre-commit Hooks

Ensure pre-commit hooks are installed locally before committing code:

```bash
# Install git hooks
make setup
# Or: pre-commit install && pre-commit install --hook-type commit-msg

# Run all pre-commit hooks manually
make pre-commit
# Or: pre-commit run --all-files
```

---

## 🚀 Local Service Execution

You can quickly spin up individual services for local testing:

```bash
# Start FastAPI REST API server (http://localhost:8000)
make run-api

# Start AI Hardware Agent CLI
make run-agent

# Start MCP Server
make run-mcp

# Launch Demo Web Stack (React + FastAPI) in Docker
make demo-up
make demo-down
```

---

## 📦 Release Process (`release-please`)

Releases are fully automated via GitHub Actions using **Google Release Please**:

1. Merge PRs with [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`, `docs: ...`).
2. Release Please automatically creates/updates a Release PR with `CHANGELOG.md` updates.
3. When the Release PR is merged, GitHub Actions builds and publishes wheels to PyPI and GitHub Releases.
