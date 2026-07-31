"""
Pydantic Response Schemas.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """
    Health check response.
    """

    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    version: str = Field(default="1.3.0", json_schema_extra={"example": "1.3.0"})


class ProductModel(BaseModel):
    """
    Standard product item response model.
    """

    title: str = Field(
        ..., description="Product title / name", json_schema_extra={"example": "ESP32 WiFi + Bluetooth Geliştirme Kartı"}
    )
    price: float = Field(..., description="Product price in TRY", json_schema_extra={"example": 145.50})
    formatted_price: Optional[str] = Field(
        default=None, description="Formatted price string", json_schema_extra={"example": "145,50 TL"}
    )
    url: str = Field(
        ...,
        description="Direct store product URL",
        json_schema_extra={"example": "https://www.robotistan.com/esp32-wifi-bluetooth"},
    )
    image_url: Optional[str] = Field(default=None, description="Product image URL")
    store: str = Field(
        ...,
        description="Store provider identifier (robotistan, robolink, robo90, direncnet)",
        json_schema_extra={"example": "robotistan"},
    )
    in_stock: bool = Field(default=True, description="Stock availability flag")
    sku: Optional[str] = Field(default=None, description="Store SKU or product code")


class SearchResponse(BaseModel):
    """
    Standard search query response model.
    """

    success: bool = Field(default=True)
    query: str = Field(..., description="Query string searched")
    count: int = Field(..., description="Total products found")
    products: List[ProductModel] = Field(default_factory=list, description="List of matched products")


class BatchSearchResponse(BaseModel):
    """
    Batch search response model.
    """

    success: bool = Field(default=True)
    count: int = Field(..., description="Total queries processed")
    results: Dict[str, List[ProductModel]] = Field(default_factory=dict, description="Map of query to product list")


class ProviderInfo(BaseModel):
    """
    Metadata information for a supported store provider.
    """

    name: str = Field(..., json_schema_extra={"example": "robotistan"})
    display_name: str = Field(..., json_schema_extra={"example": "Robotistan"})
    base_url: str = Field(..., json_schema_extra={"example": "https://www.robotistan.com"})
    status: str = Field(default="active", json_schema_extra={"example": "active"})


class ProviderListResponse(BaseModel):
    """
    Response containing supported store providers.
    """

    success: bool = Field(default=True)
    count: int = Field(..., json_schema_extra={"example": 4})
    providers: List[ProviderInfo] = Field(default_factory=list)


class ProviderSearchResponse(BaseModel):
    """
    Search response targeting a specific provider.
    """

    success: bool = Field(default=True)
    provider: str = Field(..., json_schema_extra={"example": "robotistan"})
    count: int = Field(..., json_schema_extra={"example": 5})
    products: List[ProductModel] = Field(default_factory=list)


class OptimizationResponse(BaseModel):
    """
    Cart optimization response model.
    """

    success: bool = Field(default=True)
    message: str = Field(default="Cart optimization completed")
    total_cost: Optional[float] = Field(default=None, description="Total optimized cart cost in TRY")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Detailed split cart distribution and shipping info")


class AgentResponse(BaseModel):
    """
    AI Agent endpoint response model.
    """

    success: bool = Field(..., json_schema_extra={"example": True})
    message: str = Field(..., json_schema_extra={"example": "Analysis completed successfully"})
    data: Optional[Dict[str, Any]] = Field(default=None, description="AI agent analysis or BOM output")
    error: Optional[str] = Field(default=None, json_schema_extra={"example": None})


class ErrorResponse(BaseModel):
    """
    Standardized error response payload.
    """

    success: bool = Field(default=False, json_schema_extra={"example": False})
    message: str = Field(..., json_schema_extra={"example": "Invalid provider specified"})
    error: str = Field(..., json_schema_extra={"example": "INVALID_PROVIDER"})
    details: Optional[Any] = Field(default=None)
