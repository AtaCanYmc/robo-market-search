from dataclasses import dataclass, field
from typing import List, Optional, Tuple


@dataclass
class Product:
    name: str
    price: float
    currency: str
    url: str
    store: str
    image_url: str = ""
    in_stock: bool = True


@dataclass
class ShippingInfo:
    flat_rate: float = 0.0
    free_shipping_min: float = 0.0

    def cost(self, subtotal: float) -> float:
        return 0.0 if subtotal >= self.free_shipping_min else self.flat_rate


@dataclass
class CartItemResult:
    """Best price found for a single query/item in a specific store."""
    query: str
    product: Optional[Product] = None
    price: float = 0.0
    found: bool = False


@dataclass
class StoreCartSummary:
    """Breakdown of all items in a single store."""
    store: str
    items: List[CartItemResult]
    total_price: float = 0.0
    shipping_cost: float = 0.0
    total_with_shipping: float = 0.0
    missing_items: List[str] = field(default_factory=list)
    has_all_items: bool = False
    free_shipping_min: float = 0.0


@dataclass
class SplitAssignment:
    """One item→store assignment in a split purchase."""
    query: str
    store: str
    price: float
    product: Product


@dataclass
class SplitStoreGroup:
    """Group of items bought from the same store in a split."""
    store: str
    items: List[SplitAssignment]
    subtotal: float = 0.0
    shipping: float = 0.0
    total: float = 0.0


@dataclass
class SplitCombination:
    """A complete split-purchase plan covering all items."""
    groups: List[SplitStoreGroup]
    grand_total: float = 0.0


@dataclass
class CartSearchResult:
    """Overall cart search result across all stores."""
    queries: List[str]
    store_summaries: List[StoreCartSummary]
    cheapest_store: Optional[StoreCartSummary] = None
    best_split: Optional[SplitCombination] = None

    def best_overall(self) -> Tuple[str, float]:
        """Return (label, total) for the cheapest option overall (single or split)."""
        best_total = float("inf")
        best_label = ""

        for s in self.store_summaries:
            if s.has_all_items and s.total_with_shipping < best_total:
                best_total = s.total_with_shipping
                best_label = f"{s.store} (tek market)"

        if self.best_split and self.best_split.grand_total < best_total:
            best_total = self.best_split.grand_total
            best_label = "bölünmüş sipariş"

        return best_label, best_total
