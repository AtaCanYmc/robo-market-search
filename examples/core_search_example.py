"""
Example 1: Core robo_market_search usage (Zero AI dependencies)
"""

from robo_market_search import search, search_multiple, search_provider


def main():
    print("=== Searching across all stores for 'ESP32' ===")
    results = search("ESP32", limit=3)
    for p in results[:5]:
        print(f"[{p.store}] {p.name} - {p.price} TL -> {p.url}")

    print("\n=== Single Store Provider Search ===")
    robotistan_results = search_provider("robotistan", "Relay", limit=2)
    for p in robotistan_results:
        print(f"[{p.store}] {p.name} - {p.price} TL")


if __name__ == "__main__":
    main()
