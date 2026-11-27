# Free Cloud Hosting Guide (`robo-api`)

`robo-api` runs on Python + FastAPI (with `curl_cffi` and Docker), so JS-only edge runtimes such as Cloudflare Workers cannot run it directly. When hosting outside local devices, use one of the free container/VM options below.

## Free Cloud Options (Excluding Local Devices)

| Option | Cost & Card | Cold Start | 24/7 Uptime | `bomTR` / `robo-api` Fit |
| :--- | :--- | :--- | :--- | :--- |
| **1. Oracle Cloud Always Free (Ampere A1)** | `$0` (card verification required) | `0 ms` | Continuous 24/7 | **Very High** — Full Linux VM (12–24 GB RAM), Docker + Nginx/Cloudflare Tunnel |
| **2. Hugging Face Spaces (Docker)** | Requires PRO (`cpu-basic` Docker Spaces no longer free) | `0 ms*` | — | **Paid only** — Static Spaces remain free; Docker Spaces require HF PRO |
| **3. Google Cloud Run (Free Tier)** | `$0` (within quota; card required) | `1–3 s` (`min-instances=0`) | Wakes on request | **Medium** — Generous free quota, small first-request delay |
| **4. Koyeb (Free Web Service)** | `$0` | Few seconds (after sleep) | Periodic sleep / limits | **Medium** — Fast GitHub deploy, secondary for 24/7 |
| **Render / Railway (Free)** | `$0` / trial credit | `30–50 s` (Render) | Sleeps / stops after credit | **Low** — Noticeable wait for live `bomTR` queries |

## Choosing & Setup Notes

1. **Oracle Cloud Always Free (Best overall):**
   - If you already have an Oracle Cloud Tenancy, check if you can provision an Always Free Ampere A1 VM with Docker + Nginx or Cloudflare Tunnel.
   - To prevent idle VM reclamation while staying within free limits, Pay-As-You-Go (PAYG) keeps Always Free resources active.
2. **Hugging Face Spaces (Best cardless option):**
   - Create a Docker Space using the repository `Dockerfile` (exposes port `8000` / `/health`), or use the minimal Space files below.
   - Ping `/health` (or `/api/v1/providers`) every 12 hours via UptimeRobot or GitHub Actions to prevent 48h idle sleep.

   **Space `README.md` (YAML frontmatter):**

   ```yaml
   ---
   title: Robo Market Search API
   sdk: docker
   app_port: 8000
   ---
   ```

   **Space `Dockerfile`:**

   ```dockerfile
   FROM python:3.12-slim
   RUN pip install --no-cache-dir "robo-market-search[api]"
   ENV HOST=0.0.0.0 PORT=8000
   EXPOSE 8000
   CMD ["robo-api"]
   ```

   > **Note:** `robo-api` reads `PORT` from the environment and sets `CORS_ORIGINS=["*"]` by default, so `bomTR` and browser clients can call `https://<user>-<space>.hf.space` directly.
3. **Koyeb (Free Web Service):**
   - Create a Web Service in Koyeb connected to `AtaCanYmc/robo-market-search` (`main` branch).
   - Builder: **Dockerfile** (uses root `Dockerfile`, port `8000`, health check `/health`).
   - Free tier gives 512 MB RAM / 0.1 vCPU and sleeps on idle (few seconds cold start).

4. **Shared Cloud Risk (Datacenter IP / WAF):**
   - All cloud providers use datacenter IPs, which some Turkish stores may challenge or block via Cloudflare/WAF.
   - After deploying, run a single search query and verify all 6 stores return results. If a store blocks the cloud IP, `bomTR` falls back to local `127.0.0.1` or offline `?q=` search tabs.
