import concurrent.futures
from typing import Dict, List, Optional, Tuple

from robo_market_search.shared.models import (
    Product,
    CartItemResult,
    StoreCartSummary,
    CartSearchResult,
    ShippingInfo,
    SplitAssignment,
    SplitStoreGroup,
    SplitCombination,
)
from robo_market_search.robolink.client import RobolinkClient
from robo_market_search.robotistan.client import RobotistanClient
from robo_market_search.robo90.client import Robo90Client
from robo_market_search.direncnet.client import DirencnetClient


STORE_NAMES = ["Robolink", "Robotistan", "Robo90", "Direncnet"]

# Sensible default shipping estimates for Turkish electronics stores.
# flat_rate = default shipping cost, free_shipping_min = free over this amount.
SHIPPING_DEFAULTS: Dict[str, ShippingInfo] = {
    "Robolink":    ShippingInfo(flat_rate=39.90, free_shipping_min=250.0),
    "Robotistan":  ShippingInfo(flat_rate=34.90, free_shipping_min=200.0),
    "Robo90":      ShippingInfo(flat_rate=39.90, free_shipping_min=300.0),
    "Direncnet":   ShippingInfo(flat_rate=29.90, free_shipping_min=200.0),
}


class UnifiedSearchClient:
    """
    Tüm marketlerde (Robolink, Robotistan, Robo90, Direncnet) eşzamanlı arama yapar.
    """
    def __init__(self):
        self.robolink = RobolinkClient()
        self.robotistan = RobotistanClient()
        self.robo90 = Robo90Client()
        self.direncnet = DirencnetClient()

    def search(self, query: str, limit_per_store: int = 10) -> List[Product]:
        """
        Arama kelimesini alıp tüm marketlere paralel (Thread) olarak sorar.
        Gelen sonuçları birleştirip fiyata göre (ucuzdan pahalıya) sıralar.
        """
        results: List[Product] = []

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_to_store = {
                executor.submit(self.robolink.search_component, query, limit_per_store): "Robolink",
                executor.submit(self.robotistan.search_component, query, limit_per_store, 1): "Robotistan",
                executor.submit(self.robo90.search_component, query, 1, 1): "Robo90",
                executor.submit(self.direncnet.search_component, query, limit_per_store): "Direncnet"
            }

            for future in concurrent.futures.as_completed(future_to_store):
                store_name = future_to_store[future]
                try:
                    store_results = future.result()

                    if store_name == "Robo90" and len(store_results) > limit_per_store:
                        store_results = store_results[:limit_per_store]

                    results.extend(store_results)
                except Exception as exc:
                    print(f"[HATA] {store_name} aramasında sorun oluştu: {exc}")

        results.sort(key=lambda x: x.price)
        return results

    @staticmethod
    def _compute_shipping(subtotal: float, info: ShippingInfo) -> float:
        return 0.0 if subtotal >= info.free_shipping_min else info.flat_rate

    def cart_search(
        self,
        queries: List[str],
        limit_per_store: int = 5,
        shipping_overrides: Optional[Dict[str, ShippingInfo]] = None,
    ) -> CartSearchResult:
        """
        Birden fazla ürün/parça için tüm marketlerde arama yapar,
        kargo ücretini hesaplar ve en ucuz kombinasyonu (tek market
        veya bölünmüş sipariş) bulur.

        queries:         Aranacak ürün/parça isimlerinin listesi.
        limit_per_store: Her sorgu için market başına sonuç sayısı.
        shipping_overrides: Varsayılan kargo bilgilerini geçersiz kılmak için.
        """
        shipping = dict(SHIPPING_DEFAULTS)
        if shipping_overrides:
            shipping.update(shipping_overrides)

        # ── 1. Her sorguyu tüm marketlerde ara ──────────────────────────
        all_results: Dict[str, List[Product]] = {}
        for q in queries:
            all_results[q] = self.search(query=q, limit_per_store=limit_per_store)

        # ── 2. Her market için en ucuz ürünleri bul ────────────────────
        # best_price[query][store] = cheapest Product
        best_price: Dict[str, Dict[str, Product]] = {}
        for q in queries:
            best_price[q] = {}
            seen = set()
            for p in all_results[q]:
                if p.store not in seen:
                    best_price[q][p.store] = p
                    seen.add(p.store)

        # ── 3. Tek-market özetleri (kargo dahil) ────────────────────────
        store_summaries: List[StoreCartSummary] = []
        for store_name in STORE_NAMES:
            items: List[CartItemResult] = []
            total = 0.0
            missing: List[str] = []

            for q in queries:
                prod = best_price[q].get(store_name)
                if prod:
                    items.append(CartItemResult(query=q, product=prod, price=prod.price, found=True))
                    total += prod.price
                else:
                    items.append(CartItemResult(query=q, found=False))
                    missing.append(q)

            info = shipping[store_name]
            shipping_cost = self._compute_shipping(total, info) if not missing else 0.0

            store_summaries.append(StoreCartSummary(
                store=store_name,
                items=items,
                total_price=total,
                shipping_cost=shipping_cost,
                total_with_shipping=total + shipping_cost,
                missing_items=missing,
                has_all_items=len(missing) == 0,
                free_shipping_min=info.free_shipping_min,
            ))

        stores_with_all = [s for s in store_summaries if s.has_all_items]
        cheapest_store = min(stores_with_all, key=lambda s: s.total_with_shipping) if stores_with_all else None

        # ── 4. Bölünmüş sipariş optimizasyonu (brute-force) ────────────
        #    Her ürünü hangi marketten alacağımızın tüm kombinasyonlarını
        #    dener, toplam (ürün + kargo) maliyeti en düşük olanı seçer.
        best_split = self._optimize_split(queries, best_price, shipping)

        return CartSearchResult(
            queries=queries,
            store_summaries=store_summaries,
            cheapest_store=cheapest_store,
            best_split=best_split,
        )

    @staticmethod
    def _eval_assignment(
        assignment: Dict[str, str],
        best_price: Dict[str, Dict[str, Product]],
        shipping: Dict[str, ShippingInfo],
    ) -> float:
        """Total cost (items + shipping) for a given item→store assignment."""
        store_items: Dict[str, List[str]] = {}
        for q, s in assignment.items():
            store_items.setdefault(s, []).append(q)

        total = 0.0
        for store, qs in store_items.items():
            subtotal = sum(best_price[q][store].price for q in qs)
            total += subtotal + shipping[store].cost(subtotal)
        return total

    @staticmethod
    def _build_split(
        assignment: Dict[str, str],
        best_price: Dict[str, Dict[str, Product]],
        shipping: Dict[str, ShippingInfo],
    ) -> SplitCombination:
        """Build SplitCombination result from an assignment dict."""
        groups: Dict[str, List[SplitAssignment]] = {}
        for q, store in assignment.items():
            prod = best_price[q][store]
            groups.setdefault(store, []).append(
                SplitAssignment(query=q, store=store, price=prod.price, product=prod)
            )
        group_list: List[SplitStoreGroup] = []
        grand = 0.0
        for store, assigns in groups.items():
            subtotal = sum(a.price for a in assigns)
            ship_info = shipping[store]
            ship = ship_info.cost(subtotal)
            total = subtotal + ship
            grand += total
            group_list.append(SplitStoreGroup(
                store=store,
                items=assigns,
                subtotal=subtotal,
                shipping=ship,
                total=total,
            ))
        return SplitCombination(groups=group_list, grand_total=grand)

    def _optimize_split(
        self,
        queries: List[str],
        best_price: Dict[str, Dict[str, Product]],
        shipping: Dict[str, ShippingInfo],
    ) -> Optional[SplitCombination]:
        """
        Kargo ücretini de dikkate alarak en ucuz bölünmüş siparişi bulur.

        Algoritma:
          1. Greedy başlangıç — her ürünü en ucuz olduğu markete ata.
          2. Konsolidasyon — bir marketteki tüm ürünleri başka bir markete
             taşımayı dene (kargo eşiğini aşmak için).
          3. Lokal iyileştirme — her ürünü tek tek diğer marketlere taşı.
          4. 2-3 arasında iyileşme kalmayana kadar tekrarla.

        M=4 market için O(M * N * K) — brüt kuvvetin O(M^N) yerine.
        """
        # Her ürün için hangi marketlerde bulunduğu
        item_options: List[Tuple[str, Dict[str, Product]]] = []
        for q in queries:
            if best_price[q]:
                item_options.append((q, best_price[q]))
            else:
                return None

        # ── 1. Greedy başlangıç ──────────────────────────────────────────
        assignment: Dict[str, str] = {}
        for q, stores in item_options:
            assignment[q] = min(stores, key=lambda s: stores[s].price)
        best_total = self._eval_assignment(assignment, best_price, shipping)

        # ── 2-4. Konsolidasyon + lokal iyileştirme ───────────────────────
        improved = True
        while improved:
            improved = False

            # 2a. Konsolidasyon: tüm ürünleri bir marketten diğerine taşı
            for src in STORE_NAMES:
                src_items = [q for q, _ in item_options if assignment.get(q) == src]
                if not src_items:
                    continue
                for dst in STORE_NAMES:
                    if dst == src:
                        continue
                    # dst'te tüm src_items mevcut mu?
                    if not all(dst in best_price[q] for q in src_items):
                        continue

                    candidate = dict(assignment)
                    for q in src_items:
                        candidate[q] = dst
                    total = self._eval_assignment(candidate, best_price, shipping)
                    if total < best_total:
                        best_total = total
                        assignment = candidate
                        improved = True

            # 2b. Lokal iyileştirme: her ürünü tek tek taşı
            for q, stores in item_options:
                for store in stores:
                    if store == assignment[q]:
                        continue
                    candidate = dict(assignment)
                    candidate[q] = store
                    total = self._eval_assignment(candidate, best_price, shipping)
                    if total < best_total:
                        best_total = total
                        assignment = candidate
                        improved = True

        return self._build_split(assignment, best_price, shipping)
