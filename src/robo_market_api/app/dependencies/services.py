"""
Dependency injection providers for FastAPI endpoints.
"""

from robo_market_api.app.core.config import Settings, settings
from robo_market_api.app.services.agent_service import APIAgentService
from robo_market_api.app.services.search_service import APISearchService

# Singleton instances for services
_search_service_instance = APISearchService()
_agent_service_instance = APIAgentService()


def get_settings() -> Settings:
    """
    Dependency provider for application settings.
    """
    return settings


def get_search_service() -> APISearchService:
    """
    Dependency provider for APISearchService.
    """
    return _search_service_instance


def get_agent_service() -> APIAgentService:
    """
    Dependency provider for APIAgentService.
    """
    return _agent_service_instance
