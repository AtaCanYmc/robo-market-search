import asyncio
from mcp.client.stdio import stdio_client, get_default_environment, StdioServerParameters
from mcp.client.session import ClientSession


async def main():
    """
    Bu script, robo-mcp sunucusuna sanki Claude veya başka bir LLM asistanıymış gibi
    bağlanır ve 'search_electronic_components' aracını test eder.
    """
    # robo-mcp komutunu stdio üzerinden LLM gibi başlatıyoruz
    server_params = StdioServerParameters(
        command="robo-mcp",
        args=[],
        env=get_default_environment()  # type: ignore
    )

    print("[*] MCP Sunucusuna (robo-mcp) bağlanılıyor...")
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Bağlantıyı başlat
                await session.initialize()
                print("[*] Bağlantı başarılı!\n")

                # Sunucudaki araçları (tools) listele
                print("[*] Sunucudaki araçlar sorgulanıyor...")
                tools_response = await session.list_tools()
                for tool in tools_response.tools:
                    print(f"    - Bulunan Araç: {tool.name}")

                # Aracı ESP32 parametresi ile çağır
                print("\n[*] 'search_electronic_components' aracı ESP32 sorgusu ile tetikleniyor...")
                print("    (Marketlerde arama yapılıyor, lütfen bekleyin...)\n")

                result = await session.call_tool(
                    "search_electronic_components",
                    arguments={"query": "ESP32-C3", "limit_per_store": 2}
                )

                print("--- MCP SUNUCUSUNDAN GELEN YANIT ---\n")
                # Gelen text/markdown yanıtlarını ekrana bas
                for content in result.content:
                    if content.type == "text":
                        print(content.text)

    except FileNotFoundError:
        print(
            "\n[HATA] 'robo-mcp' komutu bulunamadı. "
            "Lütfen ana dizindeyken 'pip install -e .[all]' komutunu çalıştırarak paketi kurduğunuzdan emin olun."
        )
    except Exception as e:
        print(f"\n[HATA] Bir hata oluştu: {e}")


if __name__ == "__main__":
    asyncio.run(main())
