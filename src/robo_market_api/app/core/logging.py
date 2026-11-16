"""
Structured logging configuration.
"""

import logging
import sys

from robo_market_api.app.core.config import settings


def setup_logging() -> None:
    """
    Configure application logging format and handler.
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # Silence overly verbose third party loggers if needed
    logging.getLogger("uvicorn.access").setLevel(log_level)


logger = logging.getLogger("robo_market_api")
