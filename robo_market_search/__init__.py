from .direncnet.client import DirencnetClient
from .robo90.client import Robo90Client
from .robolink.client import RobolinkClient
from .robotistan.client import RobotistanClient
from .search.api import search, search_multiple, search_provider
from .shared.exceptions import (
    CaptchaDetectedError,
    NetworkError,
    ParsingError,
    RateLimitError,
    RoboMarketError,
    StoreUnavailableError,
    TimeoutError,
)
from .shared.models import (
    CartItemResult,
    CartSearchResult,
    Product,
    ShippingInfo,
    SplitAssignment,
    SplitCombination,
    SplitStoreGroup,
    StoreCartSummary,
)
from .unified.client import UnifiedSearchClient

# Convenient alias for Developer Experience (DX)
Client = UnifiedSearchClient

__all__ = [
    "CaptchaDetectedError",
    "CartItemResult",
    "CartSearchResult",
    "Client",
    "DirencnetClient",
    "NetworkError",
    "ParsingError",
    "Product",
    "RateLimitError",
    "Robo90Client",
    "RoboMarketError",
    "RobolinkClient",
    "RobotistanClient",
    "ShippingInfo",
    "SplitAssignment",
    "SplitCombination",
    "SplitStoreGroup",
    "StoreCartSummary",
    "StoreUnavailableError",
    "TimeoutError",
    "UnifiedSearchClient",
    "search",
    "search_multiple",
    "search_provider",
]
