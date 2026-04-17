#!/usr/bin/env bash
# Install python-pptx (best PowerPoint output) then run the same export as npm run generate-offline.
# Usage: bash scripts/generate_offline_with_pptx.sh   OR   npm run generate-offline:pptx
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! python3 -m pip install -r scripts/requirements-offline.txt; then
  echo "ERROR: pip install failed. Install pip (e.g. apt install python3-pip) or run: npm run generate-offline" >&2
  exit 1
fi

if ! python3 -c "import pptx" 2>/dev/null; then
  echo "ERROR: python-pptx did not import after install." >&2
  exit 1
fi

node scripts/export_training_data.js
python3 scripts/generate_offline_ooxml.py
python3 scripts/generate_offline_pdf.py
echo "Done. PowerPoint files used python-pptx (check stderr for confirmation)."
