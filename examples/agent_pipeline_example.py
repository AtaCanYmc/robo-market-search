"""
Example 3: RoboMarketAgent usage with LLM provider injection.
"""

from robo_market_agent import RoboMarketAgent
from robo_market_agent.providers import MockLLMProvider  # or OpenAIProvider, GeminiProvider, etc.
from robo_market_service import SearchService


def main():
    # Inject mock LLM provider and search service
    llm = MockLLMProvider()
    service = SearchService(use_cache=True)
    agent = RoboMarketAgent(llm_provider=llm, search_service=service)

    project_desc = "I want to build an automatic irrigation system controlled over WiFi with 4 solenoids."
    print(f"=== Running Agent for Project: '{project_desc}' ===\n")

    report = agent.run(project_desc)

    print("--- 1. Project Requirements ---")
    print(f"Type: {report.project_requirements.project_type}")
    print(f"Protocol: {report.project_requirements.wireless_protocol}")

    print("\n--- 2. Bill of Materials (BOM) ---")
    for comp in report.bom.components:
        print(f" - [{comp.category}] {comp.quantity}x {comp.name} ({comp.specifications})")

    print("\n--- 3. Compatibility Report ---")
    print(f"Compatible: {report.compatibility_report.is_compatible}")
    for issue in report.compatibility_report.issues:
        print(f" [{issue.severity.value.upper()}] {issue.description}")
        print(f" Fix: {issue.suggested_fix}")

    print("\n--- 4. Shopping Optimization ---")
    print(f"Strategy: {report.optimization_result.strategy}")
    print(f"Grand Total: {report.optimization_result.grand_total:.2f} TL")
    for sg in report.optimization_result.store_groups:
        print(f" Store: {sg.store} | Subtotal: {sg.subtotal:.2f} TL | Shipping: {sg.shipping_cost:.2f} TL")
        for item in sg.items:
            print(f"   * {item.quantity}x {item.product_name} - {item.unit_price:.2f} TL [{item.store}]")

    print("\n--- 5. Summary Markdown ---")
    print(report.summary_markdown[:300] + "...\n")


if __name__ == "__main__":
    main()
