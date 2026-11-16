"""
Custom exception hierarchy for robo_market_search.
"""

from typing import Optional


class RoboMarketError(Exception):
    """Base exception class for all robo_market_search errors."""

    def __init__(self, message: str, store: Optional[str] = None) -> None:
        super().__init__(message)
        self.message = message
        self.store = store

    def __str__(self) -> str:
        if self.store:
            return f"[{self.store}] {self.message}"
        return self.message


class NetworkError(RoboMarketError):
    """Raised when an HTTP or network connectivity error occurs."""

    pass


class StoreUnavailableError(NetworkError):
    """Raised when a store website or API endpoint is unreachable or down."""

    pass


class CaptchaDetectedError(NetworkError):
    """Raised when a bot protection/captcha (e.g. Cloudflare) challenge is encountered."""

    pass


class RateLimitError(NetworkError):
    """Raised when HTTP 429 Too Many Requests response is returned."""

    pass


class TimeoutError(NetworkError):
    """Raised when a network request times out."""

    pass


class ParsingError(RoboMarketError):
    """Raised when response HTML or JSON parsing fails."""

    pass
