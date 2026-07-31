# `robo_market_agent` — AI Agent Layer

`robo_market_agent`, projenin **Yapay Zeka ve LLM Orkestrasyon Katmanıdır**. Kullanıcının serbest metin formatındaki donanım projesi isteklerini anlar, Malzeme Listesi (BOM) oluşturur, uyumluluk kontrollerini yapar, `robo_market_service` üzerinden ürünleri aratır ve alışveriş sepetini optimize eder.

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

---

## Kullanım Örneği

### DeepSeek Provider ile Çalıştırma:
```python
from robo_market_agent import RoboMarketAgent
from robo_market_agent.providers import DeepSeekProvider
from robo_market_service import SearchService

llm = DeepSeekProvider(api_key="sk-...", model_name="deepseek-chat")
service = SearchService(use_cache=True)

agent = RoboMarketAgent(llm_provider=llm, search_service=service)
report = agent.run("WiFi üzerinden 4 valfli otomatik sulama sistemi yapmak istiyorum.")
print(report.summary_markdown)
```

### Groq Provider ile Çalıştırma:
```python
from robo_market_agent import RoboMarketAgent
from robo_market_agent.providers import GroqProvider
from robo_market_service import SearchService

llm = GroqProvider(api_key="gsk_...", model_name="llama-3.3-70b-versatile")
service = SearchService(use_cache=True)

agent = RoboMarketAgent(llm_provider=llm, search_service=service)
report = agent.run("WiFi üzerinden 4 valfli otomatik sulama sistemi yapmak istiyorum.")
print(report.summary_markdown)
```
