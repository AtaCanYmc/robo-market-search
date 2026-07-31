"""
API v1 Router package exports.
"""

from fastapi import APIRouter

from robo_market_api.app.api.v1.agent import router as agent_router
from robo_market_api.app.api.v1.health import router as health_router
from robo_market_api.app.api.v1.optimize import router as optimize_router
from robo_market_api.app.api.v1.providers import router as providers_router
from robo_market_api.app.api.v1.search import router as search_router

v1_router = APIRouter()
v1_router.include_router(health_router)
v1_router.include_router(search_router)
v1_router.include_router(providers_router)
v1_router.include_router(optimize_router)
v1_router.include_router(agent_router)

__all__ = ["v1_router"]
