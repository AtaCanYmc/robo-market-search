import typer
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

from robo_market_search.unified.client import UnifiedSearchClient

app = typer.Typer(help="Robo Market Search CLI")
console = Console()


@app.command()
def search(
        query: str = typer.Argument(..., help="Aranacak ürün veya parça adı"),
        sort: bool = typer.Option(True, "--sort/--no-sort",
                                  help="Sonuçları en ucuzdan en pahalıya sırala (Varsayılan: Evet)"),
        limit: int = typer.Option(10, "--limit", help="Market başına getirilecek sonuç sayısı")
):
    """
    Belirtilen anahtar kelimeyle Türkiye'nin popüler elektronik ve robotik marketlerinde eşzamanlı arama yapar.
    Örn: robo-search "ESP32-WROOM" --limit 5
    """
    client = UnifiedSearchClient()
    results = []

    logo = r"""[bold cyan]
  ___      __          ____                 __  
 | _ \___ | |__  ___  / __/___ ___ ________/ /  
 |   / _ \| '_ \/ _ \_\ \/ -_) _ `/ __/ __/ _ \ 
 |_|_\___/|_.__/\___/___/\__/\_,_/_/  \__/_//_/ 
[/bold cyan]
    [dim]Türkiye'nin Elektronik Market Arama Motoru[/dim]
"""
    console.print(logo)

    with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
            transient=True
    ) as progress:
        progress.add_task(description=f"[cyan]'{query}' marketlerde aranıyor...", total=None)
        try:
            results = client.search(query=query, limit_per_store=limit)
        except Exception as e:
            console.print(f"\n[bold red]Arama sırasında kritik bir hata oluştu:[/bold red] {e}")
            raise typer.Exit(code=1)

    if not results:
        console.print(f"[bold yellow]Uyarı:[/bold yellow] '{query}' için marketlerde uygun ürün bulunamadı.")
        raise typer.Exit()

    if not sort:
        results.sort(key=lambda x: getattr(x, 'title', ''))

    table = Table(
        title=f"\n'{query}' Arama Sonuçları",
        show_header=True,
        header_style="bold magenta",
        title_style="bold cyan"
    )
    table.add_column("Ürün Adı", style="cyan", no_wrap=False)
    table.add_column("Market", style="green", justify="center")
    table.add_column("Fiyat", justify="right", style="bold yellow")
    table.add_column("Stok Durumu", justify="center")

    for item in results:
        stok = getattr(item, "stock_status", "Bilinmiyor")

        stok_renkli = f"[green]{stok}[/green]" if "Var" in str(stok) or stok == True else f"[red]{stok}[/red]"
        fiyat_text = f"{item.price:.2f} TL" if getattr(item, "price", None) else "Fiyat Yok"
        market_adi = getattr(item, "market_name", "Bilinmeyen")
        urun_adi = getattr(item, "title", "İsimsiz Ürün")

        table.add_row(urun_adi, market_adi, fiyat_text, stok_renkli)

    console.print(table)
    console.print(f"\n[dim]Toplam {len(results)} ürün listelendi.[/dim]")


if __name__ == "__main__":
    app()
