"""
Centralized HTTP Client for robo_market_search with TLS impersonation, retry handling, and error mapping.
"""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, Optional

from curl_cffi import requests

from robo_market_search.shared.exceptions import (
    CaptchaDetectedError,
    NetworkError,
    RateLimitError,
    StoreUnavailableError,
    TimeoutError,
)

logger = logging.getLogger("robo_market_search.http")

DEFAULT_TIMEOUT = 10
DEFAULT_MAX_RETRIES = 3
DEFAULT_BACKOFF_FACTOR = 0.5
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


class HTTPClient:
    """
    Unified HTTP client supporting impersonation, retries with exponential backoff,
    and automatic mapping to custom exceptions.
    """

    def __init__(
        self,
        timeout: int = DEFAULT_TIMEOUT,
        max_retries: int = DEFAULT_MAX_RETRIES,
        backoff_factor: float = DEFAULT_BACKOFF_FACTOR,
        impersonate: str = "safari15_5",
        default_headers: Optional[Dict[str, str]] = None,
    ) -> None:
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
        self.impersonate = impersonate
        self.default_headers = default_headers or {"User-Agent": DEFAULT_USER_AGENT}

    def request(
        self,
        method: str,
        url: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Any] = None,
        json: Optional[Any] = None,
        headers: Optional[Dict[str, str]] = None,
        store_name: Optional[str] = None,
        **kwargs: Any,
    ) -> requests.Response:
        """
        Execute an HTTP request with retry logic and error mapping.
        """
        req_headers = dict(self.default_headers)
        if headers:
            req_headers.update(headers)

        retries = 0
        last_exception: Optional[Exception] = None

        while retries <= self.max_retries:
            try:
                response = requests.request(
                    method=method.upper(),
                    url=url,
                    params=params,
                    data=data,
                    json=json,
                    headers=req_headers,
                    timeout=self.timeout,
                    impersonate=self.impersonate,
                    **kwargs,
                )

                status = response.status_code

                # Detect Bot Protection / Cloudflare challenge
                if status in (403, 503) and ("cloudflare" in response.text.lower() or "challenge" in response.text.lower()):
                    raise CaptchaDetectedError(f"Bot protection / Cloudflare challenge detected at {url}", store=store_name)

                if status == 429:
                    raise RateLimitError(f"Rate limited (HTTP 429) at {url}", store=store_name)

                if status >= 500:
                    raise StoreUnavailableError(f"Store server error (HTTP {status}) at {url}", store=store_name)

                response.raise_for_status()
                return response

            except (CaptchaDetectedError, RateLimitError, StoreUnavailableError) as err:
                last_exception = err
                retries += 1
                if retries <= self.max_retries:
                    sleep_time = self.backoff_factor * (2 ** (retries - 1))
                    logger.warning(
                        "Retry %d/%d for %s due to %s. Sleeping %.2fs", retries, self.max_retries, url, err, sleep_time
                    )
                    time.sleep(sleep_time)
                else:
                    raise err

            except requests.errors.Timeout:
                last_exception = TimeoutError(f"Request to {url} timed out", store=store_name)
                retries += 1
                if retries <= self.max_retries:
                    sleep_time = self.backoff_factor * (2 ** (retries - 1))
                    logger.warning("Timeout retry %d/%d for %s. Sleeping %.2fs", retries, self.max_retries, url, sleep_time)
                    time.sleep(sleep_time)
                else:
                    raise last_exception

            except requests.errors.RequestException as err:
                last_exception = NetworkError(f"Network error accessing {url}: {err}", store=store_name)
                retries += 1
                if retries <= self.max_retries:
                    sleep_time = self.backoff_factor * (2 ** (retries - 1))
                    logger.warning(
                        "Network error retry %d/%d for %s. Sleeping %.2fs", retries, self.max_retries, url, sleep_time
                    )
                    time.sleep(sleep_time)
                else:
                    raise last_exception

        if last_exception:
            raise last_exception
        raise NetworkError(f"Failed to fetch {url} after {self.max_retries} retries", store=store_name)

    def get(self, url: str, params: Optional[Dict[str, Any]] = None, **kwargs: Any) -> requests.Response:
        return self.request("GET", url, params=params, **kwargs)

    def post(self, url: str, data: Optional[Any] = None, json: Optional[Any] = None, **kwargs: Any) -> requests.Response:
        return self.request("POST", url, data=data, json=json, **kwargs)
