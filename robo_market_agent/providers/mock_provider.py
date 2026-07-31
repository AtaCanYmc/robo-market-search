"""
Mock Provider implementation for BaseLLMProvider.
Used for offline unit testing, deterministic mock behavior, and fallback execution.
"""

from typing import Any, Dict, Optional, Type, TypeVar

from pydantic import BaseModel

from robo_market_agent.providers.base import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class MockLLMProvider(BaseLLMProvider):
    """
    Mock LLM Provider for deterministic testing without external API credentials.
    """

    def __init__(self, responses: Optional[Dict[str, Any]] = None):
        self.responses = responses or {}

    def generate_structured(self, prompt: str, response_model: Type[T], system_prompt: str = "") -> T:
        model_name = response_model.__name__
        if model_name in self.responses:
            data = self.responses[model_name]
            if isinstance(data, BaseModel):
                return data
            elif isinstance(data, dict):
                return response_model.model_validate(data)

        # Smart defaults if no custom response provided
        if model_name == "ProjectRequirements":
            return response_model(
                project_type="Automated Irrigation System",
                description="WiFi-controlled smart plant watering system",
                power_source="12V Power Supply",
                wireless_protocol="WiFi",
                key_features=["Moisture sensing", "Automated valve control", "WiFi remote control"],
                constraints=["Waterproof sensors", "Relay isolation"],
            )
        elif model_name == "BOM":
            from robo_market_agent.models.agent_models import Component

            return response_model(
                project_name="Automated Irrigation System",
                components=[
                    Component(name="ESP32 DevKit", quantity=1, specifications="WiFi/Bluetooth MCU", category="MCU"),
                    Component(name="4 Channel Relay", quantity=1, specifications="5V relay board", category="Actuator"),
                    Component(
                        name="Capacitive Soil Moisture Sensor",
                        quantity=4,
                        specifications="Analog moisture sensor",
                        category="Sensor",
                    ),
                    Component(
                        name="12V Solenoid Valve", quantity=4, specifications="Normally closed 1/2 inch", category="Actuator"
                    ),
                    Component(name="12V Power Supply", quantity=1, specifications="12V 2A DC adapter", category="Power"),
                ],
                notes="Assembly requires basic soldering and wiring.",
            )
        elif model_name == "CompatibilityReport":
            from robo_market_agent.models.agent_models import CompatibilityIssue, IssueSeverity

            return response_model(
                is_compatible=True,
                issues=[
                    CompatibilityIssue(
                        severity=IssueSeverity.WARNING,
                        affected_components=["ESP32 DevKit", "12V Solenoid Valve"],
                        description="ESP32 GPIO operates at 3.3V while Solenoid valves require 12V.",
                        suggested_fix="Use the 4 Channel Relay board to isolate 12V solenoid power from 3.3V MCU.",
                    )
                ],
                recommendations=["Include a buck converter or power module if powering ESP32 directly from 12V."],
            )

        # Fallback empty construction
        return response_model.model_validate({})

    def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        return "Mock LLM text response based on prompt instructions."
