[← Ana Dokümantasyona Dön](../README.md)

# CLI Başvuru Kılavuzu (CLI Reference Guide)

Robo Market Search ekosistemi, terminal üzerinden hızlı işlem yapmanızı sağlayan 5 adet bağımsız komut satırı aracı sunar:

- **`robo-search`**: 6 markette canlı ürün arama, stok filtreleme, Markdown/JSON dışa aktarma ve sepet optimizasyonu.
- **`robo-agent`**: Yapay zeka donanım asistanı (BOM çıkarma, uyumluluk denetimi, BYOK anahtar yönetimi).
- **`robo-api`**: FastAPI tabanlı REST API sunucu başlatıcısı.
- **`robo-mcp`**: Claude Desktop, Cursor ve VS Code için Model Context Protocol (MCP) sunucusu.
- **`robo-bot`**: Telegram bot servisi.

---

## Kurulum

### Homebrew ile Kurulum (macOS & Linux)
```bash
brew install atacanymc/tap/robo-market-search
```

### pipx ile Kurulum (İzole Ortam - Önerilen)
```bash
pipx install "robo-market-search[all]"
```

### pip ile Kurulum
```bash
pip install "robo-market-search[cli]"
```

---

## 1. `robo-search`: Ürün Arama & Sepet Optimizasyonu

`robo-search`, akıllı komut yönlendirmesi (smart subcommand routing) sayesinde `search` kelimesini yazmadan doğrudan ürün adıyla çalıştırılabilir.

### Arama Komutu (`search` veya doğrudan sorgu)

```bash
# Doğrudan akıllı arama
robo-search "ESP32-WROOM"

# Parametrelerle arama
robo-search "Raspberry Pi 5" -l 3 -s -m robolink

# Açık alt komut formatı
robo-search search "Arduino Uno R3" --limit 5
```

#### Seçenekler:
- `QUERY`: Aranacak ürün veya parça adı. Belirtilmezse terminalde interaktif olarak sorulur.
- `-c, --csv PATH`: Parça listesi içeren CSV dosyası yolu.
- `-l, --limit INT`: Mağaza başına getirilecek maksimum sonuç sayısı (varsayılan: `10`).
- `--sort / --no-sort`: Fiyata göre en ucuzdan sıralama (varsayılan: `sort`).
- `-s, --stock-only`: Yalnızca stokta bulunan ürünleri listeler.
- `-m, --store TEXT`: Yalnızca belirli bir mağazayı filtreler (`robotistan`, `robolink`, `robo90`, `direncnet`, `ozdisan`, `motorobit`).
- `--json`: Sonuçları JSON formatında yazdırır.
- `--markdown`: Sonuçları Markdown tablosu olarak yazdırır.

#### Arayüz Özellikleri:
- **Tıklanabilir Linkler (OSC 8)**: Terminal destekliyorsa ürün adına veya bağlantıya tıklayarak doğrudan tarayıcıda ilgili mağaza sayfasını açabilirsiniz.
- **En Ucuz Rozeti**: Stokta bulunan en avantajlı fiyata sahip üründe `★ EN UCUZ` etiketi vurgulanır.
- **Özet Kartı**: Sorgu, bulunan toplam ürün adedi, stok durumu ve en uygun fiyat panelde özetlenir.

---

### Sepet Optimizasyonu Komutu (`cart`)

Birden fazla bileşeni analiz ederek tek bir mağazadan toplu alım ile mağazalar arasında kargo baremlerine göre paylaştırılmış bölünmüş sipariş (split-cart) maliyetlerini karşılaştırır.

```bash
robo-search cart [ITEMS...] [OPTIONS]
```

#### Seçenekler:
- `ITEMS...`: Boşluk veya virgülle ayrılmış bileşen listesi.
- `--csv PATH`: Her satırında bir bileşen adı bulunan CSV dosyası.
- `--limit INT`: Her parça için mağaza başına taranacak aday sayısı (varsayılan: `5`).
- `--shipping-[store] FLOAT`: Belirli bir mağazanın sabit kargo ücretini ezme (`--shipping-robotistan 45.0`, vb.).
- `--free-[store] FLOAT`: Belirli bir mağazanın ücretsiz kargo limitini ezme (`--free-robotistan 1000`, `--free-robolink 750`).

#### Örnekler:
```bash
# 3 parçalık sepet analizi
robo-search cart "ESP32" "5V Relay Module" "0.96 OLED Display"

# Virgülle ayrılmış liste formatı
robo-search cart "ESP32, Relay 5V, OLED 0.96"

# Özel kargo baremleri belirterek hesaplama
robo-search cart "Arduino Uno" "Step Motor" --free-robotistan 1000 --free-robolink 1000
```

---

### Sürüm Bilgisi Komutu (`version` veya `--version`)

CLI sürümünü, desteklenen 6 mağazanın listesini ve sistem bilgilerini gösterir:

```bash
robo-search version
# veya
robo-search --version
# veya
robo-search -v
```

---

## 2. `robo-agent`: Yapay Zeka Donanım Ajanı

Serbest metin formatında iletilen donanım projelerini analiz eder, Malzeme Listesi (BOM) çıkartır, voltaj ve pin uyumluluğunu denetler ve en uygun mağaza dağılımını hesaplar.

### Proje Analizi Çalıştırma (`run` veya doğrudan metin)

Akıllı yönlendirme sayesinde doğrudan proje tanımı girilerek çalıştırılabilir:

```bash
# Doğrudan akıllı çalıştırma (kayıtlı varsayılan sağlayıcı ile)
robo-agent "Toprak nemine göre su vanalarını açan WiFi sulama sistemi"

# Belirli bir sağlayıcı ve model belirterek çalıştırma
robo-agent "Bluetooth robot araba" --provider deepseek --model deepseek-chat

# Açık alt komut formatı
robo-agent run "ESP32 uzaktan sıcaklık takip cihazı" --provider groq -k "gsk_..."

# Mock sağlayıcı ile çevrimdışı ve ücretsiz test etme
robo-agent "IoT Meteoroloji İstasyonu" --provider mock
```

#### Seçenekler:
- `PROMPT`: Yapmak istediğiniz donanım projesinin açıklaması.
- `-p, --provider TEXT`: LLM Sağlayıcı (`openai`, `anthropic`, `gemini`, `groq`, `deepseek`, `ollama`, `mock`).
- `-k, --api-key TEXT`: Komut anında geçici API anahtarı kullanımı.
- `-u, --base-url TEXT`: Özel veya OpenAI uyumlu Base URL (`https://openrouter.ai/api/v1`, `http://localhost:11434/v1`, vb.).
- `-m, --model TEXT`: Model adı (`gpt-4o`, `deepseek-chat`, `claude-3-5-sonnet-latest`, `llama-3.3-70b-versatile`).
- `--no-cache`: Arama servis önbelleğini devre dışı bırakarak taze sorgu atar.

---

### Konfigürasyon ve API Anahtarı Yönetimi (`config`)

API anahtarlarınızı yerel makinenizde (`~/.config/robo-market-agent/config.json`) güvenli şekilde saklar:

```bash
# DeepSeek API anahtarını kaydetme ve varsayılan yapma
robo-agent config set --provider deepseek --api-key "sk-..." --default

# OpenAI API anahtarı kaydetme
robo-agent config set --provider openai --api-key "sk-..." --model gpt-4o

# Özel bir yerel sunucu (Ollama / LocalAI) kaydetme
robo-agent config set --provider openai --base-url "http://localhost:11434/v1" --api-key "ollama"

# Kayıtlı konfigürasyonları ve maskelenmiş anahtarları listeleme
robo-agent config show

# Kayıtlı tüm konfigürasyonu temizleme
robo-agent config clear
```

---

## 3. `robo-api`: REST API Sunucusu

FastAPI tabanlı REST API sunucusunu Uvicorn üzerinden yerel makinede başlatır:

```bash
# Sunucuyu başlatma (Varsayılan: http://0.0.0.0:8000)
robo-api
```

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Sağlık Kontrolü**: `curl http://localhost:8000/health`

---

## 4. `robo-mcp`: Model Context Protocol Sunucusu

Claude Desktop, Cursor veya VS Code Cline/RooCode asistanlarının 6 markette canlı donanım araması yapabilmesi için stdio protokolü üzerinden çalışan MCP sunucusudur:

```bash
# MCP stdio sunucusunu başlatma
robo-mcp
```

Claude Desktop yapılandırma dosyasına (`claude_desktop_config.json`) eklemek için:

```json
{
  "mcpServers": {
    "robo-market-search": {
      "command": "robo-mcp"
    }
  }
}
```

---

## 5. `robo-bot`: Telegram Bot Servisi

Telegram üzerinden `/search` ve `/cart` komutlarıyla ürün ve sepet sorgulaması yapmayı sağlayan Aiogram tabanlı bot servisidir:

```bash
# Bot token tanımlayarak servisi başlatma
export BOT_TOKEN="your_telegram_bot_token"
robo-bot
```
