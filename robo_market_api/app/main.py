"""
FastAPI application factory and server entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from robo_market_api.app.api.router import api_router
from robo_market_api.app.api.v1.health import router as root_health_router
from robo_market_api.app.core.config import settings
from robo_market_api.app.core.errors import register_exception_handlers
from robo_market_api.app.core.logging import setup_logging
from robo_market_api.app.middleware.logging import RequestLoggingMiddleware


def create_app() -> FastAPI:
    """
    Construct and configure FastAPI application instance.
    """
    setup_logging()

    app = FastAPI(
        title=settings.API_TITLE,
        description=settings.API_DESCRIPTION,
        version=settings.API_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request Logging & Tracing Middleware
    app.add_middleware(RequestLoggingMiddleware)

    # Global Exception Handlers
    register_exception_handlers(app)

    # Root level health endpoint
    app.include_router(root_health_router)

    # API Versioned Routers (/api/v1/...)
    app.include_router(api_router)

    return app


app = create_app()


def cli_main() -> None:
    """
    CLI command entry point for 'robo-api'.
    Runs Uvicorn web server.
    """
    import uvicorn

    uvicorn.run(
        "robo_market_api.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )


if __name__ == "__main__":
    cli_main()
