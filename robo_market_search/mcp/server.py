import anyio
import mcp.types as types
from mcp.server import Server
from mcp.server.stdio import stdio_server
import asyncio
from robo_market_search.unified.client import UnifiedSearchClient

app = Server("robo-market-search")


@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="search_electronic_components",
            description=(
                "Türkiye'deki popüler robotik/elektronik marketlerde (Robotistan, Dirençnet, Robo90, Robolink) "
                "canlı ürün, fiyat, stok ve link araması yapar. Kullanıcı bir donanım projesinden bahsettiğinde "
                "veya parça aradığında bu aracı kullanmalısın. Arama motorlarının kararlı çalışması için kullanıcı "
                "sorgularını optimize et, jenerik veya uzun cümleler yerine doğrudan parça numaralarını "
                "(örn: 'ESP32-WROOM', 'Arduino Uno R3', 'PLA Filament') arat."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": ("Aranacak elektronik komponentin veya malzemenin tam adı "
                                        "(örn: ESP32, Arduino Uno)")
                    },
                    "limit_per_store": {
                        "type": "integer",
                        "description": "Market başına getirilecek maksimum sonuç sayısı. Varsayılan: 5",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name != "search_electronic_components":
        raise ValueError(f"Bilinmeyen araç: {name}")

    query = arguments.get("query")
    if not query:
        raise ValueError("Arama sorgusu (query) belirtilmedi.")

    limit = arguments.get("limit_per_store", 5)

    try:
        client = UnifiedSearchClient()
        results = await anyio.to_thread.run_sync(
            lambda: client.search(query=query, limit_per_store=limit)
        )

        if not results:
            return [
                types.TextContent(
                    type="text",
                    text=f"'{query}' araması için hiçbir markette sonuç bulunamadı."
                )
            ]

        markdown_lines = [f"## '{query}' Arama Sonuçları (Fiyata Göre Sıralı)\n"]
        for idx, item in enumerate(results, 1):
            stok = getattr(item, "in_stock", "Bilinmiyor")
            fiyat = f"{item.price:.2f} {getattr(item, 'currency', 'TL')}" if getattr(item, "price",
                                                                                     None) else "Fiyat Yok"
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

        return [
            types.TextContent(
                type="text",
                text="\n".join(markdown_lines)
            )
        ]

    except Exception as e:
        return [
            types.TextContent(
                type="text",
                text=(f"Arama işlemi sırasında bir hata meydana geldi: "
                      f"{str(e)}\nLütfen daha sonra tekrar deneyin veya farklı bir sorgu kullanın.")
            )
        ]


async def _run_server():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


def main():
    asyncio.run(_run_server())


if __name__ == "__main__":
    main()
