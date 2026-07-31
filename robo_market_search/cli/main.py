"""
Robo Market Search CLI entry point.
"""

from typing import Dict, List, Optional

from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn
from rich.table import Table
import typer

from robo_market_search.cart import cart_command, read_csv
from robo_market_search.unified.client import UnifiedSearchClient

app = typer.Typer(help="Robo Market Search CLI")
console = Console()

# Register cart subcommand
app.command(name="cart")(cart_command)

LOGO = r"""[bold cyan]
  ___      __          ____                 __
 | _ \___ | |__  ___  / __/___ ___ ________/ /
 |   / _ \| '_ \/ _ \_\ \/ -_) _ `/ __/ __/ _ \
 |_|_\___/|_.__/\___/___/\__/\_,_/_/  \__/_//_/
[/bold cyan]
    [dim]Türkiye'nin Elektronik Market Arama Motoru[/dim]
"""


def _show_logo():
    console.print(LOGO)


def _render_results_table(query: str, results: List, sort: bool):
    if not results:
        console.print(f"[bold yellow]Uyarı:[/bold yellow] '{query}' için marketlerde uygun ürün bulunamadı.")
        raise typer.Exit()

    if not sort:
        results.sort(key=lambda x: getattr(x, "title", ""))

    table = Table(title=f"\n'{query}' Arama Sonuçları", show_header=True, header_style="bold magenta", title_style="bold cyan")
    table.add_column("Ürün Adı", style="cyan", no_wrap=False)
    table.add_column("Market", style="green", justify="center")
    table.add_column("Fiyat", justify="right", style="bold yellow")
    table.add_column("Stok Durumu", justify="center")

    for item in results:
        in_stock = getattr(item, "in_stock", None)
        if in_stock:
            stok = "Var"
        elif in_stock is False:
            stok = "Yok"
        else:
            stok = "Bilinmiyor"

        stok_renkli = f"[green]{stok}[/green]" if "Var" in str(stok) else f"[red]{stok}[/red]"
        fiyat_text = f"{item.price:.2f} {getattr(item, 'currency', 'TL')}" if getattr(item, "price", None) else "Fiyat Yok"
        market_adi = getattr(item, "store", "Bilinmeyen")
        urun_adi = getattr(item, "name", "İsimsiz Ürün")

        table.add_row(urun_adi, market_adi, fiyat_text, stok_renkli)

    console.print(table)
    console.print(f"\n[dim]Toplam {len(results)} ürün listelendi.[/dim]")


@app.command()
def search(
    query: str = typer.Argument("", help="Aranacak ürün veya parça adı"),
    csv: Optional[str] = typer.Option(None, "--csv", help="CSV dosyasından ürün listesi okur (her satır bir ürün)"),
    sort: bool = typer.Option(True, "--sort/--no-sort", help="Sonuçları en ucuzdan en pahalıya sırala (Varsayılan: Evet)"),
    limit: int = typer.Option(10, "--limit", help="Market başına getirilecek sonuç sayısı"),
):
    """
    Belirtilen anahtar kelimeyle Türkiye'nin popüler elektronik ve robotik marketlerinde eşzamanlı arama yapar.
    Örn: robo-search "ESP32-WROOM" --limit 5
         robo-search --csv parcalar.csv
    """
    if csv:
        queries = read_csv(csv)
        if not queries:
            console.print("[bold red]CSV dosyasında ürün bulunamadı.[/bold red]")
            raise typer.Exit(code=1)
    elif query:
        queries = [query]
    else:
        console.print("[bold red]Bir ürün adı girin veya --csv ile dosya belirtin.[/bold red]")
        raise typer.Exit(code=1)

    _show_logo()
    client = UnifiedSearchClient()

    if csv:
        _run_csv_search(client, queries, limit, sort)
    else:
        _run_single_search(client, query, limit, sort)


def _run_single_search(client: UnifiedSearchClient, query: str, limit: int, sort: bool):
    results: List = []
    with Progress(
        SpinnerColumn(), TextColumn("[progress.description]{task.description}"), console=console, transient=True
    ) as progress:
        progress.add_task(description=f"[cyan]'{query}' marketlerde aranıyor...", total=None)
        try:
            results = client.search(query=query, limit_per_store=limit)
        except Exception as e:
            console.print(f"\n[bold red]Arama sırasında kritik bir hata oluştu:[/bold red] {e}")
            raise typer.Exit(code=1)
    _render_results_table(query, results, sort)


def _run_csv_search(client: UnifiedSearchClient, queries: List[str], limit: int, sort: bool):
    all_results: Dict[str, List] = {}
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("[cyan]Ürünler taranıyor...", total=len(queries))
        for q in queries:
            try:
                all_results[q] = client.search(query=q, limit_per_store=limit)
            except Exception:
                all_results[q] = []
            progress.advance(task)

    for q in queries:
        results = all_results.get(q, [])
        if not results:
            continue
        if sort:
            results.sort(key=lambda x: x.price)
        else:
            results.sort(key=lambda x: getattr(x, "title", ""))

        table = Table(
            title=f"\n[bold cyan]{q}[/bold cyan]",
            show_header=True,
            header_style="bold magenta",
            title_style="bold cyan",
        )
        table.add_column("Ürün Adı", style="cyan", no_wrap=False)
        table.add_column("Market", style="green", justify="center")
        table.add_column("Fiyat", justify="right", style="bold yellow")
        table.add_column("Stok Durumu", justify="center")

        for p in results:
            stok = "[green]Var[/green]" if p.in_stock else "[red]Yok[/red]"
            fiyat = f"{p.price:.2f} {p.currency}" if p.price else "Fiyat Yok"
            table.add_row(p.name, p.store, fiyat, stok)

        console.print(table)


if __name__ == "__main__":
    app()
