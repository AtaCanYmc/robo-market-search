# Bruno Collection

[Root](../README.md)

Endpoint requests and assertions for the REST API in `src/robo_market_api`.

## Run

Start the API (default `http://localhost:8000`), then open this folder in [Bruno](https://www.usebruno.com/) or use the CLI:

```bash
npm install -g @usebruno/cli
cd bruno
bru run --env local
```

Run one folder, or skip tests that call live stores:

```bash
bru run Health --env local
bru run Agent --env local
```

## Environments

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:8000` | API origin |
| `apiPrefix` | `/api/v1` | Matches `API_V1_PREFIX` |
| `apiKey` | secret, unset | LLM key sent as `Authorization: Bearer`. Unused with `provider: "mock"` |

Set the secret in Bruno's environment editor. Never commit real keys.

## Requests

| Folder | Method and path | Asserts |
| :--- | :--- | :--- |
| Health | `GET /health` | 200, `status` is `ok` |
| Search | `POST /api/v1/search` | 200 and 422 (empty query, `limit` over 100) |
| Search | `POST /api/v1/search/batch` | 200 and 422 (empty `queries`) |
| Providers | `GET /api/v1/providers/` | 200, non-empty list |
| Providers | `POST /api/v1/providers/{provider}` | 200, 400 for unknown store |
| Optimize | `POST /api/v1/optimize` | 200 and 422 (empty `items`) |
| Agent | `POST /api/v1/agent/analyze` | 200 with mock provider, 422 for short prompt |
| Agent | `POST /api/v1/agent/bom` | 200 with mock provider |
| Agent | `POST /api/v1/agent/search` | 200 |
| Agent | `POST /api/v1/agent/optimize` | 200 |

Search, Providers, Optimize and Agent search calls query live Turkish stores and need network access.
