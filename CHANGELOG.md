# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Starting from v1.0.1, this changelog is maintained automatically by
> [release-please](https://github.com/googleapis/release-please). Entries below
> this point were written manually.

---

## [1.1.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.0.1...v1.1.0) (2026-07-28)


### ✨ Features

* add cart search example and optimize shipping cost calculation for multiple items ([7edf341](https://github.com/AtaCanYmc/robo-market-search/commit/7edf3411eb146a1e947e18418f90e5eee497de72))
* add cart search with shipping & CSV support ([8859836](https://github.com/AtaCanYmc/robo-market-search/commit/885983663f1fe6fd318564dc00ccd94a5af3b9f7))
* add CSV and JSON export functionality for search results ([6c90b5f](https://github.com/AtaCanYmc/robo-market-search/commit/6c90b5f0911e572eaa1ec725328b657e0ad23c9f))
* add initial web demo with FastAPI, Jinja2, and HTMX ([e9b3831](https://github.com/AtaCanYmc/robo-market-search/commit/e9b383161703927b937e15703a22667c7c082b68))
* add pre-commit configuration and update contributing guidelines ([03f5c0b](https://github.com/AtaCanYmc/robo-market-search/commit/03f5c0bc5a8a450de5f37724234b5b652d0a85af))
* add product image display with fallback handling in results.html ([83e47e9](https://github.com/AtaCanYmc/robo-market-search/commit/83e47e953eba2b220781775d78ce2cba9149bf5c))
* add release-please configuration and templates for contributing, bug reporting, and feature requests ([de4f658](https://github.com/AtaCanYmc/robo-market-search/commit/de4f658e4ef5a7ca37c48c02620b3057aa67c7c9))
* add release-please configuration and templates for contributing… ([e0a5a37](https://github.com/AtaCanYmc/robo-market-search/commit/e0a5a3759caff7bcdee696f7c0e44f159e1f25e6))
* add Vercel deployment instructions and configuration ([c445371](https://github.com/AtaCanYmc/robo-market-search/commit/c4453716a9f1519ed6fa9c4c26e5817e480de5d1))
* cart search with shipping costs, split optimization, and CSV input (Sha-Dox) ([35afe57](https://github.com/AtaCanYmc/robo-market-search/commit/35afe57e22879c4aeeeea2a44da54592b0471e9a))
* enhance search functionality with filtering and pagination options ([b8f0eea](https://github.com/AtaCanYmc/robo-market-search/commit/b8f0eea17a97deccd6b8a2a60e0592a7aa80697f))
* implement export endpoints for JSON and CSV data downloads, add health check and SEO metadata routes ([e84ec26](https://github.com/AtaCanYmc/robo-market-search/commit/e84ec2620a99b83185c7a19444f0962781877d1f))
* implement SQLite and memory-backed TTL caching for search results ([cdd7bda](https://github.com/AtaCanYmc/robo-market-search/commit/cdd7bdaaf63eafeefdc413b5905a347fe460b067))
* integrate UnifiedSearchClient for improved search functionality ([38641e2](https://github.com/AtaCanYmc/robo-market-search/commit/38641e2240eec0d48723eb7f30a850c2f1ad431c))
* refactor code for improved readability and maintainability ([1792507](https://github.com/AtaCanYmc/robo-market-search/commit/17925073db83d67c7cd7168c3538f3bd15b1a0a0))
* update optional dependencies to conditionally include mcp for Python 3.10+ ([2fe2f0f](https://github.com/AtaCanYmc/robo-market-search/commit/2fe2f0feba0139866dfd2c869b848e8d75cc2d4d))


### 🐛 Bug Fixes

* correct URL formatting by adding missing slashes ([57cd38d](https://github.com/AtaCanYmc/robo-market-search/commit/57cd38db0a399bb75b38bad3c843d22a797b3dae))


### 📚 Documentation

* update LICENSE ([d87d047](https://github.com/AtaCanYmc/robo-market-search/commit/d87d047e3d73c0a452ec0885f9943f9356c9597d))


### ♻️  Code Refactoring

* update type hints for better clarity and consistency ([cb29e0d](https://github.com/AtaCanYmc/robo-market-search/commit/cb29e0d964a0c15af6e0b0a6b44765159513e75f))

## [1.0.1] - 2025-07-01

### 🐛 Bug Fixes

- Fixed token refresh logic for Robo90 scraper
- Improved error handling for empty search results

## [1.0.0] - 2025-06-15

### ✨ Features

- Initial stable release
- `UnifiedSearchClient` for parallel search across all four marketplaces
- Individual clients: `RobotistanClient`, `RobolinkClient`, `Robo90Client`, `DirencnetClient`
- CLI entry point (`robo-search`) powered by Typer and Rich
- MCP server (`robo-mcp`) for LLM / Claude Desktop integration
- Telegram bot (`robo-bot`) powered by aiogram
- Dynamic token scraping for marketplaces that rotate API tokens
- Standardised `Product` dataclass returned by all clients

[1.0.1]: https://github.com/AtaCanYmc/robo-market-search/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AtaCanYmc/robo-market-search/releases/tag/v1.0.0
