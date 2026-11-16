"""
robo_market_api package.

Production-ready REST API layer for robo-market-search, robo-market-service,
and robo-market-agent.
"""

from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("robo-market-search")
except PackageNotFoundError:
    __version__ = "1.11.0"  # x-release-please-version
