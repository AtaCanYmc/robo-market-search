"""
Automated health check script for Robo Market Search scrapers.
Tests multiple baseline components across all integrated stores (Robolink, Robotistan, Robo90, Direncnet),
verifying DOM scraping, network communication, and API integrity.
Outputs a structured summary table and diagnostic reasons for any failures.
"""

from __future__ import annotations

import logging
import sys
from typing import Dict, List

from curl_cffi import requests

from robo_market_search.unified.client import UnifiedSearchClient

DEFAULT_TEST_ITEMS = [
    "10K direnç",
    "ESP32",
    "Arduino Uno",
    "SG90",
]

STORES = ["Robolink", "Robotistan", "Robo90", "Direncnet"]


def probe_store_status(store_name: str) -> str:
    """Probes the store endpoint directly to diagnose root causes (WAF, HTTP errors, Cloudflare, DOM)."""
    try:
        if store_name == "Direncnet":
            r = requests.get(
                "https://www.direnc.net/arama?q=ESP32",
                headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"},
                impersonate="safari15_5",
                timeout=8,
            )
            if r.status_code == 403:
                return "HTTP 403 Forbidden: Cloudflare WAF / Datacenter IP engeli devrede"
            if "<title>Just a moment...</title>" in r.text or "Attention Required! | Cloudflare" in r.text or "cf-browser-verification" in r.text:
                return "Cloudflare Bot Koruması: JS Challenge / Turnstile sayfası döndü"
            if r.status_code != 200:
                return f"HTTP {r.status_code} ({r.reason}): Sunucu hata döndürdü"
            if "PRODUCT_DATA.push" not in r.text:
                return "HTTP 200 OK ancak 'PRODUCT_DATA.push' verisi DOM içinde bulunamadı (DOM değişmiş olabilir)"
            return "Mağaza erişilebilir, arama sorgusu sonuç döndürmedi"

        elif store_name == "Robo90":
            r = requests.get(
                "https://www.robo90.com/arama?q=ESP32",
                headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"},
                impersonate="safari15_5",
                timeout=8,
            )
            if r.status_code == 403:
                return "HTTP 403 Forbidden: WAF / Datacenter IP engeli devrede"
            if r.status_code != 200:
                return f"HTTP {r.status_code} ({r.reason}): Sunucu hata döndürdü"
            if "PRODUCT_DATA.push" not in r.text:
                return "HTTP 200 OK ancak 'PRODUCT_DATA.push' verisi DOM içinde bulunamadı"
            return "Mağaza erişilebilir, arama sorgusu sonuç döndürmedi"

        elif store_name == "Robolink":
            r = requests.get("https://www.robolinkmarket.com", impersonate="safari15_5", timeout=8)
            if r.status_code != 200:
                return f"HTTP {r.status_code} ({r.reason}): Robolink sunucusu hata döndürdü"
            return "Robolink API veya token ayrıştırma hatası"

        elif store_name == "Robotistan":
            r = requests.get("https://www.robotistan.com", impersonate="safari15_5", timeout=8)
            if r.status_code != 200:
                return f"HTTP {r.status_code} ({r.reason}): Robotistan sunucusu hata döndürdü"
            return "Robotistan Segmentify API veya token hatası"

    except Exception as e:
        return f"Bağlantı/Ağ Hatası: {e}"

    return "Bilinmeyen hata"


class LogCaptureHandler(logging.Handler):
    """Captures scraper ERROR logs to extract concrete diagnostic failure reasons."""

    def __init__(self) -> None:
        super().__init__()
        self.errors: Dict[str, List[str]] = {store: [] for store in STORES}

    def emit(self, record: logging.LogRecord) -> None:
        if record.levelno >= logging.ERROR:
            msg = record.getMessage()
            for store in STORES:
                if store.lower() in msg.lower() or record.name.lower().endswith(store.lower()):
                    self.errors[store].append(msg)


def run_health_check(items: List[str]) -> None:
    print(f"🏥 Running Scraper Health Check across {len(STORES)} stores for {len(items)} item(s):")
    for item in items:
        print(f"   • {item}")
    print()

    # Attach log capture handler to capture scraper errors
    capture_handler = LogCaptureHandler()
    root_scraper_logger = logging.getLogger("robo_market_search")
    root_scraper_logger.addHandler(capture_handler)

    client = UnifiedSearchClient(use_cache=False)  # Force fresh network requests

    # Results matrix: store -> query -> count
    results_matrix: Dict[str, Dict[str, int]] = {store: {} for store in STORES}
    item_diagnostics: Dict[str, Dict[str, str]] = {store: {} for store in STORES}

    for item in items:
        # Clear errors before query
        for store in STORES:
            capture_handler.errors[store].clear()

        products = client.search(query=item, limit_per_store=5)

        counts = {store: 0 for store in STORES}
        for p in products:
            if p.store in counts:
                counts[p.store] += 1

        for store in STORES:
            results_matrix[store][item] = counts[store]
            if counts[store] == 0:
                if capture_handler.errors[store]:
                    item_diagnostics[store][item] = "; ".join(capture_handler.errors[store])
                else:
                    item_diagnostics[store][item] = "Mağazada ürün listelenmedi veya arama eşleşmesi yok."

    root_scraper_logger.removeHandler(capture_handler)

    # For stores that completely failed (0 products across all queries), probe store directly if no specific error was captured
    for store in STORES:
        total = sum(results_matrix[store][item] for item in items)
        if total == 0:
            reasons = list(item_diagnostics[store].values())
            if not reasons or all(r == "Mağazada ürün listelenmedi veya arama eşleşmesi yok." for r in reasons):
                probe_reason = probe_store_status(store)
                for item in items:
                    item_diagnostics[store][item] = probe_reason

    # Print summary table
    print("📊 Health Check Summary per Market:")
    header = f"{'Mağaza':<14} | " + " | ".join(f"{item[:12]:<12}" for item in items) + " | Toplam | Durum"
    separator = "-" * len(header)
    print(separator)
    print(header)
    print(separator)

    failed_stores: List[str] = []

    for store in STORES:
        counts = [results_matrix[store][item] for item in items]
        total_found = sum(counts)
        counts_str = " | ".join(f"{c:<12}" for c in counts)

        # A store is considered healthy if it responds and returns products
        all_passed = all(c > 0 for c in counts)
        any_passed = any(c > 0 for c in counts)

        if all_passed:
            status = f"✅ Sağlıklı ({total_found} ürün)"
        elif any_passed:
            status = f"⚠️ Kısmi ({total_found} ürün)"
        else:
            status = "❌ Başarısız (0 ürün)"
            failed_stores.append(store)

        print(f"{store:<14} | {counts_str} | {total_found:<6} | {status}")

    print(separator)

    # Diagnostic reporting for errors or zero products
    has_diagnostics = any(bool(reasons) for reasons in item_diagnostics.values())
    if has_diagnostics:
        print("\n🔍 Hata & Teşhis Detayları:")
        for store in STORES:
            reasons = item_diagnostics[store]
            if reasons:
                print(f"  • {store}:")
                for query_name, reason in reasons.items():
                    print(f"    - '{query_name}': {reason}")

    if failed_stores:
        print(f"\n🚨 HEALTH CHECK FAILED: {len(failed_stores)} store(s) completely failed -> {', '.join(failed_stores)}")
        sys.exit(1)
    else:
        print("\n🎉 ALL MARKETS HEALTHY & RESPONSIVE!")
        sys.exit(0)


if __name__ == "__main__":
    queries = sys.argv[1:] if len(sys.argv) > 1 else DEFAULT_TEST_ITEMS
    run_health_check(queries)
