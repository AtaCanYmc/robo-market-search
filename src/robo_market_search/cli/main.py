"""
Robo Market Search CLI entry point.
Türkiye'nin popüler elektronik ve robotik marketlerinde eşzamanlı arama motoru.
"""

import json
import sys
from typing import Dict, List, Optional

from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn
from rich.prompt import Prompt
from rich.table import Table
import typer

from robo_market_search.cart import cart_command, read_csv
from robo_market_search.unified.client import UnifiedSearchClient

try:
    from importlib.metadata import version as _get_version

    CLI_VERSION = _get_version("robo-market-search")
except Exception:
    CLI_VERSION = "1.12.0"  # x-release-please-version

app = typer.Typer(
    help="Robo Market Search: Türkiye'nin Elektronik Market Arama Motoru",
    add_completion=True,
    no_args_is_help=False,
)
console = Console()

# Register cart subcommand
app.command(name="cart")(cart_command)

STORE_STYLES: Dict[str, Dict[str, str]] = {
    "robotistan": {"badge": "[bold #E63946]● Robotistan[/bold #E63946]"},
    "robolink": {"badge": "[bold #457B9D]● Robolink[/bold #457B9D]"},
    "robo90": {"badge": "[bold #2A9D8F]● Robo90[/bold #2A9D8F]"},
    "direncnet": {"badge": "[bold #E76F51]● Direnç.net[/bold #E76F51]"},
    "ozdisan": {"badge": "[bold #0077B6]● Özdisan[/bold #0077B6]"},
    "motorobit": {"badge": "[bold #F4A261]● Motorobit[/bold #F4A261]"},
}


def _format_store_badge(store_name: str) -> str:
    key = (store_name or "").lower().replace(".", "").replace("ç", "c").strip()
    for k, v in STORE_STYLES.items():
        if k in key:
            return v["badge"]
    return f"[bold magenta]● {store_name}[/bold magenta]"


def _format_price(price: Optional[float], currency: str = "TL") -> str:
    if price is None or price <= 0:
        return "[dim]Fiyat Yok[/dim]"
    curr_symbol = "₺" if currency in ("TL", "TRY") else f" {currency}"
    return f"{curr_symbol}{price:,.2f}"


def _format_stock(in_stock: Optional[bool]) -> str:
    if in_stock is True:
        return "[bold green]✓ Stokta[/bold green]"
    elif in_stock is False:
        return "[dim red]✗ Tükendi[/dim red]"
    return "[dim]Bilinmiyor[/dim]"


def _show_banner():
    banner = Panel(
        r"""[bold cyan]  ___      __          ____                 __  [/bold cyan]
[bold cyan] | _ \___ | |__  ___  / __/___ ___ ________/ /  [/bold cyan]
[bold cyan] |   / _ \| '_ \/ _ \_\ \/ -_) _ `/ __/ __/ _ \ [/bold cyan]
[bold cyan] |_|_\___/|_.__/\___/___/\__/\_,_/_/  \__/_//_/ [/bold cyan]

[bold white]Türkiye'nin Elektronik Market Arama Motoru[/bold white] [dim]• v"""
        + CLI_VERSION
        + r"""[/dim]
[dim]Mağazalar: [bold #E63946]Robotistan[/] · [bold #457B9D]Robolink[/] · [bold #2A9D8F]Robo90[/] · [bold #E76F51]Direnç.net[/] · [bold #0077B6]Özdisan[/] · [bold #F4A261]Motorobit[/][/dim]""",
        box=box.ROUNDED,
        border_style="cyan",
        padding=(0, 2),
    )
    console.print(banner)


def _render_results_table(
    query: str,
    results: List,
    sort: bool,
    stock_only: bool = False,
    store_filter: Optional[str] = None,
    as_json: bool = False,
    as_markdown: bool = False,
):
    # Filter by store if requested
    if store_filter:
        s_filter = store_filter.lower().replace(".", "").replace("ç", "c")
        results = [r for r in results if s_filter in getattr(r, "store", "").lower().replace(".", "").replace("ç", "c")]

    # Filter by stock if requested
    if stock_only:
        results = [r for r in results if getattr(r, "in_stock", False)]

    if not results:
        console.print(f"\n[bold yellow]Uyarı:[/] '{query}' için kriterlere uygun ürün bulunamadı.")
        raise typer.Exit()

    # JSON export mode
    if as_json:
        serialized = [
            {
                "name": getattr(p, "name", ""),
                "price": getattr(p, "price", 0.0),
                "currency": getattr(p, "currency", "TL"),
                "store": getattr(p, "store", ""),
                "url": getattr(p, "url", ""),
                "in_stock": getattr(p, "in_stock", False),
            }
            for p in results
        ]
        console.print(json.dumps(serialized, ensure_ascii=False, indent=2))
        return

    # Markdown export mode
    if as_markdown:
        console.print(f"### '{query}' Arama Sonuçları\n")
        console.print("| Ürün Adı | Mağaza | Fiyat | Stok | Link |")
        console.print("| :--- | :---: | ---: | :---: | :--- |")
        for p in results:
            stok_txt = "Stokta" if p.in_stock else "Tükendi"
            fiyat_txt = f"{p.price:.2f} TL" if p.price else "-"
            console.print(f"| {p.name} | {p.store} | {fiyat_txt} | {stok_txt} | [İncele]({p.url}) |")
        return

    # Sort results
    if sort:
        results.sort(key=lambda x: getattr(x, "price", 0.0) or float("inf"))
    else:
        results.sort(key=lambda x: getattr(x, "name", ""))

    # Find cheapest in-stock price
    in_stock_prices = [p.price for p in results if getattr(p, "in_stock", False) and getattr(p, "price", 0) > 0]
    min_in_stock = min(in_stock_prices) if in_stock_prices else None

    table = Table(
        title=f"\n[bold white]'{query}'[/bold white] Arama Sonuçları",
        show_header=True,
        header_style="bold cyan",
        title_style="bold cyan",
        box=box.ROUNDED,
        border_style="dim",
        row_styles=["none", "dim"],
    )
    table.add_column("Durum", justify="center", width=11)
    table.add_column("Mağaza", justify="left", width=16)
    table.add_column("Ürün Adı", style="white", no_wrap=False)
    table.add_column("Fiyat", justify="right", style="bold yellow", width=18)
    table.add_column("Link", justify="center", width=9)

    in_stock_count = 0
    out_of_stock_count = 0

    for item in results:
        in_stock = getattr(item, "in_stock", None)
        if in_stock:
            in_stock_count += 1
        else:
            out_of_stock_count += 1

        stok_badge = _format_stock(in_stock)
        raw_price = getattr(item, "price", None)
        fiyat_text = _format_price(raw_price, getattr(item, "currency", "TL"))

        # Highlight cheapest in-stock price
        if in_stock and raw_price and min_in_stock and raw_price == min_in_stock:
            fiyat_text = f"[bold green]{fiyat_text}[/] [bold green]★ EN UCUZ[/]"

        store_badge = _format_store_badge(getattr(item, "store", "Bilinmeyen"))
        urun_adi = getattr(item, "name", "İsimsiz Ürün")
        urun_url = getattr(item, "url", "")

        # Clickable terminal hyperlink for product name
        if urun_url:
            clean_title = urun_adi.replace("[", "(").replace("]", ")")
            urun_cell = f"[link={urun_url}]{clean_title}[/link]"
            link_cell = f"[link={urun_url}][blue underline]Aç ↗[/blue underline][/link]"
        else:
            urun_cell = urun_adi
            link_cell = "[dim]-[/dim]"

        table.add_row(stok_badge, store_badge, urun_cell, fiyat_text, link_cell)

    console.print(table)

    # Concise Summary Card
    summary_parts = [
        f'[bold cyan]🔍 Sorgu:[/] "{query}"',
        f"[bold cyan]📦 Toplam:[/] {len(results)} ürün",
        f"[bold green]🟢 Stokta:[/] {in_stock_count}",
        f"[bold red]🔴 Tükendi:[/] {out_of_stock_count}",
    ]
    if min_in_stock is not None:
        cheapest_p = next((p for p in results if getattr(p, "in_stock", False) and p.price == min_in_stock), None)
        if cheapest_p:
            summary_parts.append(f"[bold yellow]🏆 En Uygun:[/] [bold green]₺{min_in_stock:.2f}[/] ({cheapest_p.store})")

    console.print(
        Panel(
            "   ·   ".join(summary_parts),
            box=box.ROUNDED,
            border_style="cyan",
            padding=(0, 1),
        )
    )
    console.print(
        "[dim]İpucu: Terminaliniz destekliyorsa ürün adına veya 'Aç ↗' linkine tıklayarak mağazaya gidebilirsiniz.[/dim]\n"
    )


@app.command(name="version")
def version_command():
    """CLI sürümünü ve sistem bilgilerini görüntüler."""
    _show_banner()
    console.print(f"[bold cyan]Sürüm:[/] {CLI_VERSION}")
    console.print(
        "[bold cyan]GitHub:[/] [link=https://github.com/AtaCanYmc/robo-market-search]https://github.com/AtaCanYmc/robo-market-search[/link]"
    )
    console.print("[bold cyan]Homebrew:[/] [dim]brew install atacanymc/tap/robo-market-search[/dim]\n")


@app.command(name="search")
def search(
    query: str = typer.Argument("", help="Aranacak ürün veya parça adı (örn: ESP32-WROOM)"),
    csv: Optional[str] = typer.Option(None, "--csv", "-c", help="CSV dosyasından ürün listesi okur"),
    sort: bool = typer.Option(True, "--sort/--no-sort", help="Fiyata göre en ucuzdan sırala"),
    limit: int = typer.Option(10, "--limit", "-l", help="Market başına getirilecek maksimum sonuç sayısı"),
    stock_only: bool = typer.Option(False, "--stock-only", "-s", help="Yalnızca stokta bulunan ürünleri göster"),
    store: Optional[str] = typer.Option(
        None,
        "--store",
        "-m",
        help="Yalnızca belirli bir mağazayı filtrele (robotistan, robolink, robo90, direncnet, ozdisan, motorobit)",
    ),
    as_json: bool = typer.Option(False, "--json", help="Sonuçları JSON formatında yazdır"),
    as_markdown: bool = typer.Option(False, "--markdown", help="Sonuçları Markdown tablosu olarak yazdır"),
):
    """
    Belirtilen anahtar kelimeyle Robotistan, Robolink, Robo90, Direnç.net, Özdisan ve Motorobit mağazalarında eşzamanlı arama yapar.

    Örnekler:
      robo-search "ESP32-WROOM"
      robo-search "Arduino Uno" --limit 5 --stock-only
      robo-search "Relay 5V" --store robotistan
      robo-search --csv parcalar.csv
    """
    # Interactive prompt if query and csv are both empty
    if not query and not csv:
        _show_banner()
        query = Prompt.ask("[bold cyan]?[/bold cyan] Aranacak ürün veya parça adını girin").strip()
        if not query:
            console.print("[yellow]Arama iptal edildi.[/yellow]")
            raise typer.Exit()

    if not as_json and not as_markdown:
        _show_banner()

    client = UnifiedSearchClient()

    if csv:
        queries = read_csv(csv)
        if not queries:
            console.print("[bold red]Hata: CSV dosyasında ürün bulunamadı.[/bold red]")
            raise typer.Exit(code=1)
        _run_csv_search(client, queries, limit, sort, stock_only, store, as_json, as_markdown)
    else:
        _run_single_search(client, query, limit, sort, stock_only, store, as_json, as_markdown)


def _run_single_search(
    client: UnifiedSearchClient,
    query: str,
    limit: int,
    sort: bool,
    stock_only: bool,
    store: Optional[str],
    as_json: bool,
    as_markdown: bool,
):
    results: List = []
    if not as_json and not as_markdown:
        with Progress(
            SpinnerColumn(spinner_name="dots"),
            TextColumn("[progress.description]{task.description}"),
            console=console,
            transient=True,
        ) as progress:
            progress.add_task(description=f"[cyan]'{query}' marketlerde aranıyor...", total=None)
            try:
                results = client.search(query=query, limit_per_store=limit)
            except Exception as e:
                console.print(f"\n[bold red]Arama sırasında hata oluştu:[/bold red] {e}")
                raise typer.Exit(code=1)
    else:
        try:
            results = client.search(query=query, limit_per_store=limit)
        except Exception as e:
            console.print(f'{{"error": "{e}"}}' if as_json else f"Hata: {e}")
            raise typer.Exit(code=1)

    _render_results_table(query, results, sort, stock_only, store, as_json, as_markdown)


def _run_csv_search(
    client: UnifiedSearchClient,
    queries: List[str],
    limit: int,
    sort: bool,
    stock_only: bool,
    store: Optional[str],
    as_json: bool,
    as_markdown: bool,
):
    all_results: Dict[str, List] = {}
    with Progress(
        SpinnerColumn(spinner_name="dots"),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("[cyan]Toplu ürün araması yapılıyor...", total=len(queries))
        for q in queries:
            try:
                all_results[q] = client.search(query=q, limit_per_store=limit)
            except Exception:
                all_results[q] = []
            progress.advance(task)

    for q in queries:
        results = all_results.get(q, [])
        if results:
            _render_results_table(q, results, sort, stock_only, store, as_json, as_markdown)


def main():
    """
    CLI Entrypoint with smart subcommand auto-routing.
    Allows running `robo-search "ESP32"` directly without explicitly typing `search`.
    """
    if len(sys.argv) > 1:
        first_arg = sys.argv[1].lower()
        subcommands = {"search", "cart", "version", "--help", "-h", "--install-completion", "--show-completion"}
        if first_arg in ("--version", "-v"):
            version_command()
            return
        if first_arg not in subcommands and not first_arg.startswith("-"):
            sys.argv.insert(1, "search")

    app()


if __name__ == "__main__":
    main()
