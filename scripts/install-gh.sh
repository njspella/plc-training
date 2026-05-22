#!/usr/bin/env bash
# Install GitHub CLI into ~/.local/bin (no sudo). Run from regular terminal — not Cursor’s sandbox if proxy breaks CONNECT.
set -euo pipefail

GH_VER="${GH_VERSION:-v2.92.0}"
ARCH_RAW="$(uname -m)"
case "$ARCH_RAW" in
  x86_64) ARCH_TAG="amd64" ;;
  aarch64 | arm64) ARCH_TAG="arm64" ;;
  *)
    echo "Unsupported architecture: $ARCH_RAW"
    exit 1
    ;;
esac

V="${GH_VER#v}"
NAME="gh_${V}_linux_${ARCH_TAG}"
URL="https://github.com/cli/cli/releases/download/${GH_VER}/${NAME}.tar.gz"
DEST="${HOME}/.local/bin"
TMP="$(mktemp -d)"

trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DEST"
echo "Fetching $URL"
curl -fsSL --connect-timeout 60 "$URL" -o "$TMP/archive.tar.gz"
tar -xzf "$TMP/archive.tar.gz" -C "$TMP"
install -m 0755 "$TMP/$NAME/bin/gh" "$DEST/gh"

if ! grep -qsF '.local/bin' "${HOME}/.profile" 2>/dev/null || true; then
  cat << EOF

Installed: ${DEST}/gh
Add to PATH if needed (then open a new shell):
  export PATH="\$HOME/.local/bin:\$PATH"
Or append that line to ~/.profile or ~/.bashrc.
EOF
fi

"${DEST}/gh" --version
