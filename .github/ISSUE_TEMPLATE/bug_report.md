---
name: 🐛 Bug Report
about: Report a bug to help us improve robo-market-search
title: "fix: <short description of the bug>"
labels: ["bug", "triage"]
assignees: []
---

## Bug Description

<!-- A clear and concise description of what the bug is. -->

## Steps to Reproduce

```python
# Minimal reproducible example
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()
products = client.search("arduino")
```

1.
2.
3.

## Expected Behaviour

<!-- What did you expect to happen? -->

## Actual Behaviour

<!-- What actually happened? Paste the full error/stack trace below. -->

```
<error output here>
```

## Environment

| Field             | Value                                 |
|-------------------|---------------------------------------|
| OS                | <!-- e.g. macOS 14.5 / Ubuntu 24.04 -->|
| Python version    | <!-- e.g. 3.11.9 -->                  |
| Package version   | <!-- run: pip show robo-market-search -->|
| Install extras    | <!-- e.g. [all], [cli], [mcp] -->     |

## Additional Context

<!-- Anything else that might be helpful (logs, screenshots, etc.) -->

---

> [!IMPORTANT]
> For **security vulnerabilities**, please follow our [Security Policy](../../SECURITY.md)
> and contact us privately instead of opening a public issue.
