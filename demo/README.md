# Robo Market Search — Demo & Applications

Bu dizin, `robo-market-search` ekosisteminin demo uygulamalarını barındırır. İki bağımsız katmana ayrılmıştır:

- **`frontend/`**: Vite + React + TypeScript + Tailwind CSS tabanlı Web Önyüzü (Port `3000`).
- **`backend/`**: Production-ready `robo_market_api` REST Sunucusu (Port `8000`).

---

## 🚀 Yerel Çalıştırma

### Yöntem 1: Docker Compose (Önerilen)

Tüm sistemi (Frontend + Backend) tek bir komutla ayağa kaldırabilirsiniz:

```bash
cd demo/
docker compose up -d
```

- **Web Önyüzü**: [http://localhost:3000](http://localhost:3000)
- **REST API Sunucusu & Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Yöntem 2: Bağımsız Çalıştırma (Lokal)

#### 🔹 Backend REST API'yi Başlatma
```bash
cd demo/backend/
python main.py
```
*(Sunucu http://localhost:8000 üzerinde çalışacaktır)*

#### 🔹 Frontend Web UI'ı Başlatma
```bash
cd demo/frontend/
npm run dev
```
*(Arayüz http://localhost:3000 üzerinde çalışacaktır)*

---

## 🌐 Canlıya Dağıtım (Cloud Deployment)

### 1. Frontend (Vercel)
Vite önyüzü `demo/frontend/vercel.json` yapılandırması ile Vercel üzerinde tek tıkla canlıya alınabilir:
- Root Directory: `demo/frontend`
- Framework Preset: `Vite`
- Output Directory: `dist`
- API Proxy: `/api/v1/*` istekleri Render üzerindeki backend'e otomatik yönlendirilir.

### 2. Backend (Render)
FastAPI REST API `render.yaml` yapılandırması ile Render üzerinde Web Service olarak yayınlanır:
- Environment: `Python 3.11`
- Build Command: `pip install -e ".[all]"`
- Start Command: `uvicorn robo_market_api.app.main:app --host 0.0.0.0 --port $PORT`
- Healthcheck Endpoint: `/health`
