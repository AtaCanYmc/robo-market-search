"""
Automated health check script for Robo Market Search scrapers.
Searches a baseline component (default: '10K direnç') across all 4 stores
and verifies DOM scraping / API integrity.
Exit code 0 on success, non-zero if any market fails.
"""

from __future__ import annotations

import sys
from robo_market_search.unified.client import UnifiedSearchClient


def run_health_check(query: str = "10K direnç") -> None:
    print(f"🏥 Running Scraper Health Check for baseline item: {query!r}...\n")
    client = UnifiedSearchClient(use_cache=False)  # Force fresh network requests

    stores = ["Robolink", "Robotistan", "Robo90", "Direncnet"]
    failures = []

    # Run unified search
    products = client.search(query=query, limit_per_store=5)

    # Check store counts
    store_counts = {store: 0 for store in stores}
    for p in products:
        if p.store in store_counts:
            store_counts[p.store] += 1

    print("📊 Health Check Summary per Market:")
    print("-" * 40)
    for store in stores:
        count = store_counts[store]
        if count > 0:
            print(f"  ✅ {store:<12}: {count} products found")
        else:
            print(f"  ❌ {store:<12}: 0 products found (DOM/API failure suspected!)")
            failures.append(store)

    print("-" * 40)

    if failures:
        print(f"\n🚨 HEALTH CHECK FAILED: {len(failures)} store(s) failed -> {', '.join(failures)}")
        sys.exit(1)
    else:
        print("\n🎉 ALL MARKETS HEALTHY & RESPONSIVE!")
        sys.exit(0)


if __name__ == "__main__":
    baseline_query = sys.argv[1] if len(sys.argv) > 1 else "10K direnç"
    run_health_check(baseline_query)
