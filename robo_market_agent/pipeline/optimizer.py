"""
Step 6: Shopping Cart Optimizer Step
Calculates single-store vs split-store shopping recommendation based on price, shipping rates, and store availability.
"""

from typing import List

from robo_market_agent.models.agent_models import (
    ComponentSearchResult,
    OptimizationResult,
    ShoppingCartItem,
    StoreGroup,
)
from robo_market_agent.pipeline.base import BasePipelineStep
from robo_market_agent.providers.base import BaseLLMProvider
from robo_market_service.search_service import SearchService


class ShoppingOptimizerStep(BasePipelineStep[List[ComponentSearchResult], OptimizationResult]):
    """
    Step 6: Optimize shopping cart considering store availability, total product costs, and shipping rates.
    """

    def __init__(self, llm_provider: BaseLLMProvider, search_service: SearchService):
        super().__init__(llm_provider)
        self.search_service = search_service

    def execute(self, input_data: List[ComponentSearchResult]) -> OptimizationResult:
        queries = [item.component.name for item in input_data]
        cart_res = self.search_service.cart_search(queries, limit_per_store=5)

        # Check if single store option covers all items
        best_single = cart_res.cheapest_store
        best_split = cart_res.best_split

        if (
            best_single
            and best_single.has_all_items
            and (not best_split or best_single.total_with_shipping <= best_split.grand_total)
        ):
            # Single store recommendation
            single_items: List[ShoppingCartItem] = []
            for cart_item in best_single.items:
                if cart_item.product:
                    comp_name = cart_item.query
                    qty = 1
                    for item_sr in input_data:
                        if item_sr.component.name == comp_name:
                            qty = item_sr.component.quantity
                            break
                    single_items.append(
                        ShoppingCartItem(
                            component_name=comp_name,
                            quantity=qty,
                            product_name=cart_item.product.name,
                            store=best_single.store,
                            unit_price=cart_item.product.price,
                            total_price=cart_item.product.price * qty,
                            url=cart_item.product.url,
                        )
                    )
            sg = StoreGroup(
                store=best_single.store,
                items=single_items,
                subtotal=best_single.total_price,
                shipping_cost=best_single.shipping_cost,
                total=best_single.total_with_shipping,
            )
            return OptimizationResult(
                strategy=f"Single Store ({best_single.store})",
                store_groups=[sg],
                grand_total=best_single.total_with_shipping,
                total_shipping=best_single.shipping_cost,
                missing_components=[],
                recommendation_notes=f"All items found at {best_single.store} with single shipment.",
            )

        elif best_split:
            # Split store recommendation
            store_groups: List[StoreGroup] = []
            total_ship = 0.0
            for grp in best_split.groups:
                split_items: List[ShoppingCartItem] = []
                for assign in grp.items:
                    comp_name = assign.query
                    qty = 1
                    for item_sr in input_data:
                        if item_sr.component.name == comp_name:
                            qty = item_sr.component.quantity
                            break
                    split_items.append(
                        ShoppingCartItem(
                            component_name=comp_name,
                            quantity=qty,
                            product_name=assign.product.name,
                            store=assign.store,
                            unit_price=assign.price,
                            total_price=assign.price * qty,
                            url=assign.product.url,
                        )
                    )
                total_ship += grp.shipping
                store_groups.append(
                    StoreGroup(
                        store=grp.store,
                        items=split_items,
                        subtotal=grp.subtotal,
                        shipping_cost=grp.shipping,
                        total=grp.total,
                    )
                )
            return OptimizationResult(
                strategy="Split Store Purchase",
                store_groups=store_groups,
                grand_total=best_split.grand_total,
                total_shipping=total_ship,
                missing_components=[],
                recommendation_notes="Optimized across multiple stores for lowest total cost including shipping fees.",
            )

        # Fallback greedy match per item
        fallback_items: List[ShoppingCartItem] = []
        missing: List[str] = []
        grand = 0.0
        for item_sr in input_data:
            if item_sr.matches:
                best = item_sr.matches[0]
                qty = item_sr.component.quantity
                fallback_items.append(
                    ShoppingCartItem(
                        component_name=item_sr.component.name,
                        quantity=qty,
                        product_name=best.name,
                        store=best.store,
                        unit_price=best.price,
                        total_price=best.price * qty,
                        url=best.url,
                    )
                )
                grand += best.price * qty
            else:
                missing.append(item_sr.component.name)

        sg = StoreGroup(
            store="Mixed",
            items=fallback_items,
            subtotal=grand,
            shipping_cost=0.0,
            total=grand,
        )
        return OptimizationResult(
            strategy="Best Effort Mixed",
            store_groups=[sg],
            grand_total=grand,
            total_shipping=0.0,
            missing_components=missing,
            recommendation_notes="Selected lowest price match per component.",
        )
