# Robo Market Search — Demo & Applications

Bu dizin, `robo-market-search` ekosisteminin demo uygulamalarını barındırır. İki bağımsız katmana ayrılmıştır:

- **`frontend/`**: FastAPI + Jinja2 + HTMX tabanlı Web Demo Arayüzü (Port `3000`).
- **`backend/`**: Production-ready `robo_market_api` REST Sunucusu (Port `8000`).

---

## 🚀 Çalıştırma

### Yöntem 1: Docker Compose (Önerilen)

Tüm sistemi (Frontend + Backend) tek bir komutla ayağa kaldırabilirsiniz:

```bash
cd demo/
docker compose up -d
```

- **Web Demo Arayüzü**: [http://localhost:3000](http://localhost:3000)
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
uvicorn main:app --port 3000 --reload
```
*(Arayüz http://localhost:3000 üzerinde çalışacaktır)*
