#!/usr/bin/env bash
# Prepare the static training site for deploy (local check or GitHub Actions).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "→ Regenerating Commons image URL map…"
python3 scripts/emit_commons_image_urls_js.py

echo "✓ Site ready: index.html, css/, js/, images/"
if [[ -d exports/html ]]; then
  echo "  Module HTML exports: exports/html/ ($(find exports/html -maxdepth 1 -name '*.html' | wc -l) files)"
fi
