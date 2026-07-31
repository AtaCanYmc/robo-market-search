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

Agent hiçbir LLM üreticisine (OpenAI, Anthropic vb.) doğrudan bağımlı değildir. Tüm entegrasyon `BaseLLMProvider` soyut arayüzü üzerinden yapılır:

- **`OpenAIProvider`**: GPT-4o, GPT-4o-mini entegrasyonu.
- **`AnthropicProvider`**: Claude 3.5 Sonnet entegrasyonu.
- **`GeminiProvider`**: Gemini 2.5 Flash entegrasyonu.
- **`OllamaProvider`**: Yerel bilgisayarınızda çalışan Llama 3 / Mistral entegrasyonu.
- **`MockLLMProvider`**: İnternet/API key gerektirmeyen çevrimdışı birim testleri ve mock çalıştırma.

---

## Dosya Yapısı

```
robo_market_agent/
├── agent.py               # Ana RoboMarketAgent orkestratör sınıfı
├── models/                # Pydantic yapısal veri modelleri (ProjectRequirements, BOM, etc.)
│   └── agent_models.py
├── providers/             # LLM sağlayıcı sınıfları (Base, OpenAI, Anthropic, Gemini, Ollama, Mock)
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

```python
from robo_market_agent import RoboMarketAgent
from robo_market_agent.providers import OpenAIProvider  # veya GeminiProvider, AnthropicProvider, OllamaProvider, MockLLMProvider
from robo_market_service import SearchService

# 1. Bağımlılıkları enjekte edin (Dependency Injection)
llm_provider = OpenAIProvider(api_key="sk-...", model_name="gpt-4o")
search_service = SearchService(use_cache=True)

# 2. Agent'ı başlatın
agent = RoboMarketAgent(llm_provider=llm_provider, search_service=search_service)

# 3. Proje tanımını verip tam raporu alın
user_prompt = "I want to build an automatic irrigation system controlled over WiFi with 4 solenoid valves."
report = agent.run(user_prompt)

# Yapısal Çıktılar
print(f"Proje Tipi: {report.project_requirements.project_type}")
print(f"BOM Parça Sayısı: {len(report.bom.components)}")
print(f"Uyumluluk Durumu: {report.compatibility_report.is_compatible}")
print(f"Alışveriş Stratejisi: {report.optimization_result.strategy}")
print(f"Genel Toplam: {report.optimization_result.grand_total:.2f} TL")

# Markdown Özet Raporu
print("\n--- ÖZET RAPOR ---")
print(report.summary_markdown)
```
