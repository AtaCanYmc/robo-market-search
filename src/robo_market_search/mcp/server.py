"""
Model Context Protocol (MCP) Server for Robo Market Search.
Enables AI assistants (Claude Desktop, Cursor, VS Code) to query Turkish electronics stores.
"""

try:
    from mcp.server.mcpserver import MCPServer
except ImportError:
    from mcp.server.fastmcp import FastMCP as MCPServer

from robo_market_search.unified.client import UnifiedSearchClient

app = MCPServer("robo-market-search")


@app.tool()
def search_electronic_components(query: str, limit_per_store: int = 5) -> str:
    """
    Türkiye'deki popüler 6 robotik ve elektronik markette (Robotistan, Robolink, Robo90, Direnç.net,
    Özdisan, Motorobit) canlı ürün, fiyat, stok ve link araması yapar.

    Kullanıcı bir donanım projesinden bahsettiğinde veya parça aradığında bu aracı kullanın.
    Doğrudan parça numaralarını (örn: 'ESP32-WROOM', 'Arduino Uno R3', 'PLA Filament') aratın.

    Args:
        query: Aranacak elektronik komponentin veya malzemenin adı (örn: ESP32, Arduino Uno)
        limit_per_store: Market başına getirilecek maksimum sonuç sayısı (varsayılan: 5)
    """
    if not query or not query.strip():
        return "Arama sorgusu (query) belirtilmedi."

    try:
        client = UnifiedSearchClient()
        results = client.search(query=query.strip(), limit_per_store=limit_per_store)

        if not results:
            return f"'{query}' araması için hiçbir markette sonuç bulunamadı."

        markdown_lines = [f"## '{query}' Arama Sonuçları (Fiyata Göre Sıralı)\n"]
        for idx, item in enumerate(results, 1):
            stok = "Stokta Var" if getattr(item, "in_stock", True) else "Tükendi"
            fiyat = f"{item.price:.2f} {getattr(item, 'currency', 'TL')}" if getattr(item, "price", None) else "Fiyat Yok"
            market_adi = getattr(item, "store", "Bilinmeyen Market")
            urun_adi = getattr(item, "name", "İsimsiz Ürün")
            link = getattr(item, "url", "#")

            markdown_lines.append(
                f"{idx}. **{urun_adi}**\n"
                f"   - **Market:** {market_adi}\n"
                f"   - **Fiyat:** {fiyat}\n"
                f"   - **Stok:** {stok}\n"
                f"   - **Link:** [Ürüne Git]({link})\n"
            )

        return "\n".join(markdown_lines)

    except Exception as e:
        return (
            f"Arama işlemi sırasında bir hata meydana geldi: {e!s}\n"
            "Lütfen daha sonra tekrar deneyin veya farklı bir sorgu kullanın."
        )


def main():
    """MCP server stdio runner."""
    app.run("stdio")


if __name__ == "__main__":
    main()
