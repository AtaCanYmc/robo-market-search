"""
Example 2: SearchService usage (Parallelism, Deduplication, Cache, Synonyms)
"""

from robo_market_service import SearchService, ServiceSearchRequest


def main():
    service = SearchService(use_cache=True)

    print("=== SearchService single query with synonym expansion ===")
    req = ServiceSearchRequest(query="solenoid valve", limit_per_store=3, expand_synonyms=True)
    res = service.search_single(req)
    print(f"Total found: {res.total_found} across queries: {res.expanded_queries}")
    for p in res.products[:5]:
        print(f"[{p.store}] {p.name} - {p.price} TL")

    print("\n=== SearchService concurrent multi-component search ===")
    queries = ["ESP32 DevKit", "4 Channel Relay", "12V Power Supply"]
    results_map = service.search_concurrent(queries, limit_per_store=2)
    for q, srv_res in results_map.items():
        print(f"\nQuery: {q} (Found: {srv_res.total_found})")
        for p in srv_res.products[:2]:
            print(f"  - [{p.store}] {p.name} ({p.price} TL)")


if __name__ == "__main__":
    main()
