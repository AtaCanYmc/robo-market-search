"""
Vercel Serverless Function Entrypoint.
"""

from pathlib import Path
import sys

# Ensure root repository directory and demo folder are in sys.path
API_DIR = Path(__file__).parent
DEMO_DIR = API_DIR.parent
ROOT_DIR = DEMO_DIR.parent

for p in (str(ROOT_DIR), str(DEMO_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

from demo.main import app  # noqa: F401, E402
