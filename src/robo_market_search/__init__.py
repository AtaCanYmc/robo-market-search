from importlib.metadata import PackageNotFoundError, version

from .direncnet.client import DirencnetClient
from .motorobit.client import MotorobitClient
from .ozdisan.client import OzdisanClient
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

try:
    __version__ = version("robo-market-search")
except PackageNotFoundError:
    __version__ = "1.14.0"  # x-release-please-version

__all__ = [
    "CaptchaDetectedError",
    "CartItemResult",
    "CartSearchResult",
    "Client",
    "DirencnetClient",
    "MotorobitClient",
    "NetworkError",
    "OzdisanClient",
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
    "__version__",
    "search",
    "search_multiple",
    "search_provider",
]
