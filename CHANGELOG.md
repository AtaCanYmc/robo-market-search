# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Starting from v1.0.1, this changelog is maintained automatically by
> [release-please](https://github.com/googleapis/release-please). Entries below
> this point were written manually.

---

## [1.3.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.2.0...v1.3.0) (2026-07-31)


### ✨ Features

* add configuration management for API keys in CLI, including set, show, and clear commands ([efefc2e](https://github.com/AtaCanYmc/robo-market-search/commit/efefc2eac54a6ee111b78114641e050b4331c4ce))
* add DeepSeekProvider and GroqProvider implementations, update README and tests ([9a50c20](https://github.com/AtaCanYmc/robo-market-search/commit/9a50c20282924730ea1449a17220c023a5590538))
* add initial project structure and core components for robo_market_agent ([b379518](https://github.com/AtaCanYmc/robo-market-search/commit/b3795188ae93b63547046305a7f005b1cc54bdb3))
* add Vercel serverless function entrypoint and configuration for routing ([4e4fb8a](https://github.com/AtaCanYmc/robo-market-search/commit/4e4fb8a36b6a95884992511e0e03d01efef22705))
* enhance CLI functionality and improve type casting in providers ([0a50f77](https://github.com/AtaCanYmc/robo-market-search/commit/0a50f771232653adfb0b43633a587c4912ba6f68))
* enhance type checking in pre-commit configuration and update CI workflow for improved testing ([a56d158](https://github.com/AtaCanYmc/robo-market-search/commit/a56d1589ee73bdc0060d0914323c0e93581cc69e))
* fix Python path for Vercel Serverless environment and update imports for demo module ([6404276](https://github.com/AtaCanYmc/robo-market-search/commit/64042762c05e2b1dfecf8e3e3119f31610ac1988))
* fix Python path for Vercel Serverless environment and update imports for demo module ([f4bb2a5](https://github.com/AtaCanYmc/robo-market-search/commit/f4bb2a520db00fee966c14ed615028c1725fd233))
* fix Python path for Vercel Serverless environment and update imports for demo module ([9c2dbc0](https://github.com/AtaCanYmc/robo-market-search/commit/9c2dbc09b730a6ec0732918b5c86edd5f2db8871))
* update .gitignore and add initial README files for project structure ([04778b3](https://github.com/AtaCanYmc/robo-market-search/commit/04778b3146b8dd29868048a6a98da61dae774d33))
* update dependencies to use latest versions and add new packages ([e2b4a5a](https://github.com/AtaCanYmc/robo-market-search/commit/e2b4a5a9f84b7d8ddadec7c8f9fb61b0a9e54fc7))
* update import alias for application and adjust Vercel configuration for routing ([3f99366](https://github.com/AtaCanYmc/robo-market-search/commit/3f99366c71aeaf7fbb6e8e71d15513d0376fc810))


### 🐛 Bug Fixes

* add missing newline at end of requirements.txt ([9b4c82d](https://github.com/AtaCanYmc/robo-market-search/commit/9b4c82d1532e2d643bedf3bc2ff23702674ee4a6))
* update robo-market-search dependency to remove version constraint ([2f7d7f1](https://github.com/AtaCanYmc/robo-market-search/commit/2f7d7f14853c4d465bf4f1e62b65f583422ff6bf))

## [1.2.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.1.0...v1.2.0) (2026-07-29)


### ✨ Features

* add favicon handling and Vercel serverless function entrypoint ([4a83617](https://github.com/AtaCanYmc/robo-market-search/commit/4a83617bf66ff262bd315e6d85fd5056de891da8))
* add favicon handling and Vercel serverless function entrypoint ([d814eeb](https://github.com/AtaCanYmc/robo-market-search/commit/d814eebd6701728a5fad4867ca84828aef79af0a))
* add Telegram notification integration for search logging in LogPort ([3bbea57](https://github.com/AtaCanYmc/robo-market-search/commit/3bbea57291c029d9f6c1314671184ee96d9e2dee))
* add Vercel Analytics script and define store color mappings in … ([0c25746](https://github.com/AtaCanYmc/robo-market-search/commit/0c25746500d301cb646556f63990e8cc2929ba88))
* add Vercel Analytics script and define store color mappings in views ([7f7525d](https://github.com/AtaCanYmc/robo-market-search/commit/7f7525d3cf901b353f732ee0df51642695a064fa))
* enhance caching mechanism and improve async logging in LogPort ([59baa57](https://github.com/AtaCanYmc/robo-market-search/commit/59baa57ff9f92543a1f7285065e2143b24738d9f))
* enhance caching mechanism and improve async logging in LogPort ([1b549a9](https://github.com/AtaCanYmc/robo-market-search/commit/1b549a934841f9163be96fcc48886b0c84dcf576))
* implement Logport integration for anonymous search analytics logging ([4789d53](https://github.com/AtaCanYmc/robo-market-search/commit/4789d53b3365014a90051cadaabdf882d7070a2a))

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
