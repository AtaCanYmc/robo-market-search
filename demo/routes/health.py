"""
Health Check Endpoints (Docker, Kubernetes, Uptime Monitors).
"""

from __future__ import annotations

from fastapi import APIRouter, status

router = APIRouter(tags=["Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> dict[str, str]:
    """Docker & Kubernetes Health Check endpoint."""
    return {"status": "ok", "service": "robo-market-search-demo"}
