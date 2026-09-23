#!/usr/bin/env bash
# Build, commit, and push so GitHub Actions publishes to GitHub Pages.
# Prerequisites: gh auth login, remote origin (run npm run publish-github once).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bash scripts/build-site.sh

if ! command -v git >/dev/null 2>&1; then
  echo "git is required."
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ -z "${BRANCH}" ]]; then
  echo "Not on a git branch."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "No git remote 'origin'. Run once:"
  echo "  gh auth login"
  echo "  npm run publish-github"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
  git add -A
  MSG="${DEPLOY_COMMIT_MSG:-Update PLC training site}"
  git commit -m "${MSG}" || true
else
  echo "→ No file changes to commit."
fi

echo "→ Pushing ${BRANCH} to origin (triggers Deploy to GitHub Pages)…"
git push -u origin "${BRANCH}"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  LOGIN="$(gh api user --jq '.login' 2>/dev/null || true)"
  REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
  if [[ -n "${LOGIN}" && -n "${REPO}" ]]; then
    NAME="${REPO#*/}"
    echo ""
    echo "✓ Pushed. When the workflow finishes, open:"
    echo "  https://${LOGIN}.github.io/${NAME}/"
    echo ""
    echo "Watch deploy: gh run watch --workflow deploy-pages.yml"
  fi
fi
