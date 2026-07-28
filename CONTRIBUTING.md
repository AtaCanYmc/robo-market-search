# Contributing to Robo Market Search

First off, thank you for taking the time to contribute! 🎉  
Every contribution — bug reports, feature requests, documentation improvements, or code — is welcome and appreciated.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features](#suggesting-features)
   - [Submitting a Pull Request](#submitting-a-pull-request)
3. [Development Setup](#development-setup)
4. [Commit Message Convention](#commit-message-convention)
5. [Code Style](#code-style)
6. [Project Structure](#project-structure)
7. [Release Process](#release-process)

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/)
code of conduct. By participating, you are expected to uphold this standard.
Please report unacceptable behaviour to **atacanymc@gmail.com**.

---

## How Can I Contribute?

### Reporting Bugs

Before filing a bug report, please search the [existing issues](https://github.com/AtaCanYmc/robo-market-search/issues)
to avoid duplicates.

When you do file a bug, use the **Bug Report** issue template and include:

- Your Python version and OS.
- The exact version of `robo-market-search` (`pip show robo-market-search`).
- A **minimal reproducible example** that triggers the bug.
- Full stack trace / error output.

> [!IMPORTANT]
> For security-related vulnerabilities, please follow our [Security Policy](SECURITY.md)
> and **do not** open a public issue.

### Suggesting Features

Use the **Feature Request** issue template. Describe the problem you want to
solve and why the current behaviour is insufficient. Include mockups, API
designs, or code sketches if you have them.

### Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-awesome-feature
   ```
2. Make your changes (see [Development Setup](#development-setup) below).
3. Ensure the linter passes (`flake8`).
4. Write or update tests where applicable.
5. Commit using [Conventional Commits](#commit-message-convention).
6. Push to your fork and open a **Pull Request** against `main`.
7. Fill in the PR template completely.

The maintainers aim to review PRs within **5 business days**.

---

## Development Setup

### Prerequisites

- Python 3.8+
- `git`

### Clone and install in editable mode

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/robo-market-search.git
cd robo-market-search

# 2. Create a virtual environment
python -m venv .venv
source .venv/bin/activate        # On Windows: .venv\Scripts\activate

# 3. Install the package with ALL optional dependencies + dev tools
pip install -e ".[all]"
pip install pre-commit ruff mypy types-beautifulsoup4

# 4. Install the git hooks (runs automatically on every commit)
pre-commit install             # pre-commit hook
pre-commit install --hook-type commit-msg  # Conventional Commits check
```

### Running the linter & formatter

```bash
# Check & auto-fix all files with ruff
ruff check --fix .

# Format all files with ruff
ruff format .

# Or run all pre-commit hooks manually at once
pre-commit run --all-files
```

### Type checking

```bash
mypy robo_market_search/
```

### Running tests

```bash
pytest
```

> [!NOTE]
> Some integration tests may be skipped in CI because the target marketplaces
> may block GitHub Actions IP ranges. Contributions that add better mock-based
> tests are especially welcome.

---

## Commit Message Convention

This project uses **[Conventional Commits](https://www.conventionalcommits.org/)**
to drive automated versioning and changelog generation via
[release-please](https://github.com/googleapis/release-please).

### Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Version bump | When to use                                            |
| ---------- | ------------ | ------------------------------------------------------ |
| `feat`     | minor        | A new feature visible to end users                     |
| `fix`      | patch        | A bug fix                                              |
| `perf`     | patch        | A performance improvement                              |
| `refactor` | –            | Code change that is neither a feature nor a bug fix    |
| `docs`     | –            | Documentation only                                     |
| `test`     | –            | Adding or updating tests                               |
| `build`    | –            | Build system or dependency changes                     |
| `ci`       | –            | CI/CD configuration changes                            |
| `chore`    | –            | Other changes that don't affect the package itself     |
| `revert`   | patch        | Reverts a previous commit                              |

### Breaking changes

Append `!` after the type/scope **or** add a `BREAKING CHANGE:` footer to
trigger a **major** version bump:

```
feat!: drop Python 3.7 support

BREAKING CHANGE: minimum required Python version is now 3.8
```

### Examples

```
feat(cli): add --json output flag
fix(robotistan): handle empty search result gracefully
docs: update MCP configuration example for Claude Desktop
chore(deps): bump curl_cffi from 0.5.10 to 0.6.0
```

---

## Code Style

This project uses **[Ruff](https://docs.astral.sh/ruff/)** for both linting and formatting, and **[Mypy](https://mypy.readthedocs.io/)** for static type checking. All settings live in `pyproject.toml`.

- Maximum line length: **127 characters**
- Quote style: **double quotes**
- Import order: `stdlib → third-party → first-party` (enforced by ruff/isort)
- Type hints: **required** in `shared/` and `unified/` modules; encouraged everywhere
- Docstrings: **Google style**

The pre-commit hooks run all checks automatically on every `git commit`. CI also runs the same hooks, so a passing pre-commit guarantees a passing CI lint job.

---

## Project Structure

```
robo_market_search/
├── __init__.py          # Public API surface
├── unified/             # UnifiedSearchClient
├── shared/              # Shared models (Product) and utilities
├── robolink/            # Robolink scraper client
├── robotistan/          # Robotistan scraper client
├── robo90/              # Robo90 scraper client
├── direncnet/           # Direnç.net scraper client
├── cli/                 # Typer-based CLI entry point
├── mcp/                 # MCP server
├── bot/                 # Telegram bot
└── agent/               # Agent utilities
```

---

## Release Process

Releases are **fully automated** via
[release-please](https://github.com/googleapis/release-please).

1. Commits merged to `main` are analysed for Conventional Commit types.
2. `release-please` opens (or updates) a **Release PR** that bumps the version
   in `pyproject.toml` and updates `CHANGELOG.md`.
3. When that PR is merged, a GitHub Release and tag are created automatically.
4. The `release-please.yml` workflow then builds and publishes the new version
   to [PyPI](https://pypi.org/project/robo-market-search/) via Trusted
   Publishing (OIDC).

**As a contributor, you do not need to worry about version numbers.** Just use
Conventional Commits and the tooling takes care of the rest.
