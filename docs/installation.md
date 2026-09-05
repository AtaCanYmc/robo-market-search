# Installation Guide

Robo Market Search can be installed using multiple package managers depending on your use case.

---

## 📦 Installation Matrix

| Use Case | Recommended Command | Installed Tools |
| :--- | :--- | :--- |
| **CLI & Tools Only** | `pipx install "robo-market-search[all]"` | `robo-search`, `robo-agent`, `robo-mcp`, `robo-api` |
| **Homebrew (macOS/Linux)** | `brew install atacanymc/robo-market-search/robo-market-search` | Standalone CLI |
| **cURL Shell Installer** | `curl -fsSL https://raw.githubusercontent.com/.../install.sh \| bash` | Standalone CLI & environment |
| **Python SDK Only** | `pip install robo-market-search` | `robo_market_search` package |
| **Full Python Ecosystem** | `pip install "robo-market-search[all]"` | Core SDK, Agent, API, MCP, Bot |

---

## 1. 🚀 Modern CLI Installation (`pipx` - Recommended)

[`pipx`](https://pipx.pypa.io/) installs Python applications into isolated environments while making their executables globally available.

```bash
# Install full ecosystem via pipx
pipx install "robo-market-search[all]"

# Verify installed commands
robo-search --help
robo-agent --help
robo-mcp --help
robo-api --help
```

---

## 2. 🍺 Homebrew Tap (macOS & Linux)

If you use Homebrew on macOS or Linux:

```bash
brew tap atacanymc/robo-market-search
brew install robo-market-search
```

---

## 3. ⚡ Single-Line Shell Installer (cURL)

For quick setup on Linux/macOS servers without manual virtualenv configuration:

```bash
curl -fsSL https://raw.githubusercontent.com/AtaCanYmc/robo-market-search/main/install.sh | bash
```

---

## 4. 📦 Python SDK Installation (`pip`)

If you are developing a Python project and importing `robo_market_search`:

### Minimal Core SDK (Zero extra dependencies)
```bash
pip install robo-market-search
```

### Full Ecosystem (With FastAPI, Pydantic, LLM SDKs)
```bash
pip install "robo-market-search[all]"
```

### Specific Extra Groups
```bash
pip install "robo-market-search[cli]"    # CLI tools (Typer, Rich)
pip install "robo-market-search[agent]"  # AI Agent & LLM SDKs
pip install "robo-market-search[api]"    # FastAPI REST API
pip install "robo-market-search[mcp]"    # Model Context Protocol
pip install "robo-market-search[bot]"    # Telegram Bot (Aiogram)
```

---

## 🛠️ Developer Setup (Editable Mode)

To contribute to Robo Market Search:

```bash
# 1. Clone repository
git clone https://github.com/AtaCanYmc/robo-market-search.git
cd robo-market-search

# 2. Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Setup dependencies & git pre-commit hooks
make setup
# Or manually: pip install -e ".[all,dev]" && pre-commit install

# 4. Run test suite
make test
# Or: pytest
```

> [!TIP]
> Run `make help` to see all available commands for development, linting, tests, and Docker services.
