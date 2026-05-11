#!/usr/bin/env bash
# Create the GitHub repo (if missing) and push main. Enables GitHub Pages via existing workflow after first push.
# Prerequisites: GitHub CLI — https://cli.github.com/
# Usage (from repo root): npm run publish-github
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REPO_NAME="${GH_REPO_NAME:-plc-training}"
VISIBILITY="${GH_REPO_VISIBILITY:-public}" # public | private

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI, then rerun: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Log in once, then rerun this script:"
  echo "  gh auth login"
  exit 1
fi

LOGIN="$(gh api user --jq '.login')"
BRANCH="$(git branch --show-current)"
if [[ -z "${BRANCH}" ]]; then
  echo "Not on a git branch."
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already set → pushing '${BRANCH}'…"
  git push -u origin "${BRANCH}"
else
  if [[ "${VISIBILITY}" == "private" ]]; then
    FLAGS=(--private)
  else
    FLAGS=(--public)
  fi
  echo "Creating GitHub repo '${REPO_NAME}' (${VISIBILITY}) and pushing '${BRANCH}'…"
  if gh repo create "${REPO_NAME}" "${FLAGS[@]}" --source=. --remote=origin --push; then
    :
  else
    echo "If the repo already exists on GitHub, add the remote manually:"
    echo "  git remote add origin \"https://github.com/${LOGIN}/${REPO_NAME}.git\""
    echo "  git push -u origin ${BRANCH}"
    exit 1
  fi
fi

echo ""
echo "✓ Pushed to https://github.com/${LOGIN}/${REPO_NAME}"
echo "In the repo on GitHub: Settings → Pages → Build and deployment → Source → GitHub Actions."
echo "After 'Deploy to GitHub Pages' succeeds, open:"
echo "  https://${LOGIN}.github.io/${REPO_NAME}/"
