# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Starting from v1.0.1, this changelog is maintained automatically by
> [release-please](https://github.com/googleapis/release-please). Entries below
> this point were written manually.

---

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
