#!/usr/bin/env python3
"""
Sidecar build script for Robo Market Search Tauri Desktop packaging.
Compiles app/backend/main.py with PyInstaller and places the target binary
into app/frontend/src-tauri/binaries/robo-backend-<triple>[.exe].
"""

import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent
ENTRYPOINT = REPO_ROOT / "app" / "backend" / "main.py"
BINARIES_DIR = REPO_ROOT / "app" / "frontend" / "src-tauri" / "binaries"


def get_target_triple() -> str:
    """Resolve target platform triple matching Tauri sidecar naming conventions."""
    machine = platform.machine().lower()
    system = platform.system().lower()

    if system == "darwin":
        arch = "aarch64" if machine in ("arm64", "aarch64") else "x86_64"
        return f"{arch}-apple-darwin"
    elif system == "windows":
        arch = "x86_64" if machine in ("amd64", "x86_64") else "i686"
        return f"{arch}-pc-windows-msvc"
    elif system == "linux":
        arch = "x86_64" if machine in ("amd64", "x86_64") else machine
        return f"{arch}-unknown-linux-gnu"
    else:
        raise RuntimeError(f"Unsupported system: {system}")


def build_sidecar() -> None:
    triple = get_target_triple()
    is_windows = platform.system().lower() == "windows"
    ext = ".exe" if is_windows else ""
    target_filename = f"robo-backend-{triple}{ext}"
    target_path = BINARIES_DIR / target_filename

    BINARIES_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[*] Building PyInstaller sidecar for target triple: {triple}")
    dist_dir = REPO_ROOT / "build_sidecar_dist"
    work_dir = REPO_ROOT / "build_sidecar_work"

    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--onefile",
        "--name",
        "robo-backend",
        "--distpath",
        str(dist_dir),
        "--workpath",
        str(work_dir),
        "--paths",
        str(REPO_ROOT / "src"),
        "--paths",
        str(REPO_ROOT),
        "--hidden-import",
        "_cffi_backend",
        "--collect-all",
        "curl_cffi",
        "--collect-all",
        "robo_market_search",
        "--collect-all",
        "robo_market_api",
        "--collect-all",
        "uvicorn",
        "--collect-all",
        "fastapi",
        "--collect-all",
        "pydantic",
        "--collect-all",
        "pydantic_settings",
        "--copy-metadata",
        "curl_cffi",
        "--copy-metadata",
        "robo_market_search",
        str(ENTRYPOINT),
    ]

    print("[*] Executing:", " ".join(cmd))
    try:
        subprocess.check_call(cmd, cwd=str(REPO_ROOT))
    except subprocess.CalledProcessError as err:
        print(f"[!] PyInstaller build failed with exit code: {err.returncode}", file=sys.stderr)
        raise

    built_binary = dist_dir / f"robo-backend{ext}"
    if not built_binary.exists():
        raise FileNotFoundError(f"PyInstaller binary not found at {built_binary}")

    shutil.copy2(built_binary, target_path)
    if not is_windows:
        os.chmod(target_path, 0o755)

    print(f"[✓] Successfully built and placed sidecar binary at:\n    {target_path}")

    # Cleanup temporary directories
    shutil.rmtree(dist_dir, ignore_errors=True)
    shutil.rmtree(work_dir, ignore_errors=True)
    spec_file = REPO_ROOT / "robo-backend.spec"
    if spec_file.exists():
        spec_file.unlink()


if __name__ == "__main__":
    build_sidecar()
