"""
Global exception handlers and custom error definitions.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from robo_market_api.app.core.logging import logger


class APIException(HTTPException):
    """
    Base API Exception class.
    """

    def __init__(self, status_code: int, message: str, error_code: str = "API_ERROR"):
        super().__init__(status_code=status_code, detail=message)
        self.message = message
        self.error_code = error_code


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register global exception handlers on FastAPI application instance.
    """

    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.message,
                "error": exc.error_code,
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": str(exc.detail),
                "error": f"HTTP_{exc.status_code}",
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        logger.warning(f"Validation error for path {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation error in request payload or parameters",
                "error": "VALIDATION_ERROR",
                "details": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "An internal server error occurred.",
                "error": "INTERNAL_SERVER_ERROR",
            },
        )
