# =============================================================================
# Robo Market Search — Automation & Development Makefile
# =============================================================================

.DEFAULT_GOAL := help
SHELL := /bin/bash

# Detect virtual environment or fall back to system PATH
VENV ?= .venv
ifneq ($(wildcard $(VENV)/bin/python),)
	PYTHON    := $(VENV)/bin/python
	PIP       := $(VENV)/bin/pip
	PYTEST    := $(VENV)/bin/pytest
	RUFF      := $(VENV)/bin/ruff
	MYPY      := $(VENV)/bin/mypy
	PRECOMMIT := $(VENV)/bin/pre-commit
	UVICORN   := $(VENV)/bin/uvicorn
else
	PYTHON    := python3
	PIP       := pip3
	PYTEST    := pytest
	RUFF      := ruff
	MYPY      := mypy
	PRECOMMIT := pre-commit
	UVICORN   := uvicorn
endif

# Terminal colors for help menu
CYAN    := \033[36m
GREEN   := \033[32m
YELLOW  := \033[33m
RESET   := \033[0m
BOLD    := \033[1m

.PHONY: help
help: ## Show this help message with available commands
	@printf "\n$(BOLD)Robo Market Search$(RESET) — Available Make Commands:\n\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@printf "\n"

# -----------------------------------------------------------------------------
# 📦 Environment & Setup
# -----------------------------------------------------------------------------

.PHONY: install install-all install-dev setup

install: ## Install core package in editable mode
	$(PIP) install -e .

install-all: ## Install package with all optional extras (api, agent, mcp, bot, cli)
	$(PIP) install -e ".[all]"

install-dev: ## Install package with all optional extras and dev tools
	$(PIP) install -e ".[all,dev]"

setup: install-dev ## Full developer setup: install all dev tools and git pre-commit hooks
	$(PRECOMMIT) install
	$(PRECOMMIT) install --hook-type commit-msg
	@printf "$(GREEN)✓ Development environment and pre-commit hooks configured.$(RESET)\n"

PYTHON_DIRS := robo_market_search robo_market_service robo_market_agent robo_market_api tests demo

# -----------------------------------------------------------------------------
# 🔍 Code Quality, Linting & Formatting
# -----------------------------------------------------------------------------

.PHONY: lint lint-fix format format-check typecheck pre-commit check fix

lint: ## Check code for errors and style violations using Ruff
	$(RUFF) check $(PYTHON_DIRS)

lint-fix: ## Auto-fix lint violations using Ruff
	$(RUFF) check --fix $(PYTHON_DIRS)

format: ## Format source files using Ruff
	$(RUFF) format $(PYTHON_DIRS)

format-check: ## Check code formatting without applying changes
	$(RUFF) format --check $(PYTHON_DIRS)

typecheck: ## Run static type checking using Mypy
	$(PRECOMMIT) run mypy --all-files

pre-commit: ## Run all pre-commit hooks on all files
	$(PRECOMMIT) run --all-files

check: format-check lint typecheck ## Run all quality checks (format check, lint, typecheck)
	@printf "$(GREEN)✓ All code quality checks passed!$(RESET)\n"

fix: format lint-fix ## Auto-format code and fix lint issues
	@printf "$(GREEN)✓ Formatting and auto-fixes applied!$(RESET)\n"

# -----------------------------------------------------------------------------
# 🧪 Testing
# -----------------------------------------------------------------------------

.PHONY: test test-v test-cov

test: ## Run the pytest test suite
	$(PYTEST)

test-v: ## Run pytest with verbose output and short tracebacks
	$(PYTEST) -v --tb=short

test-cov: ## Run pytest with test coverage report across packages
	$(PYTEST) --cov=robo_market_search --cov=robo_market_agent --cov=robo_market_api --cov-report=term-missing tests/

# -----------------------------------------------------------------------------
# 🚀 Running Local Services & CLI
# -----------------------------------------------------------------------------

.PHONY: run-api run-agent run-mcp run-bot run-cli

run-api: ## Start the FastAPI REST API with auto-reload (port 8000)
	$(UVICORN) robo_market_api.app.main:app --reload --host 0.0.0.0 --port 8000

run-agent: ## Launch the interactive AI hardware agent (CLI)
	$(PYTHON) -m robo_market_agent.cli

run-mcp: ## Launch the Model Context Protocol (MCP) server
	$(PYTHON) -m robo_market_search.mcp.server

run-bot: ## Launch the Aiogram Telegram bot
	$(PYTHON) -m robo_market_search.bot.server

run-cli: ## Show the Typer CLI command help
	$(PYTHON) -m robo_market_search.cli.main --help

# -----------------------------------------------------------------------------
# 🐳 Docker & Demo
# -----------------------------------------------------------------------------

.PHONY: docker-build docker-up docker-down demo-up demo-down

docker-build: ## Build the production API Docker image
	docker build -t robo-market-api .

docker-up: ## Start the API container with docker-compose
	docker compose up -d

docker-down: ## Stop the API container with docker-compose
	docker compose down

demo-up: ## Start the full demo stack (React Frontend + FastAPI Backend)
	docker compose -f demo/docker-compose.yml up -d

demo-down: ## Stop the full demo stack
	docker compose -f demo/docker-compose.yml down

# -----------------------------------------------------------------------------
# 🧹 Build & Maintenance
# -----------------------------------------------------------------------------

.PHONY: build clean

build: ## Build wheel and source distribution packages
	$(PYTHON) -m build

clean: ## Remove temporary build files, cache, coverage, and bytecode
	rm -rf build/ dist/ *.egg-info .eggs/
	rm -rf .pytest_cache/ .ruff_cache/ .mypy_cache/
	rm -rf .coverage htmlcov/
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	@printf "$(GREEN)✓ Cleaned up build artifacts and cache directories.$(RESET)\n"
