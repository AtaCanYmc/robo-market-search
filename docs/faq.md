# Frequently Asked Questions (FAQ)

---

### Q1: Is Robo Market Search free to use?
**Yes!** Robo Market Search is 100% open-source software licensed under the **Apache License 2.0**.

---

### Q2: Do I need an API key to search e-commerce stores?
**No!** Core product searches across Robolink, Robotistan, Robo90, and Direnç.net require **zero API keys** and zero registration.

API keys are ONLY required if you choose to use the AI Hardware Agent (`robo_market_agent`) with external paid LLMs (OpenAI, Gemini, Anthropic, DeepSeek, Groq). If you select **Mock** or **Ollama**, no API key is required.

---

### Q3: How does Cart Optimization calculate split-cart vs single store?
The Cart Optimizer queries candidate items across all stores, calculates the exact item subtotal per store, checks if subtotal exceeds each store's **free shipping threshold** (default 1500 TL), adds flat shipping fees if below threshold, and compares single-store grand totals against multi-store split-cart groupings to recommend the absolute cheapest option.

---

### Q4: Which Python versions are supported?
Python **3.8, 3.9, 3.10, 3.11, 3.12, 3.13, and 3.14** are fully supported and verified via GitHub Actions CI.

---

### Q5: How can I request support for a new store?
You can request a new store by opening an issue on GitHub or implementing a scraper client yourself! See [providers.md](file:///Users/atacan/PycharmProjects/robo-market-search/docs/providers.md) for a step-by-step tutorial.
