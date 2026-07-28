# Security Policy

## Supported Versions

The following table shows which versions of **robo-market-search** are currently
receiving security fixes.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Active support  |
| < 1.0   | ❌ End of life     |

We only backport security fixes to the **latest stable minor release** on the
`1.x` line. We strongly encourage all users to keep their installations up to
date.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

If you believe you've found a security vulnerability in this project, please
disclose it **privately** by sending an e-mail to:

> **atacanymc@gmail.com**

### What to include in your report

To help us triage your report quickly, please provide as much of the following
information as possible:

- A clear description of the vulnerability and its potential impact.
- The version(s) of `robo-market-search` affected.
- Step-by-step instructions to reproduce the issue (a minimal proof-of-concept
  script is ideal).
- Any relevant log output or error messages.
- Suggested remediation or mitigations, if you have them.

### Response SLA

| Stage                         | Target Time     |
| ----------------------------- | --------------- |
| Initial acknowledgement       | ≤ 48 hours      |
| Triage & severity assessment  | ≤ 5 business days |
| Fix development (for Critical/High) | ≤ 14 days |
| Fix development (for Medium/Low)    | ≤ 30 days |
| Public disclosure             | After fix release |

We follow [responsible disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure):
we will coordinate a public disclosure date with you once a fix is ready.

---

## Disclosure Policy

- We will open a [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories)
  and request a CVE identifier for any confirmed vulnerability of Critical or
  High severity.
- Reporters who follow responsible disclosure guidelines may be credited in the
  advisory and in the release notes (upon request).

---

## Scope

### In scope

- The `robo-market-search` Python library itself
  (`robo_market_search/` package and its entry points).
- The MCP server (`robo-mcp`), CLI (`robo-search`), and Telegram bot
  (`robo-bot`) bundled with the package.
- Dependency versions pinned in `pyproject.toml` that contain known
  vulnerabilities.

### Out of scope

- Vulnerabilities in the **third-party marketplaces** (Robolink, Robotistan,
  Robo90, Direnç.net) that this library queries. Please report those directly
  to the respective companies.
- Issues solely caused by users running an unsupported or EOL Python version.
- Denial-of-service attacks that require valid credentials or physical access.

---

## Preferred Languages

We accept vulnerability reports in **English** or **Turkish**.

---

## Hall of Thanks

We sincerely thank the following researchers for responsibly reporting
vulnerabilities:

_No entries yet — be the first!_
