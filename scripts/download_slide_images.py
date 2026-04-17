#!/usr/bin/env python3
"""
Download Wikimedia Commons hardware photos into images/ (same filenames as js/data.js expects).

Run from repo root: python3 scripts/download_slide_images.py

Used when LocalCabinetImages / LocalModule2DeviceImages point at these files (see js/data.js).

Environment:
  DOWNLOAD_IMAGES_FORCE=1  — re-download even if the file already exists
  WIKIMEDIA_DIRECT=1       — run curl without HTTPS_PROXY/HTTP_PROXY (use when a corporate
                             proxy breaks CONNECT to upload.wikimedia.org; requires direct DNS)
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
from commons_images import COMMONS_IMAGES

OUT_DIR = ROOT / "images"
DOWNLOADS = COMMONS_IMAGES

UA = "plc-training-download/1.0 (educational; educational use; +https://commons.wikimedia.org/)"

# Skip re-download if file exists and is at least this many bytes (avoids clobbering good files).
MIN_EXISTING_BYTES = 512


def _env_for_direct() -> dict[str, str]:
    """Copy of environment with proxy vars removed (for curl when WIKIMEDIA_DIRECT=1)."""
    e = dict(os.environ)
    for k in (
        "HTTP_PROXY",
        "HTTPS_PROXY",
        "ALL_PROXY",
        "http_proxy",
        "https_proxy",
        "all_proxy",
    ):
        e.pop(k, None)
    return e


def fetch_urllib(url: str, dest: Path, retries: int = 3) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    last: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = resp.read()
            if not data:
                raise RuntimeError("empty response")
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            return
        except (urllib.error.URLError, OSError, TimeoutError) as e:
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise last  # type: ignore[misc]


def fetch_curl(url: str, dest: Path) -> None:
    curl = shutil.which("curl")
    if not curl:
        raise RuntimeError("curl not found")
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    cmd = [
        curl,
        "-fsSL",
        "-L",
        "-o",
        str(tmp),
        "--connect-timeout",
        "30",
        "--max-time",
        "600",
        "--retry",
        "5",
        "--retry-delay",
        "3",
        "--retry-all-errors",
        "-A",
        UA,
        url,
    ]
    env = os.environ if not os.environ.get("WIKIMEDIA_DIRECT") else _env_for_direct()
    try:
        subprocess.run(cmd, check=True, env=env, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(e.stderr or e.stdout or str(e)) from e
    tmp.replace(dest)


def fetch(url: str, dest: Path) -> None:
    errors: list[str] = []
    try:
        fetch_urllib(url, dest)
        return
    except Exception as e:
        errors.append(f"urllib: {e}")
    try:
        fetch_curl(url, dest)
        return
    except Exception as e:
        errors.append(f"curl: {e}")
    raise RuntimeError("; ".join(errors))


def main() -> int:
    parser = argparse.ArgumentParser(description="Download Commons slide images into images/")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-download even when files already exist (same as DOWNLOAD_IMAGES_FORCE=1)",
    )
    args = parser.parse_args()
    force = args.force or os.environ.get("DOWNLOAD_IMAGES_FORCE") == "1"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = 0
    skipped = 0
    for rel, url in DOWNLOADS:
        dest = OUT_DIR / rel
        if not force and dest.is_file() and dest.stat().st_size >= MIN_EXISTING_BYTES:
            print(f"Skip (exists): {rel} ({dest.stat().st_size} bytes)", flush=True)
            skipped += 1
            ok += 1
            continue
        print(f"Fetching {rel} …", flush=True)
        try:
            fetch(url, dest)
            print(f"  OK ({dest.stat().st_size} bytes)", flush=True)
            ok += 1
        except Exception as e:
            print(f"  FAILED: {e}", file=sys.stderr, flush=True)
    print(f"Done: {ok}/{len(DOWNLOADS)} files ({skipped} skipped).", flush=True)
    return 0 if ok == len(DOWNLOADS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
