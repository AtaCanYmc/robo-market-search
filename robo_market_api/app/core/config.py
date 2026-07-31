"""
Application configuration management using environment variables.
"""

from typing import List

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    # Fallback if pydantic_settings is not installed directly
    from pydantic import BaseModel as BaseSettings  # type: ignore

    SettingsConfigDict = None  # type: ignore


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    API_TITLE: str = "Robo Market Search REST API"
    API_DESCRIPTION: str = (
        "Production-ready HTTP REST API providing unified hardware component search, "
        "store price comparison, cart optimization, and AI agent integration for Turkish electronics market."
    )
    API_VERSION: str = "1.3.0"
    API_V1_PREFIX: str = "/api/v1"

    CORS_ORIGINS: List[str] = ["*"]

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            case_sensitive=True,
            extra="ignore",
        )


settings = Settings()
