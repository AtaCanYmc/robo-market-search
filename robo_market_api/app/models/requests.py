"""
Pydantic Request Schemas.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    """
    Search request payload for unified or multi-store product queries.
    """

    query: str = Field(
        ...,
        min_length=1,
        description="Product search keyword (e.g. 'ESP32-WROOM', 'Arduino Uno')",
        json_schema_extra={"example": "ESP32"},
    )
    limit: Optional[int] = Field(
        default=None,
        ge=1,
        le=100,
        description="Maximum number of results to return per store",
        json_schema_extra={"example": 5},
    )
    sort_by_price: bool = Field(
        default=True, description="Whether to sort results by price in ascending order", json_schema_extra={"example": True}
    )
    use_cache: bool = Field(
        default=True,
        description="Whether to utilize SQLite search cache in service layer",
        json_schema_extra={"example": True},
    )
    expand_synonyms: bool = Field(
        default=True, description="Whether to perform electronic term synonym expansion", json_schema_extra={"example": True}
    )


class BatchSearchRequest(BaseModel):
    """
    Batch search request payload for multiple products.
    """

    queries: List[str] = Field(
        ...,
        min_length=1,
        max_length=20,
        description="List of search queries",
        json_schema_extra={"example": ["ESP32", "Relay 5V", "OLED 0.96"]},
    )
    limit: Optional[int] = Field(
        default=5, ge=1, le=50, description="Max results per query per store", json_schema_extra={"example": 5}
    )


class ProviderSearchRequest(BaseModel):
    """
    Search request targeting a specific store provider.
    """

    query: str = Field(
        ..., min_length=1, description="Search term for the targeted store provider", json_schema_extra={"example": "ESP32"}
    )
    limit: Optional[int] = Field(
        default=None, ge=1, le=50, description="Maximum items to retrieve", json_schema_extra={"example": 5}
    )


class OptimizeRequest(BaseModel):
    """
    Cart optimization request for multiple components across stores.
    """

    items: List[str] = Field(
        ...,
        min_length=1,
        description="List of component names to purchase",
        json_schema_extra={"example": ["ESP32", "Relay 5V"]},
    )
    quantities: Optional[Dict[str, int]] = Field(
        default=None,
        description="Optional map of component quantities",
        json_schema_extra={"example": {"ESP32": 2, "Relay 5V": 1}},
    )


class AgentRequest(BaseModel):
    """
    AI Agent analysis or BOM generation request with Bring Your Own API Key (BYOK) support.
    """

    prompt: str = Field(
        ...,
        min_length=3,
        description="Natural language hardware requirement or project description",
        json_schema_extra={"example": "I want to build a smart plant watering system with WiFi."},
    )
    project_type: Optional[str] = Field(
        default=None, description="Optional project category", json_schema_extra={"example": "IoT / Smart Home"}
    )
    budget: Optional[float] = Field(default=None, description="Target budget in TRY", json_schema_extra={"example": 500.0})
    api_key: Optional[str] = Field(
        default=None,
        description="Bring Your Own API Key (OpenAI, Gemini, Anthropic, DeepSeek, Groq)",
        json_schema_extra={"example": "sk-proj-..."},
    )
    provider: Optional[str] = Field(
        default=None,
        description="LLM Provider choice: gemini, openai, anthropic, ollama, deepseek, groq, mock",
        json_schema_extra={"example": "openai"},
    )
    model_name: Optional[str] = Field(
        default=None,
        description="Optional model name override (e.g. gpt-4o, gemini-2.0-flash, claude-3-5-sonnet-20241022)",
        json_schema_extra={"example": "gpt-4o"},
    )
