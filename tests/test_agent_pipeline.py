"""
End-to-end integration tests for RoboMarketAgent.
"""

from robo_market_agent import RoboMarketAgent
from robo_market_agent.models.agent_models import FinalAgentReport
from robo_market_agent.providers import MockLLMProvider
from robo_market_search.shared.models import Product
from robo_market_service import SearchService, ServiceSearchResult


def test_agent_end_to_end_pipeline(monkeypatch):
    mock_llm = MockLLMProvider()
    service = SearchService(use_cache=False)

    p1 = Product(name="ESP32 DevKit Board", price=120.0, currency="TL", url="http://test.com/esp32", store="Robotistan")
    p2 = Product(name="4 Channel Relay Board", price=85.0, currency="TL", url="http://test.com/relay", store="Robotistan")

    def mock_search_single(req):
        return ServiceSearchResult(
            query=req.query,
            products=[p1 if "esp32" in req.query.lower() else p2],
            expanded_queries=[req.query],
            total_found=1,
        )

    monkeypatch.setattr(service, "search_single", mock_search_single)

    agent = RoboMarketAgent(llm_provider=mock_llm, search_service=service)
    report = agent.run("I want to build a smart plant watering system over WiFi.")

    assert isinstance(report, FinalAgentReport)
    assert report.project_requirements.project_type == "Automated Irrigation System"
    assert len(report.bom.components) > 0
    assert report.compatibility_report.is_compatible is True
    assert len(report.optimization_result.store_groups) > 0
    assert len(report.summary_markdown) > 0
