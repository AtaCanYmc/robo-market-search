# `robo_market_agent` — AI Agent Layer & CLI Tool

`robo_market_agent`, projenin **Yapay Zeka ve LLM Orkestrasyon Katmanıdır**. Kullanıcının serbest metin formatındaki donanım projesi isteklerini anlar, Malzeme Listesi (BOM) oluşturur, uyumluluk kontrollerini yapar, `robo_market_service` üzerinden ürünleri aratır ve alışveriş sepetini optimize eder.

---

## 🤖 Donanım Asistanı CLI Kullanımı (`robo-agent`)

`robo_market_agent` katmanı kendi başına terminalden çalıştırılabilen `robo-agent` komut satırı aracına sahiptir.

### Örnek Komutlar:

```bash
# 1. Mock LLM sağlayıcısı ile hızlı deneme yapma (API Key gerektirmez)
robo-agent "WiFi üzerinden 4 valfli otomatik sulama sistemi yapmak istiyorum" --provider mock

# 2. DeepSeek AI ile proje analizi ve sepet optimizasyonu
robo-agent "ESP32 tabanlı uzaktan sıcaklık ve nem takip cihazı" --provider deepseek --api-key "sk-..."

# 3. Groq (Llama 3.3 70B) ile ultra hızlı analiz
robo-agent "Akıllı ev için hareket sensörlü ışık kontrol sistemi" --provider groq --api-key "gsk_..."

# 4. OpenAI (GPT-4o) ile çalıştırma
robo-agent "Bluetooth kontrollü 2 tekerlekli robot araba" --provider openai --api-key "sk-..."
```

---

## 8 Adımlı Boru Hattı (Pipeline Workflow)

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
- **`GeminiProvider`**: Gemini 2.5 Flash entegrasyonu.
- **`GroqProvider`**: Llama 3.3 70B, Mixtral ultra hızlı Groq Cloud entegrasyonu.
- **`DeepSeekProvider`**: DeepSeek-V3 ve DeepSeek-R1 (Chat & Reasoner) entegrasyonu.
- **`OllamaProvider`**: Yerel bilgisayarınızda çalışan Llama 3 / Mistral entegrasyonu.
- **`MockLLMProvider`**: İnternet/API key gerektirmeyen çevrimdışı birim testleri ve mock çalıştırma.

---

## Dosya Yapısı

```
robo_market_agent/
├── cli.py                 # robo-agent CLI komut satırı aracı
├── agent.py               # Ana RoboMarketAgent orkestratör sınıfı
├── models/                # Pydantic yapısal veri modelleri (ProjectRequirements, BOM, etc.)
│   └── agent_models.py
├── providers/             # LLM sağlayıcı sınıfları (Base, OpenAI, Anthropic, Gemini, Groq, DeepSeek, Ollama, Mock)
├── pipeline/              # Bağımsız boru hattı adımları
│   ├── base.py
│   ├── project_understander.py
│   ├── bom_generator.py
│   ├── compatibility.py
│   ├── component_searcher.py
│   ├── normalizer.py
│   ├── optimizer.py
│   └── report_generator.py
└── prompts/               # Kod içerisine gömülmeyen harici istem (prompt) şablonları (.txt)
```
