# CLI Reference Guide

The `robo-search` and `robo-agent` command-line interfaces provide terminal commands for product searching, cart optimization, AI hardware analysis, and configuration management.

---

## 🍺 Kurulum (Homebrew & pip)

### Homebrew ile Kurulum (macOS & Linux)
```bash
brew install atacanymc/tap/robo-market-search
```

### pip ile Kurulum
```bash
pip install "robo-market-search[cli]"
```

---

## ⌨️ `robo-search` (Ürün Arama & Sepet Optimizasyonu)

`robo-search` doğrudan sorgu ile çalışabilen akıllı yönlendirmeye (smart routing) ve Rich terminal arayüzüne sahiptir.

### 1. `search` Komutu (Doğrudan veya Alt Komut)

Herhangi bir alt komut yazmadan doğrudan ürün adı girerek veya `search` alt komutunu kullanarak arama yapabilirsiniz.

```bash
# Doğrudan akıllı arama
robo-search "ESP32-WROOM"

# Parametrelerle arama
robo-search "Raspberry Pi 5" -l 3 -s -m robolink
```

#### Seçenekler:
- `QUERY`: Ürün anahtar kelimesi (örn. `"ESP32-WROOM"`). Parametre girilmezse interaktif olarak sorulur.
- `-c, --csv PATH`: Bileşen listesi içeren CSV dosyası.
- `-l, --limit INT`: Market başına getirilecek maksimum sonuç sayısı (varsayılan: `10`).
- `--sort / --no-sort`: Fiyata göre en ucuzdan sıralama (varsayılan: `True`).
- `-s, --stock-only`: Yalnızca stokta bulunan ürünleri gösterir.
- `-m, --store TEXT`: Yalnızca belirli bir mağazayı filtreler (`robotistan`, `robolink`, `robo90`, `direncnet`).
- `--json`: Sonuçları JSON formatında çıktı verir.
- `--markdown`: Sonuçları Markdown tablosu olarak yazdırır.
- `-v, --version`: Sürüm bilgisini görüntüler.

#### Arayüz Özellikleri:
- **Tıklanabilir Linkler**: Terminaliniz destekliyorsa ürün adına veya `Aç ↗` bağlantısına tıklayarak doğrudan tarayıcıda açabilirsiniz.
- **En Ucuz Rozeti**: Stokta bulunan en uygun fiyatlı üründe `★ EN UCUZ` etiketi vurgulanır.
- **Özet Kartı**: Sorgu, toplam ürün, stok adedi ve en uygun fiyat panelde özetlenir.

#### Examples:
```bash
# Basic product search
robo-search "Arduino Uno R3"

# Limit per store results
robo-search "Raspberry Pi 4" --limit 3

# Batch search from CSV
robo-search --csv components.csv
```

---

### 2. `cart` Command

Calculate split-cart shopping cost and store free shipping limits.

```bash
robo-search cart [ITEMS...] [OPTIONS]
```

#### Options:
- `ITEMS...`: Space or comma separated component names.
- `--csv PATH`: CSV file containing list of components.
- `--limit INT`: Candidates fetched per store per item (default `5`).
- `--shipping-[store] FLOAT`: Override flat shipping fee for a store (`--shipping-robotistan`, `--shipping-robolink`, etc.).
- `--free-[store] FLOAT`: Override free shipping threshold (`--free-robotistan`, `--free-robolink`, `--free-robo90`, `--free-direncnet`).

#### Examples:
```bash
# Cart optimization for 3 components
robo-search cart "ESP32" "5V Relay Module" "0.96 OLED Display"

# Comma-separated format
robo-search cart "ESP32, Relay 5V, OLED 0.96"

# Custom shipping thresholds (e.g., 1000 TL free shipping limit)
robo-search cart "Arduino Uno" "Stepper Motor" --free-robotistan 1000 --free-robolink 1000
```

---

## 🤖 `robo-agent` (AI Hardware Agent)

Analyze hardware requirements, generate BOM lists, and validate compatibility using LLMs.

```bash
robo-agent [PROMPT] [OPTIONS]
robo-agent config [COMMAND]
```

### Options:
- `PROMPT`: Free-text description of your hardware project.
- `--provider NAME`: LLM provider (`openai`, `gemini`, `anthropic`, `deepseek`, `groq`, `ollama`, `mock`).
- `--api-key KEY`: LLM API Key (optional if stored via `config set`).
- `--project-type TYPE`: Category (`IoT / Akıllı Ev`, `Robotik / Mechatronics`, `Gömülü Sistemler`, `3D Yazıcı / CNC`).

### Config Subcommands:
```bash
# Set default provider & API key
robo-agent config set --provider deepseek --api-key "sk-..." --default

# View saved configuration (masked keys)
robo-agent config show

# Clear saved credentials
robo-agent config clear
```

### Examples:
```bash
# Analyze project using saved default provider
robo-agent "WiFi connected soil moisture sensor with automated valve control"

# Specify provider explicitly
robo-agent "Bluetooth robot chassis" --provider groq --api-key "gsk_..."
```
