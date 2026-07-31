"""
Middleware for request tracing, execution timing, and structured request logging.
"""

import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from robo_market_api.app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds X-Request-ID and X-Process-Time headers
    and logs request path, method, status, and duration.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start_time = time.time()

        logger.info(f"--> [{request_id}] {request.method} {request.url.path}")

        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.4f}s"

            logger.info(
                f"<-- [{request_id}] {request.method} {request.url.path} "
                f"Status: {response.status_code} Duration: {process_time:.4f}s"
            )
            return response
        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(f"x-- [{request_id}] {request.method} {request.url.path} Failed after {process_time:.4f}s: {exc}")
            raise
