[← Ana Depoya Dön](../../README.md)

# `robo_market_api`: REST API Servis Katmanı

`robo_market_api`, FastAPI tabanlı yüksek performanslı bir HTTP servisidir. `robo_market_search`, `robo_market_service` ve `robo_market_agent` katmanlarını dış istemciler (web, masaüstü uygulaması, üçüncü parti entegrasyonlar) için standart REST API uç noktaları olarak sunar.

---

## Özellikler

- **FastAPI Altyapısı**: Asenkron istek işleme, otomatik OpenAPI/Swagger (`/docs`) ve ReDoc (`/redoc`) dokümantasyonu.
- **BYOK (Bring Your Own API Key)**: Kullanıcıların kendi OpenAI, Anthropic, Gemini, DeepSeek veya Groq anahtarlarını HTTP başlıkları (`X-API-Key`, `X-OpenAI-API-Key`, vb.) veya istek gövdesi üzerinden iletmesine olanak tanır.
- **Tümleşik CORS & Günlük Kaydı (Logging)**: Güvenli çapraz kaynak erişimi ve istek takibi sağlayan yapılandırılabilir ara yazılımlar (middleware).
- **Hata Yönetimi**: Standart formatlı JSON hata yanıtları (`ErrorResponse`) ve HTTP durum kodları.

---

## Dizin Yapısı

```
robo_market_api/
├── app/
│   ├── api/
│   │   ├── router.py            # Ana API yönlendiricisi
│   │   └── v1/                  # Versiyon 1 uç noktaları
│   │       ├── agent.py         # AI donanım ajanı uç noktaları (/agent/analyze)
│   │       ├── health.py        # Sağlık kontrolü uç noktası (/health)
│   │       ├── optimize.py      # Sepet optimizasyonu uç noktası (/optimize)
│   │       ├── providers.py     # Mağaza sağlayıcıları uç noktaları (/providers)
│   │       └── search.py        # Ürün arama uç noktaları (/search, /search/batch)
│   ├── core/
│   │   ├── config.py            # Çevresel değişken ve ayarlar (Pydantic Settings)
│   │   ├── errors.py            # Özel istisna sınıfları ve hata yakalayıcılar
│   │   └── logging.py           # Yapılandırılmış günlükleme ayarları
│   ├── dependencies/
│   │   └── services.py          # FastAPI bağımlılık enjeksiyonu (DI) sağlayıcıları
│   ├── middleware/
│   │   └── logging.py           # İstek ve yanıt sürelerini ölçen ara yazılım
│   ├── models/
│   │   ├── requests.py          # Pydantic istek şemaları
│   │   └── responses.py         # Pydantic yanıt şemaları
│   ├── services/
│   │   ├── agent_service.py     # robo_market_agent sarmalayıcısı
│   │   └── search_service.py    # robo_market_service sarmalayıcısı
│   └── main.py                  # FastAPI uygulama fabrikası ve Uvicorn giriş noktası
└── __init__.py
```

---

## Sunucuyu Başlatma

### 1. CLI ile Başlatma

`pyproject.toml` içerisinde tanımlı `robo-api` komutu ile sunucuyu doğrudan başlatabilirsiniz:

```bash
# Varsayılan port (8000) ile başlatma
robo-api

# Veya uv/python üzerinden:
uv run robo-api
```

### 2. Makefile ile Başlatma

```bash
make run-api
```

Sunucu varsayılan olarak `http://127.0.0.1:8000` adresinde çalışır.

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI Şeması**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

## API Uç Noktaları

### 1. Sağlık Kontrolü

```http
GET /health
GET /api/v1/health
```

**Örnek Yanıt:**
```json
{
  "status": "ok",
  "version": "1.10.0",
  "timestamp": 1731801600.0
}
```

### 2. Ürün Arama

```http
POST /api/v1/search
Content-Type: application/json

{
  "query": "ESP32-CAM",
  "limit": 5,
  "sort_by_price": true,
  "use_cache": true,
  "expand_synonyms": true
}
```

**cURL Örneği:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "ESP32-CAM", "limit": 3}'
```

### 3. Çoklu Komponent Arama (Toplu / Batch)

```http
POST /api/v1/search/batch
Content-Type: application/json

{
  "queries": ["ESP32 DevKit", "SG90 Servo", "HC-SR04"],
  "limit": 3
}
```

### 4. Mağaza Sağlayıcılarını Listeleme

```http
GET /api/v1/providers/
```

Desteklenen tüm mağazaların adlarını, temel URL'lerini ve yeteneklerini döndürür.

### 5. Sepet Optimizasyonu

```http
POST /api/v1/optimize
Content-Type: application/json

{
  "items": ["ESP32", "L298N", "HC-SR04"]
}
```

Mağazaların kargo baremlerini ve ürün fiyatlarını analiz ederek en avantajlı sepet dağılımını hesaplar.

### 6. Yapay Zeka Donanım Ajanı (BYOK Destekli)

```http
POST /api/v1/agent/analyze
Content-Type: application/json
X-Provider: openai
X-OpenAI-API-Key: sk-...

{
  "prompt": "Toprak nemine göre su pompalayan otomatik saksı sulama sistemi"
}
```

**Desteklenen BYOK Başlıkları:**
- `Authorization: Bearer <key>`
- `X-API-Key: <key>`
- `X-OpenAI-API-Key: <key>`
- `X-Gemini-API-Key: <key>`
- `X-Anthropic-API-Key: <key>`
- `X-Provider: openai | deepseek | groq | gemini | anthropic | ollama | mock`
- `X-OpenAI-Base-URL: <custom_endpoint>`
- `X-OpenAI-Model: <model_name>`
