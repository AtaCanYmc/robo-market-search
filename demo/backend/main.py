"""
Robo Market Search — API Backend Entrypoint.
Starts the production-ready REST API (robo_market_api).

Running directly:
    cd demo/backend
    python main.py
"""

from pathlib import Path
import sys

# Ensure root repository directory is in sys.path
BASE_DIR = Path(__file__).parent
REPO_ROOT = BASE_DIR.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from robo_market_api.app.main import app, cli_main  # noqa: E402

__all__ = ["app", "cli_main"]

if __name__ == "__main__":
    cli_main()
