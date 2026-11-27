"""Per-store circuit breaker."""

from __future__ import annotations

import threading
import time
from typing import Callable, Dict


class CircuitBreaker:
    """Closed until `failure_threshold` consecutive failures, then open for `reset_seconds`.

    After the timeout one probe call is allowed (half-open). Its outcome closes or reopens the circuit.
    """

    def __init__(
        self,
        failure_threshold: int = 3,
        reset_seconds: float = 60.0,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        self.failure_threshold = failure_threshold
        self.reset_seconds = reset_seconds
        self._clock = clock
        self._failures = 0
        self._opened_at: float | None = None
        self._probing = False
        self._lock = threading.Lock()

    def allow(self) -> bool:
        with self._lock:
            if self._opened_at is None:
                return True
            if self._probing or self._clock() - self._opened_at < self.reset_seconds:
                return False
            self._probing = True
            return True

    def record_success(self) -> None:
        with self._lock:
            self._failures, self._opened_at, self._probing = 0, None, False

    def record_failure(self) -> None:
        with self._lock:
            self._failures += 1
            if self._probing or self._failures >= self.failure_threshold:
                self._opened_at = self._clock()
            self._probing = False


_breakers: Dict[str, CircuitBreaker] = {}
_registry_lock = threading.Lock()


def get_breaker(store: str) -> CircuitBreaker:
    with _registry_lock:
        return _breakers.setdefault(store, CircuitBreaker())
