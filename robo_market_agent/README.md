# `robo_market_agent` — AI Agent Layer & Bring Your Own API Key (BYOK)

`robo_market_agent`, projenin **Yapay Zeka ve LLM Orkestrasyon Katmanıdır**. Kullanıcının serbest metin formatındaki donanım projesi isteklerini anlar, Malzeme Listesi (BOM) oluşturur, uyumluluk kontrollerini yapar, `robo_market_service` üzerinden ürünleri aratır ve alışveriş sepetini optimize eder.

---

## 🔑 Bring Your Own API Key (BYOK) Desteği

Ajan hem CLI hem de REST API katmanında **Bring Your Own API Key (BYOK)** mimarisini destekler. Kullanıcılar kendi API anahtarlarını istekle birlikte gönderebilir:

- **HTTP Başlıkları (Headers)**: `X-API-Key`, `X-OpenAI-API-Key`, `X-Gemini-API-Key`, `X-Anthropic-API-Key`, `X-Provider`
- **İstek Gövdesi (Request Body)**: `{ "prompt": "...", "api_key": "sk-...", "provider": "openai" }`
- **Yerel Hafıza**: `~/.config/robo-market-agent/config.json` veya Web UI `localStorage`

---

## 📸 Ajan Görsel Arayüz Ekranları (Visual UI Screens)

<div align="center">
  <img src="../.github/screenshots/agent_malzeme_listesi.png" width="48%" alt="Malzeme Listesi (BOM) Tab" />
  &nbsp;
  <img src="../.github/screenshots/agent_donanim_uyumlulugu.png" width="48%" alt="Donanım Uyumluluğu Tab" />
  <br/><br/>
  <img src="../.github/screenshots/agent_proje_ihtiyaclari.png" width="48%" alt="Proje İhtiyaçları Tab" />
  &nbsp;
  <img src="../.github/screenshots/agent_example_cart.png" width="48%" alt="Sepet Mağaza Bölüşümü Tab" />
</div>

---

## 🤖 Donanım Asistanı CLI Kullanımı (`robo-agent`)

`robo_market_agent` katmanı kendi başına terminalden çalıştırılabilen `robo-agent` komut satırı aracına sahiptir.

### 🔑 API Key'leri Hafızaya Kaydetme (Bir kere kaydet, her zaman kullan)

```bash
# DeepSeek API Key'i kaydetme ve varsayılan yapma
robo-agent config set --provider deepseek --api-key "sk-..." --default

# OpenAI API Key kaydetme
robo-agent config set --provider openai --api-key "sk-..."

# Groq API Key kaydetme
robo-agent config set --provider groq --api-key "gsk_..."

# Kayıtlı konfigürasyonu ve gizlenmiş API key'leri görüntüleme
robo-agent config show

# Hafızayı temizleme
robo-agent config clear
```

### Proje Analizi Çalıştırma:

```bash
# Kayıtlı varsayılan sağlayıcı ile doğrudan çalıştırma
robo-agent "WiFi üzerinden 4 valfli otomatik sulama sistemi"

# Farklı bir kayıtlı sağlayıcı seçerek çalıştırma
robo-agent "ESP32 tabanlı uzaktan sıcaklık takip cihazı" --provider deepseek

# Mock sağlayıcı ile çevrimdışı/ücretsiz test etme
robo-agent "Bluetooth robot araba" --provider mock
```

---

## 7 Adımlı Boru Hattı (Pipeline Workflow)

Agent aşağıdaki adımları sırasıyla ve bağımsız sınıflar (`BasePipelineStep`) halinde çalıştırır:

```
User Input
    │
    ▼
1. Understand Project (ProjectUnderstanderStep)
    │
    ▼
2. Generate BOM (BOMGeneratorStep)
    │
    ▼
3. Validate Compatibility (CompatibilityCheckerStep)
    │
    ▼
4. Search Components (ComponentSearcherStep -> SearchService)
    │
    ▼
5. Normalize Products (ProductNormalizerStep)
    │
    ▼
6. Optimize Shopping Cart (ShoppingOptimizerStep)
    │
    ▼
7. Generate Final Report (ReportGeneratorStep)
```

---

## LLM Sağlayıcı Soyutlaması (LLM Provider Abstraction)

Agent hiçbir LLM üreticisine doğrudan bağımlı değildir. Tüm entegrasyon `BaseLLMProvider` soyut arayüzü üzerinden yapılır:

- **`OpenAIProvider`**: GPT-4o, GPT-4o-mini entegrasyonu.
- **`AnthropicProvider`**: Claude 3.5 Sonnet entegrasyonu.
- **`GeminiProvider`**: Gemini 2.0 Flash entegrasyonu.
- **`GroqProvider`**: Llama 3.3 70B ultra hızlı Groq Cloud entegrasyonu.
- **`DeepSeekProvider`**: DeepSeek-V3 ve DeepSeek-R1 entegrasyonu.
- **`OllamaProvider`**: Yerel bilgisayarınızda çalışan Llama 3 / Qwen2.5-Coder entegrasyonu.
- **`MockLLMProvider`**: İnternet/API key gerektirmeyen çevrimdışı birim testleri ve mock çalıştırma.
