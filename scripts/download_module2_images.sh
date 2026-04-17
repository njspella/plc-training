#!/usr/bin/env bash
# Download Wikimedia Commons photos into images/ (Module 1 cabinet + Module 2 I/O).
# Prefer the Python implementation (retries, works behind some proxies):
#   python3 scripts/download_slide_images.py
# This shell script is a thin wrapper for convenience.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec python3 "$ROOT/scripts/download_slide_images.py"
