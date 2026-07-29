"""
Logport — Simple, lightweight search and analytics logger.
Sends search queries to background loggers/webhooks without blocking requests.
"""

from __future__ import annotations

import logging

logger = logging.getLogger("demo.logport")


class LogPort:
    """
    Kullanıcı arama sorgularını ve donanım tercihlerini loglayan lightweight logger.
    """

    def __init__(self, service_name: str = "robo-market-search") -> None:
        self.service_name = service_name

    def log_search(self, query: str, total_results: int = 0, store_filter: list[str] | None = None) -> None:
        """
        Arama sorgusunu güvenli (IP veya kişisel veri tutmadan) loglar.
        """
        stores_str = ",".join(store_filter) if store_filter else "all"
        logger.info(
            "📊 [LOGPORT] Service=%s | SearchQuery=%r | ResultsCount=%d | FilteredStores=%s",
            self.service_name,
            query,
            total_results,
            stores_str,
        )


# Global LogPort instance
logport = LogPort()
