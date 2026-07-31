"""
CLI Cart optimization command module.
"""

import csv
from typing import Dict, List, Optional

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
import typer

from robo_market_search.shared.models import ShippingInfo
from robo_market_search.unified.client import UnifiedSearchClient

console = Console()


def parse_items(items: List[str]) -> List[str]:
    """Flatten and split comma-separated arguments into a list of queries."""
    parsed = []
    for item in items:
        for part in item.split(","):
            part = part.strip()
            if part:
                parsed.append(part)
    return parsed


def read_csv(path: str) -> List[str]:
    """Read a single-column CSV file, return non-empty rows as query list."""
    queries: List[str] = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        first = True
        for row in reader:
            if not row or not row[0].strip():
                continue
            val = row[0].strip()
            if first:
                first = False
                if val.lower() in (
                    "parça",
                    "part",
                    "ürün",
                    "urun",
                    "item",
                    "name",
                    "product",
                    "query",
                    "malzeme",
                    "component",
                    "sku",
                ):
                    continue
            queries.append(val)
    return queries


def build_shipping_overrides(
    shipping_robolink: Optional[float],
    shipping_robotistan: Optional[float],
    shipping_robo90: Optional[float],
    shipping_direncnet: Optional[float],
    free_shipping_robolink: Optional[float],
    free_shipping_robotistan: Optional[float],
    free_shipping_robo90: Optional[float],
    free_shipping_direncnet: Optional[float],
) -> Optional[Dict[str, ShippingInfo]]:
    """Build shipping info overrides map."""
    overrides: Dict[str, ShippingInfo] = {}
    pairs = [
        ("Robolink", shipping_robolink, free_shipping_robolink),
        ("Robotistan", shipping_robotistan, free_shipping_robotistan),
        ("Robo90", shipping_robo90, free_shipping_robo90),
        ("Direncnet", shipping_direncnet, free_shipping_direncnet),
    ]
    for name, flat, free_min in pairs:
        if flat is not None or free_min is not None:
            overrides[name] = ShippingInfo(
                flat_rate=flat if flat is not None else 0.0,
                free_shipping_min=free_min if free_min is not None else 0.0,
            )
    return overrides if overrides else None


def cart_command(
    items: List[str] = typer.Argument(None, help="Sepete eklenecek ürünlerin adları"),
    csv: Optional[str] = typer.Option(None, "--csv", help="CSV dosyasından ürün listesi okur (her satır bir ürün)"),
    limit: int = typer.Option(5, "--limit", help="Ürün başına market başına sonuç sayısı"),
    shipping_robolink: Optional[float] = typer.Option(None, "--shipping-robolink", help="Robolink kargo ücreti (TL)"),
    shipping_robotistan: Optional[float] = typer.Option(None, "--shipping-robotistan", help="Robotistan kargo ücreti (TL)"),
    shipping_robo90: Optional[float] = typer.Option(None, "--shipping-robo90", help="Robo90 kargo ücreti (TL)"),
    shipping_direncnet: Optional[float] = typer.Option(None, "--shipping-direncnet", help="Direncnet kargo ücreti (TL)"),
    free_shipping_robolink: Optional[float] = typer.Option(
        None, "--free-robolink", help="Robolink'te ücretsiz kargo sınırı (TL)"
    ),
    free_shipping_robotistan: Optional[float] = typer.Option(
        None, "--free-robotistan", help="Robotistan'da ücretsiz kargo sınırı (TL)"
    ),
    free_shipping_robo90: Optional[float] = typer.Option(None, "--free-robo90", help="Robo90'da ücretsiz kargo sınırı (TL)"),
    free_shipping_direncnet: Optional[float] = typer.Option(
        None, "--free-direncnet", help="Direncnet'te ücretsiz kargo sınırı (TL)"
    ),
):
    """
    Birden fazla ürünü sepete ekleyip en ucuz (kargo dahil) kombinasyonu bulur.
    Tek market veya bölünmüş sipariş olarak en ucuz yolu önerir.

    Örn: robo-search cart "arduino uno, raspberry pi 4, breadboard"
         robo-search cart "arduino uno" "raspberry pi 4" "breadboard"
         robo-search cart --csv sepet.csv
    """
    if csv:
        queries = read_csv(csv)
    elif items:
        queries = parse_items(items)
    else:
        console.print("[bold red]Ürün listesi girin veya --csv ile dosya belirtin.[/bold red]")
        raise typer.Exit(code=1)

    if len(queries) < 2:
        console.print('[bold red]En az 2 ürün belirtmelisiniz. Örn: robo-search cart "arduino uno" "raspberry pi"[/bold red]')
        raise typer.Exit(code=1)

    overrides = build_shipping_overrides(
        shipping_robolink,
        shipping_robotistan,
        shipping_robo90,
        shipping_direncnet,
        free_shipping_robolink,
        free_shipping_robotistan,
        free_shipping_robo90,
        free_shipping_direncnet,
    )

    console.print(Panel(f"[bold cyan]Sepet Karşılaştırması[/bold cyan]\n\n[dim]Aranan ürünler:[/dim] {', '.join(queries)}"))

    client = UnifiedSearchClient()
    result = None

    with Progress(
        SpinnerColumn(), TextColumn("[progress.description]{task.description}"), console=console, transient=True
    ) as progress:
        progress.add_task(description="[cyan]Tüm ürünler marketlerde aranıyor (kargo dahil)...", total=None)
        try:
            result = client.cart_search(
                queries=queries,
                limit_per_store=limit,
                shipping_overrides=overrides,
            )
        except Exception as e:
            console.print(f"\n[bold red]Arama sırasında kritik bir hata oluştu:[/bold red] {e}")
            raise typer.Exit(code=1)

    if not result:
        raise typer.Exit()

    # 1. Single Store Summary Tables
    for summary in result.store_summaries:
        has_items = any(i.found for i in summary.items)
        if not has_items:
            continue

        store_emoji = "✅" if summary.has_all_items else "⚠️"
        table = Table(
            title=f"\n{store_emoji} [bold]{summary.store}[/bold]",
            show_header=True,
            header_style="bold green",
            title_style="bold cyan",
            box=None,
        )
        table.add_column("Ürün", style="cyan")
        table.add_column("Fiyat", style="bold yellow", justify="right")

        for item in summary.items:
            if item.found:
                urun_adi = item.product.name if item.product else item.query
                table.add_row(urun_adi, f"{item.price:.2f} TL")
            else:
                table.add_row(f"[dim]{item.query} — bulunamadı[/dim]", "[red]—[/red]")

        table.add_section()
        table.add_row("Ara Toplam", f"{summary.total_price:.2f} TL")
        table.add_row("Kargo", f"{summary.shipping_cost:.2f} TL")
        if not summary.has_all_items:
            table.add_row("[bold]TOPLAM[/bold]", f"[bold]{summary.total_with_shipping:.2f} TL[/bold] [red](Eksik)[/red]")
        else:
            table.add_row("[bold]TOPLAM (kargo dahil)[/bold]", f"[bold]{summary.total_with_shipping:.2f} TL[/bold]")

        console.print(table)

    # 2. Optimal Split Cart Table
    if result.best_split:
        console.print()
        split_table = Table(
            title="\n📦 En Uygun Bölünmüş Sipariş",
            show_header=True,
            header_style="bold cyan",
            title_style="bold yellow",
            box=None,
        )
        split_table.add_column("Market", style="green")
        split_table.add_column("Ürün", style="cyan")
        split_table.add_column("Fiyat", style="bold yellow", justify="right")

        for group in result.best_split.groups:
            first = True
            for assign in group.items:
                market_cell = f"[bold]{group.store}[/bold]" if first else ""
                split_table.add_row(market_cell, assign.product.name, f"{assign.price:.2f} TL")
                first = False

            split_table.add_section()
            split_table.add_row("  [dim]Kargo[/dim]", "", f"[dim]{group.shipping:.2f} TL[/dim]")
            split_table.add_row(f"  [bold]{group.store} toplam[/bold]", "", f"[bold]{group.total:.2f} TL[/bold]")

        split_table.add_section()
        split_table.add_row("[bold]GENEL TOPLAM[/bold]", "", f"[bold]{result.best_split.grand_total:.2f} TL[/bold]")
        console.print(split_table)

    # 3. Cost Comparison Panel
    console.print()
    lines = []
    for s in result.store_summaries:
        if not s.has_all_items:
            continue
        label = f"  {s.store}:  {s.total_price:.2f} TL + {s.shipping_cost:.2f} TL kargo = [bold]{s.total_with_shipping:.2f} TL[/bold]"
        if s.store == (result.cheapest_store.store if result.cheapest_store else ""):
            label = f"[green]✅ {label}[/green]"
        lines.append(label)

    if result.best_split:
        split_label = (
            f"  {'✅ ' if not result.cheapest_store or result.best_split.grand_total < result.cheapest_store.total_with_shipping else '  '}"
            f"Bölünmüş sipariş: [bold]{result.best_split.grand_total:.2f} TL[/bold]"
        )
        lines.append("")
        lines.append(split_label)

    if lines:
        console.print(Panel("\n".join(lines), title="Maliyet Karşılaştırması", border_style="blue"))

    # 4. Recommendation Panel
    label, best_total = result.best_overall()
    if label:
        console.print(
            Panel(
                f"[bold green]En ucuz seçenek: {label} — toplam {best_total:.2f} TL[/bold green]",
                title="Öneri",
                border_style="green",
            )
        )
    else:
        console.print(
            Panel(
                "[bold yellow]⚠️ Hiçbir market tüm ürünleri stoklarında bulundurmuyor.\n"
                "Yukarıdaki tablolardan kısmi alışveriş yapabilirsiniz.[/bold yellow]",
                title="Uyarı",
                border_style="yellow",
            )
        )
