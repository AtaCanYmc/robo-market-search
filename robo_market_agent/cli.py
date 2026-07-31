"""
CLI interface for robo_market_agent.
Allows users to run AI hardware project planning and shopping optimization directly from terminal.
"""

import sys
from typing import Optional

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
import typer

from robo_market_agent import RoboMarketAgent
from robo_market_agent.providers import (
    AnthropicProvider,
    DeepSeekProvider,
    GeminiProvider,
    GroqProvider,
    MockLLMProvider,
    OllamaProvider,
    OpenAIProvider,
)
from robo_market_service import SearchService

app = typer.Typer(
    name="robo-agent",
    help="AI Hardware Agent - Understands project requirements, generates BOMs, checks compatibility, and optimizes shopping cart.",
)
console = Console()


def _get_provider(provider_name: str, api_key: str, model_name: Optional[str]):
    p_name = provider_name.lower().strip()
    if p_name == "openai":
        return OpenAIProvider(api_key=api_key, model_name=model_name or "gpt-4o")
    elif p_name == "anthropic":
        return AnthropicProvider(api_key=api_key, model_name=model_name or "claude-3-5-sonnet-20241022")
    elif p_name == "gemini":
        return GeminiProvider(api_key=api_key, model_name=model_name or "gemini-2.5-flash")
    elif p_name == "groq":
        return GroqProvider(api_key=api_key, model_name=model_name or "llama-3.3-70b-versatile")
    elif p_name == "deepseek":
        return DeepSeekProvider(api_key=api_key, model_name=model_name or "deepseek-chat")
    elif p_name == "ollama":
        return OllamaProvider(host=api_key or "http://localhost:11434", model_name=model_name or "llama3.1")
    elif p_name == "mock":
        return MockLLMProvider()
    else:
        console.print(
            f"[bold red]Hata:[/bold red] Desteklenmeyen LLM sağlayıcısı '{provider_name}'. (openai, anthropic, gemini, groq, deepseek, ollama, mock)"
        )
        sys.exit(1)


@app.command()
def run(
    prompt: str = typer.Argument(..., help="Yapmak istediğiniz donanım projesinin açıklaması"),
    provider: str = typer.Option(
        "mock", "--provider", "-p", help="LLM Sağlayıcı: openai, anthropic, gemini, groq, deepseek, ollama, mock"
    ),
    api_key: str = typer.Option("", "--api-key", "-k", help="LLM API Anahtarı (Ortam değişkeni yoksa)"),
    model: Optional[str] = typer.Option(
        None, "--model", "-m", help="Model adı (Örn: gpt-4o, deepseek-chat, llama-3.3-70b-versatile)"
    ),
    no_cache: bool = typer.Option(False, "--no-cache", help="Arama önbelleğini (cache) devre dışı bırakır"),
):
    """
    Donanım projenizi analiz eder, Malzeme Listesini (BOM) çıkartır, uyumluluğu denetler ve en ucuz sepet kombinasyonunu hesaplar.
    """
    console.print(
        Panel(f"[bold cyan]Robo Market AI Agent[/bold cyan]\n[gray]Proje İstegi:[/gray] {prompt}", title="🤖 Donanım Asistanı")
    )

    llm_provider = _get_provider(provider, api_key, model)
    search_service = SearchService(use_cache=not no_cache)
    agent = RoboMarketAgent(llm_provider=llm_provider, search_service=search_service)

    with console.status("[bold green]Proje analiz ediliyor, BOM oluşturuluyor ve mağazalar taranıyor...[/bold green]"):
        report = agent.run(prompt)

    # 1. Proje Gereksinimleri
    console.print("\n[bold yellow]📌 1. Proje Gereksinimleri[/bold yellow]")
    console.print(f" • [bold]Proje Tipi:[/bold] {report.project_requirements.project_type}")
    if report.project_requirements.power_source:
        console.print(f" • [bold]Güç Kaynağı:[/bold] {report.project_requirements.power_source}")
    if report.project_requirements.wireless_protocol:
        console.print(f" • [bold]Kablosuz Protokol:[/bold] {report.project_requirements.wireless_protocol}")

    # 2. Malzeme Listesi (BOM)
    console.print("\n[bold yellow]📦 2. Malzeme Listesi (BOM)[/bold yellow]")
    bom_table = Table(show_header=True, header_style="bold magenta")
    bom_table.add_column("Kategori")
    bom_table.add_column("Adet", justify="right")
    bom_table.add_column("Bileşen Adı")
    bom_table.add_column("Özellikler")

    for comp in report.bom.components:
        bom_table.add_row(comp.category, str(comp.quantity), comp.name, comp.specifications)
    console.print(bom_table)

    # 3. Uyumluluk Kontrolü
    console.print("\n[bold yellow]⚡ 3. Donanım Uyumluluk Raporu[/bold yellow]")
    if report.compatibility_report.is_compatible:
        console.print("[bold green]✓ Kritik donanım veya voltaj çakışması tespit edilmedi.[/bold green]")
    for issue in report.compatibility_report.issues:
        color = "red" if issue.severity.value == "error" else "yellow"
        console.print(f" [{color}][{issue.severity.value.upper()}][/{color}] {issue.description}")
        console.print(f"   └─ [bold green]Önerilen Çözüm:[/bold green] {issue.suggested_fix}")

    # 4. Alışveriş Sepeti Optimizasyonu
    console.print("\n[bold yellow]🛒 4. Optimize Alışveriş Sepeti Tavsiyesi[/bold yellow]")
    console.print(f" Strateji: [bold cyan]{report.optimization_result.strategy}[/bold cyan]")
    console.print(f" Genel Toplam (Kargo Dahil): [bold green]{report.optimization_result.grand_total:.2f} TL[/bold green]\n")

    for sg in report.optimization_result.store_groups:
        console.print(
            f" [bold underline]Mağaza: {sg.store}[/bold underline] (Ürün: {sg.subtotal:.2f} TL | Kargo: {sg.shipping_cost:.2f} TL | Mağaza Toplamı: {sg.total:.2f} TL)"
        )
        for item in sg.items:
            console.print(f"   * {item.quantity}x [bold]{item.product_name}[/bold] - {item.unit_price:.2f} TL -> {item.url}")

    console.print(Panel(report.summary_markdown, title="📝 Özet Rapor", expand=False))


def main():
    app()


if __name__ == "__main__":
    main()
