"""
Pydantic data models for robo_market_agent.
Structured schema definitions for requirements, BOM, compatibility, optimization, and report generation.
"""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class IssueSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class ProjectRequirements(BaseModel):
    """Structured requirements extracted from user project description."""

    project_type: str = Field(description="Brief title/type of the project")
    description: str = Field(description="Summary of project goals and specifications")
    power_source: Optional[str] = Field(default=None, description="Required operating voltage or power supply type")
    wireless_protocol: Optional[str] = Field(default=None, description="e.g. WiFi, Bluetooth, LoRa, NRF24")
    key_features: List[str] = Field(default_factory=list, description="List of essential capabilities")
    constraints: List[str] = Field(default_factory=list, description="Constraints e.g., budget, size, waterproof")


class Component(BaseModel):
    """Individual Bill of Materials item."""

    name: str = Field(description="Searchable generic name of component e.g., ESP32 DevKit")
    quantity: int = Field(default=1, description="Quantity required")
    specifications: str = Field(default="", description="Key specs e.g., 12V, 4-channel, capacitive")
    is_optional: bool = Field(default=False, description="Whether item is optional or bonus")
    category: str = Field(default="general", description="Category e.g., MCU, Sensor, Actuator, Power, Connector")


class BOM(BaseModel):
    """Bill of Materials list for a project."""

    project_name: str = Field(description="Name of the project")
    components: List[Component] = Field(default_factory=list, description="List of components required")
    notes: Optional[str] = Field(default=None, description="General assembly or build notes")


class CompatibilityIssue(BaseModel):
    """Hardware compatibility warning or error."""

    severity: IssueSeverity = Field(description="Issue severity level")
    affected_components: List[str] = Field(description="Names of conflicting or missing components")
    description: str = Field(description="Explanation of the issue e.g., voltage mismatch")
    suggested_fix: str = Field(description="Recommended solution e.g., add a buck converter")


class CompatibilityReport(BaseModel):
    """Overall compatibility report."""

    is_compatible: bool = Field(description="True if no blocking error issues remain")
    issues: List[CompatibilityIssue] = Field(default_factory=list, description="List of warnings/errors")
    recommendations: List[str] = Field(default_factory=list, description="General design recommendations")


class SearchRequest(BaseModel):
    """Search request passed from Agent to SearchService."""

    component_name: str
    quantity: int = 1
    query: str


class MatchedProduct(BaseModel):
    name: str
    price: float
    store: str
    url: str
    in_stock: bool = True


class ComponentSearchResult(BaseModel):
    component: Component
    query_used: str
    matches: List[MatchedProduct] = Field(default_factory=list)


class ShoppingCartItem(BaseModel):
    component_name: str
    quantity: int
    product_name: str
    store: str
    unit_price: float
    total_price: float
    url: str


class StoreGroup(BaseModel):
    store: str
    items: List[ShoppingCartItem]
    subtotal: float
    shipping_cost: float
    total: float


class OptimizationResult(BaseModel):
    strategy: str = Field(description="e.g. 'Single Store' or 'Split Store'")
    store_groups: List[StoreGroup] = Field(default_factory=list)
    grand_total: float
    total_shipping: float
    missing_components: List[str] = Field(default_factory=list)
    recommendation_notes: str = ""


class FinalAgentReport(BaseModel):
    project_requirements: ProjectRequirements
    bom: BOM
    compatibility_report: CompatibilityReport
    optimization_result: OptimizationResult
    summary_markdown: str
