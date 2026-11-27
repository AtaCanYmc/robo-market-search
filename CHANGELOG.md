# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Starting from v1.0.1, this changelog is maintained automatically by
> [release-please](https://github.com/googleapis/release-please). Entries below
> this point were written manually.

---

## [1.13.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.12.0...v1.13.0) (2026-11-27)


### ✨ Features

* add Bruno API collection and Makefile targets ([51958a0](https://github.com/AtaCanYmc/robo-market-search/commit/51958a07ff52a3527450d2d67df613e89640f795))
* circuit breaker, per-source TTL, optional Redis cache, fallback headers ([b99826c](https://github.com/AtaCanYmc/robo-market-search/commit/b99826c2832ea3cb07b7c090d3456ad49050183d))
* **website:** add desktop app download section ([1f45864](https://github.com/AtaCanYmc/robo-market-search/commit/1f45864332e9a69c9764792e193c063143f6e631))
* **website:** add Homebrew install card ([cddb8bc](https://github.com/AtaCanYmc/robo-market-search/commit/cddb8bcc3611f075fa5e119d2c8fbe70eb71e34d))
* **website:** replace landing page with showcase design ([2bc86a2](https://github.com/AtaCanYmc/robo-market-search/commit/2bc86a2a9a1ec99ec3e9d2532a763e2e838ec321))


### 🐛 Bug Fixes

* **ci:** split pages build and deploy into separate jobs ([4372413](https://github.com/AtaCanYmc/robo-market-search/commit/437241363c7e768f497c2591243c166d23a42859))
* **website:** label demo as sample data, drop unmeasured timings ([19423bc](https://github.com/AtaCanYmc/robo-market-search/commit/19423bc09508077891ab0c7c1cb443a46c7fa4cd))


### 📚 Documentation

* add bom-sourcing skill and bomTR extension ([dbde930](https://github.com/AtaCanYmc/robo-market-search/commit/dbde9309e2364d3259608245ff252b7a11fb22d3))
* add split-cart promo visual to README cart_search section ([a8b37e0](https://github.com/AtaCanYmc/robo-market-search/commit/a8b37e0d736651a6338ec6d8fafc8be2fdc9a582))
* document cache, resilience, Bruno collection ([f59de40](https://github.com/AtaCanYmc/robo-market-search/commit/f59de401872731eab33966d67ad182eaef6feb44))
* update README with additional badges for PyPI downloads and Homebrew tap ([bfe74b0](https://github.com/AtaCanYmc/robo-market-search/commit/bfe74b04f015cf53d21933b932bcbc3da68930e9))
* update roadmap for v1.12.0 ([782b175](https://github.com/AtaCanYmc/robo-market-search/commit/782b175e556e41ad057c2357e78bed6d814f4969))
* upgrade architecture and MCP sequence diagrams to branded SVGs ([d3a9469](https://github.com/AtaCanYmc/robo-market-search/commit/d3a94698de861a924f59a988d4d27833111ca0cd))
* upgrade README and docs with YouTube demo and ignore brag outputs ([e2b62b5](https://github.com/AtaCanYmc/robo-market-search/commit/e2b62b597dac0da6b6cf26efb73dfa066c0310db))
* use uploaded promo visuals for YouTube demo in README and getting-started ([8a844c2](https://github.com/AtaCanYmc/robo-market-search/commit/8a844c2a83f213f42ae24fcd749396e47bb0f9d2))

## [1.12.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.11.1...v1.12.0) (2026-11-16)


### ✨ Features

* **release:** align all desktop assets and links to v1.11.1 with sync workflow ([b54a706](https://github.com/AtaCanYmc/robo-market-search/commit/b54a706c74935bf8ce19bf62bbea5710a59eb545))


### 🐛 Bug Fixes

* **desktop:** resolve sidecar path matching and handle stdout/stderr receiver ([25d3adc](https://github.com/AtaCanYmc/robo-market-search/commit/25d3adc44e5d82ed05d75b99440cce31ad777d89))
* **sidecar:** use ascii output and force utf8 encoding for windows runners ([3648d80](https://github.com/AtaCanYmc/robo-market-search/commit/3648d80c4656ce18bead66fcaf3d02f1af74ce22))
* **website:** point static download links directly to release binary assets ([f94d7a6](https://github.com/AtaCanYmc/robo-market-search/commit/f94d7a66be2c6e7f8a82be79deaee8df62754f0a))
* **website:** resolve newest release containing compiled desktop assets ([267cb29](https://github.com/AtaCanYmc/robo-market-search/commit/267cb29bd309fcd31a43e5fd97832173b1cfebf7))


### 📚 Documentation

* **website:** add gatekeeper quarantine bypass hint for macos app ([33260d3](https://github.com/AtaCanYmc/robo-market-search/commit/33260d3ba29eacb0a5664e5b3e5cdec96676edcf))

## [1.11.1](https://github.com/AtaCanYmc/robo-market-search/compare/v1.11.0...v1.11.1) (2026-11-16)


### 🐛 Bug Fixes

* **desktop-ci:** unignore and add app icons, fix windows sidecar deps, and add linux tools ([e7af351](https://github.com/AtaCanYmc/robo-market-search/commit/e7af3515066b472209c57a5a1880bbe7435cd41f))
* **downloads:** wire dynamic release asset downloads and add tag input to desktop build dispatch ([1630182](https://github.com/AtaCanYmc/robo-market-search/commit/163018251dab5d62e6558020ee02b01a46389133))

## [1.11.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.10.0...v1.11.0) (2026-11-16)


### ✨ Features

* **cli:** enhance terminal ui/ux and add homebrew tap support ([90ea1c1](https://github.com/AtaCanYmc/robo-market-search/commit/90ea1c15c3381344d11de0685b694d937dc8e7e0))
* **desktop:** add Tauri v2 desktop app, antislop UI/UX polish, and fix scraper typing ([3c757ef](https://github.com/AtaCanYmc/robo-market-search/commit/3c757ef7fba0b6586ded7642de4a433d61776aa4))
* **desktop:** finalize macOS bundle build, icons, sidecar spawning, and verify desktop app ([d16d5bf](https://github.com/AtaCanYmc/robo-market-search/commit/d16d5bffdadccc088514f2edac1101e12ef97213))
* **release:** configure dynamic versioning and multi-target release-please ([cedd06f](https://github.com/AtaCanYmc/robo-market-search/commit/cedd06fa27a65a4e3f5e415aabc9d9293edafbb2))
* **scrapers:** implement OzdisanClient and MotorobitClient integrations ([3016fdc](https://github.com/AtaCanYmc/robo-market-search/commit/3016fdc41a37a59c062cb52cf2bca897075d2824))
* **ui:** redesign app as a native-grade desktop application ([61022a6](https://github.com/AtaCanYmc/robo-market-search/commit/61022a656266d23e8183d80bcc2be5f0a9bc9f21))
* **website:** create landing page and download hub for GitHub Pages deployment ([904d740](https://github.com/AtaCanYmc/robo-market-search/commit/904d740ed32de6530aed6a2da3bc255630cc2013))


### 🐛 Bug Fixes

* **build:** add build to dev dependencies and support uv build in Makefile ([0d69ee7](https://github.com/AtaCanYmc/robo-market-search/commit/0d69ee782c3e6ddb8516d18234bf534fd2679385))
* **ci:** align lint Python with pre-commit ([e1d93d3](https://github.com/AtaCanYmc/robo-market-search/commit/e1d93d34b3a3ed94a728f20658d2a9ecbb853a0e))
* **scrapers:** rewrite DirencnetClient with native JSON API and resilient DOM fallback ([b171c33](https://github.com/AtaCanYmc/robo-market-search/commit/b171c338cdf6660a17a687070e6dba6ecf20787a))


### 📚 Documentation

* audit and update documentation to reflect desktop app, 6 stores, and package layout ([76f104b](https://github.com/AtaCanYmc/robo-market-search/commit/76f104ba72822672497dc7c5ba1c19b98c7890a8))
* **cli:** overhaul CLI guide, update commands, and enable smart routing across tools ([ab08403](https://github.com/AtaCanYmc/robo-market-search/commit/ab08403394b47865b46d9b628503d0e994ce0422))
* **roadmap:** create root ROADMAP.md and modernize docs/roadmap.md ([a67746f](https://github.com/AtaCanYmc/robo-market-search/commit/a67746f8be180d6eca0bd5b62e9064693a6e36c5))


### ♻️  Code Refactoring

* **architecture:** rename demo to app and clean up legacy demo files ([4fc4d9e](https://github.com/AtaCanYmc/robo-market-search/commit/4fc4d9ee7648af24ca0451a6d09ab47b345b5ca8))
* **structure:** migrate to standard src layout and resolve hidden typing bugs ([a2d9514](https://github.com/AtaCanYmc/robo-market-search/commit/a2d9514b85fb7cbd5354726f8960bddc3a15a142))

## [1.10.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.9.0...v1.10.0) (2026-11-15)


### ✨ Features

* **theme:** modernize scrollbar standards and synchronize color-scheme meta with fouc prevention ([db1c1ec](https://github.com/AtaCanYmc/robo-market-search/commit/db1c1ecc20d2a05b84e24acdb425c214e6da6a81))


### 🐛 Bug Fixes

* **ci:** bump mypy target python_version to 3.10 to support pydantic pattern matching ([e04e73b](https://github.com/AtaCanYmc/robo-market-search/commit/e04e73b963bc628adc8a37ec44f32fe534459aaf))
* **security:** resolve frontend npm vulnerabilities, harden cors policy, and update dependabot coverage ([a1edd90](https://github.com/AtaCanYmc/robo-market-search/commit/a1edd90e92164f096a3e0c2b9efa7add16d81b0b))


### ♻️  Code Refactoring

* **ui:** apply antislop standards across accessibility, keyboard controls, and typography ([1ff46c6](https://github.com/AtaCanYmc/robo-market-search/commit/1ff46c6773edfcfb76f5a70dfc47151be01550c9))

## [1.9.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.8.2...v1.9.0) (2026-09-06)


### ✨ Features

* add server status modal and health check functionality to MainContent ([6561641](https://github.com/AtaCanYmc/robo-market-search/commit/6561641dfb340caff21172eb7dbab428aff58c3d))
* enhance AI agent with OpenAI connection schema support and configurable parameters ([ec74aa9](https://github.com/AtaCanYmc/robo-market-search/commit/ec74aa9c7dab43a3e22b22f9f04da0657e6848b1))
* **health_check:** enhance health check script to test multiple items and provide detailed diagnostics ([976dae7](https://github.com/AtaCanYmc/robo-market-search/commit/976dae74d74dccacd98acdb608ce3edc8e5ed55c))
* update README with new banner image and layout adjustments ([3f619b7](https://github.com/AtaCanYmc/robo-market-search/commit/3f619b7df05116cad8186a8158ae299d56b102cd))


### 🐛 Bug Fixes

* **scrapers:** refine Direncnet headers, add catalog fallback, and enhance health check failure diagnostics ([a6c39e3](https://github.com/AtaCanYmc/robo-market-search/commit/a6c39e3709937bd549ca8a235be099c3cf281b60))
* **scrapers:** url-encode Direncnet Referer header and add out-of-stock fallback in Robo90 ([ae745b1](https://github.com/AtaCanYmc/robo-market-search/commit/ae745b1b193f9c6e679613a082f5357937433c7c))


### 📚 Documentation

* update documentation to include Makefile commands for setup and testing ([6ca964e](https://github.com/AtaCanYmc/robo-market-search/commit/6ca964ebcefe9430fc28ecb373fc570516208108))

## [1.8.2](https://github.com/AtaCanYmc/robo-market-search/compare/v1.8.1...v1.8.2) (2026-08-24)


### 🐛 Bug Fixes

* refactor header update in client.py for improved readability ([3a07459](https://github.com/AtaCanYmc/robo-market-search/commit/3a07459a7d15d74c65ad8adf7aa02d37334fc569))
* update client.py to improve request handling and add fallback strategy for product search ([9503695](https://github.com/AtaCanYmc/robo-market-search/commit/9503695577b2847a79cb7ae6949370fbdf73050d))

## [1.8.1](https://github.com/AtaCanYmc/robo-market-search/compare/v1.8.0...v1.8.1) (2026-08-24)


### 🐛 Bug Fixes

* update headers in client.py for improved request handling ([ecae8fa](https://github.com/AtaCanYmc/robo-market-search/commit/ecae8fa2ff180178e8837e32cb630301e58095bf))

## [1.8.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.7.0...v1.8.0) (2026-08-24)


### ✨ Features

* implement theme context and toggle functionality for dark/light mode ([f761851](https://github.com/AtaCanYmc/robo-market-search/commit/f7618517b5fb700404674f7f72c7c6a23c78827a))
* update version to 1.8.0 and enhance UI components in Navbar ([9b055c5](https://github.com/AtaCanYmc/robo-market-search/commit/9b055c5265ad2e7aa2123ffae597609fd2084250))

## [1.7.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.6.0...v1.7.0) (2026-08-24)


### ✨ Features

* add favicon and web app manifest for improved branding and mobile support ([cd8f84c](https://github.com/AtaCanYmc/robo-market-search/commit/cd8f84c7152fbacec4f833d4928390da00e5bc09))
* enhance JSON parsing and stock availability checks in client.py ([c3e7b80](https://github.com/AtaCanYmc/robo-market-search/commit/c3e7b80fde975a17ecb12a763cc8d18fd6028313))
* enhance UI components and improve accessibility in various files ([21e8bdb](https://github.com/AtaCanYmc/robo-market-search/commit/21e8bdbf5a6e1d8e193d42618af2c3ded47200d4))


### 🐛 Bug Fixes

* add missing newline at end of site.webmanifest ([4d7bef3](https://github.com/AtaCanYmc/robo-market-search/commit/4d7bef32946f65bb34292622d8b3a59750b0b4e4))
* improve condition for product limit check in client.py ([a12052c](https://github.com/AtaCanYmc/robo-market-search/commit/a12052c5fe6677ff16a08b8b5f49a081cf9926d9))

## [1.6.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.5.0...v1.6.0) (2026-08-01)


### ✨ Features

* implement BaseStore interface and custom exceptions for store providers ([8b3442f](https://github.com/AtaCanYmc/robo-market-search/commit/8b3442f83627d963db1601324b150ade0f5bcf97))


### ♻️  Code Refactoring

* enhance type hints for callback functions and improve code readability ([1fff8c4](https://github.com/AtaCanYmc/robo-market-search/commit/1fff8c4a22f910baca24ba9f803d58c0f71048e8))

## [1.5.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.4.0...v1.5.0) (2026-07-31)


### ✨ Features

* **cart:** update default free shipping threshold to 1500 TL ([d0e2972](https://github.com/AtaCanYmc/robo-market-search/commit/d0e2972faad096d53c0fbc8d48d12d0a30d577b0))
* enhance AgentTab with structured visual results and new response handling ([47941dc](https://github.com/AtaCanYmc/robo-market-search/commit/47941dc3f7abdb77ede0d87d9d5e867547992307))
* implement prompt loading utilities with safe fallback defaults ([bbc35c1](https://github.com/AtaCanYmc/robo-market-search/commit/bbc35c17c6ef4706e0260ba0fe874ca2d3a8b53a))


### 🐛 Bug Fixes

* **deps:** include groq, openai, anthropic, google-generativeai, ollama SDKs ([7d2b368](https://github.com/AtaCanYmc/robo-market-search/commit/7d2b3683e177404d8d9f88fd5cd7fff4382c585a))
* **docker:** invalidate pip cache and include MANIFEST.in in Docker builds ([e76db13](https://github.com/AtaCanYmc/robo-market-search/commit/e76db13da1438ab9aa87d70ef871f9af5d77078e))
* **providers:** remove unnecessary blank line in response handling ([f15a513](https://github.com/AtaCanYmc/robo-market-search/commit/f15a513d08f775a79e0d1c18c1244b8437fb21de))


### 📚 Documentation

* add enterprise-grade documentation suite (architecture, sdk, cli, mcp, api, providers, adrs) ([9ab83d2](https://github.com/AtaCanYmc/robo-market-search/commit/9ab83d2f0549ff8bb19f90c7dc3d429284ea1192))
* embed screenshots in readmes and documentation pages ([036cd5a](https://github.com/AtaCanYmc/robo-market-search/commit/036cd5a19bc3827f30d0c64a571351c0fdcd9641))
* remove outdated web demo section from README ([585a659](https://github.com/AtaCanYmc/robo-market-search/commit/585a6593a9879d54906bf962ddc8a010554dbeb3))
* remove outdated web demo section from README ([1d79fd1](https://github.com/AtaCanYmc/robo-market-search/commit/1d79fd1a2ac56a73e85295f2a32a407accf792b4))

## [1.4.0](https://github.com/AtaCanYmc/robo-market-search/compare/v1.3.0...v1.4.0) (2026-07-31)


### ✨ Features

* add Bring Your Own API Key (BYOK) support to AI Hardware Agent endpoints ([f44cbdc](https://github.com/AtaCanYmc/robo-market-search/commit/f44cbdcc1e6e6a9431d1a5d1775ef35d8cc99988))
* add cart optimization functionality with CLI support ([5a46ea1](https://github.com/AtaCanYmc/robo-market-search/commit/5a46ea16f827ccecac9ecf53f474e8206dea902b))
* add customizable shipping thresholds and settings to CartOptimizerTab ([d9a18ca](https://github.com/AtaCanYmc/robo-market-search/commit/d9a18cab0712a4a62f19bc0ee7cda2a1f6978f20))
* add export functionality for product search results in various formats ([1b3917d](https://github.com/AtaCanYmc/robo-market-search/commit/1b3917d615da0b951bb0c7416cb602da09ea16a0))
* add frontend components, API integration, and Docker setup for Robo Market Search ([bdec6f6](https://github.com/AtaCanYmc/robo-market-search/commit/bdec6f671b884f5059b273c261368c5521d3b8f6))
* add installation script and binary release workflow for easier deployment ([40213c9](https://github.com/AtaCanYmc/robo-market-search/commit/40213c946dfac56aacde7457a656734666728432))
* add requirements file with dependencies for FastAPI project ([4038cd7](https://github.com/AtaCanYmc/robo-market-search/commit/4038cd76d0e3d24e081b8e4ed37e7a3c19a4d85e))
* enhance API configuration for production and add Docker support ([1d03bdd](https://github.com/AtaCanYmc/robo-market-search/commit/1d03bdda80d33d7b09c67475a5acb9a7d9a63024))
* enhance ProductCard component with image URL normalization and error handling ([69c88de](https://github.com/AtaCanYmc/robo-market-search/commit/69c88de351ecbbcb54636b9ef8e9de7737590017))
* implement API endpoints and services for product search, cart optimization, and AI agent integration ([5a2e949](https://github.com/AtaCanYmc/robo-market-search/commit/5a2e9495920dac180912a5448dd0a4189aadb81c))
* normalize product names in API response and ProductCard component ([2585681](https://github.com/AtaCanYmc/robo-market-search/commit/2585681f1dfb58f8bb7676ac15d00a1f1e63b34f))
* update Dockerfile for streamlined dependency installation and entry point adjustment ([830548a](https://github.com/AtaCanYmc/robo-market-search/commit/830548a64c8f4e6bfbf0065fc1da5e9733bd9950))
* update installation commands for robo-market-search and add PostCSS configuration ([209ad7e](https://github.com/AtaCanYmc/robo-market-search/commit/209ad7edfb6c68d61ed113937a51388ca2eba5b1))
* update README and add configuration files for Vercel and Render deployment ([7280328](https://github.com/AtaCanYmc/robo-market-search/commit/72803283aacda9bad5380929bea65400041a4a22))
* update README to include BYOK support and enhance frontend features ([7690b08](https://github.com/AtaCanYmc/robo-market-search/commit/7690b08a2dc83acb6534af65b279cbcdf9593621))


### 🐛 Bug Fixes

* add local package reference to root requirements.txt for Vercel deployment ([960b085](https://github.com/AtaCanYmc/robo-market-search/commit/960b08533530a3c618dd30a3585512e379ecca85))
* enforce @vercel/python builder in vercel.json to trigger pip install requirements.txt ([4e375c5](https://github.com/AtaCanYmc/robo-market-search/commit/4e375c540087de6c67075200a056d7aa727f75f8))
* remove legacy builds array to eliminate Vercel CLI warning ([07ff7dc](https://github.com/AtaCanYmc/robo-market-search/commit/07ff7dc1c6e18e462226b5fff763e9a4042fb12b))

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
