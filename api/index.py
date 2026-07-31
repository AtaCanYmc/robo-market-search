"""
Vercel Serverless Function Entrypoint.
"""

from pathlib import Path
import sys

# Ensure root repository directory and demo folder are in sys.path
API_DIR = Path(__file__).parent
ROOT_DIR = API_DIR.parent
DEMO_DIR = ROOT_DIR / "demo" / "frontend"

for p in (str(ROOT_DIR), str(DEMO_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from demo.frontend.main import app as application
except ModuleNotFoundError:
    try:
        from demo.main import app as application  # type: ignore[no-redef]
    except ModuleNotFoundError:
        from main import app as application  # type: ignore[no-redef]

app = application
handler = application
