# Robo Market Search

Türkiye'nin en popüler 4 elektronik ve robotik pazarında (**Robolink, Robotistan, Robo90, Direnç.net**) tek satır kodla, çok hızlı ve eşzamanlı arama yapmanızı sağlayan Python istemci kütüphanesi.

Ayrıca yerleşik **CLI (Komut Satırı)** aracı ve **MCP (Model Context Protocol)** sunucusu özelliklerine sahiptir.

## Özellikler
- **Unified Search (Birleştirilmiş Arama)**: 4 markette paralel (Thread) olarak eşzamanlı arama yapar ve ürünleri ucuzdan pahalıya sıralar.
- **Standart Veri Tipi**: Tüm sonuçlar, standart `Product` objesi olarak döner.
- **Dinamik Token Mimarisi**: API key veya token değişikliklerinde otomatik güncellenerek (regex ile ana sayfalardan kazıyarak) kesintisiz çalışır.
- **Güçlü CLI**: Terminal üzerinden şık tablolar ve anlık yükleme animasyonları ile hızlı ürün araması.
- **LLM/MCP Entegrasyonu**: Claude vb. LLM asistanlarına, projeniz için donanım/elektronik malzeme arama yeteneği kazandırır.

## Kurulum

Sadece SDK (Kütüphane) özelliklerini kullanmak için:

```bash
pip install robo-market-search
```

CLI ve MCP özelliklerini de içeren **tüm ekosistemi** kurmak için:

```bash
pip install "robo-market-search[all]"
```
*(Sadece CLI için `[cli]`, sadece MCP için `[mcp]` seçeneklerini de kullanabilirsiniz.)*

## Komut Satırı Arayüzü (CLI) Kullanımı

Uygulamayı `[cli]` veya `[all]` etiketiyle kurduktan sonra terminalden anında arama yapabilirsiniz:

```bash
# Temel arama
robo-search "ESP32-WROOM"

# Limit belirterek arama (Market başına 3 ürün)
robo-search "Arduino Uno" --limit 3

# Fiyat sıralamasını devreden çıkararak arama
robo-search "PLA Filament" --no-sort
```

## Model Context Protocol (MCP) Sunucusu

Proje, LLM'ler (örn. Claude Desktop) için resmi MCP sunucusu içerir. Bu sayede yapay zeka asistanınız projeleriniz için doğrudan Türkiye pazarındaki elektronik parçaların fiyat ve stok durumunu canlı olarak sorgulayabilir.

Claude Desktop yapılandırma dosyanıza (`claude_desktop_config.json`) aşağıdaki ayarı ekleyerek kullanmaya başlayabilirsiniz:

```json
{
  "mcpServers": {
    "robo-market-search": {
      "command": "robo-mcp",
      "args": []
    }
  }
}
```

## Hızlı Başlangıç (Python SDK / Birleştirilmiş Arama)

```python
from robo_market_search import UnifiedSearchClient

client = UnifiedSearchClient()
products = client.search(query="arduino", limit_per_store=5)

for p in products:
    print(f"[{p.store}] {p.name} - {p.price} {p.currency} (Stok: {p.in_stock})")
```

## Bireysel Market Araması

Sadece belirli bir markette arama yapmak isterseniz:

```python
from robo_market_search import RobotistanClient

client = RobotistanClient()
products = client.search_component("esp32", limit=3)
```

## Lisans
MIT License
