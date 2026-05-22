#!/usr/bin/env bash
# Install GitHub CLI into ~/.local/bin (no sudo).
#
# If Cursor’s localhost HTTP(S) proxy resets on github.com, run with:
#   GITHUB_DIRECT=1 npm run install-gh
# or:  npm run install-gh:direct
# (Uses your machine’s normal DNS/network outside the broken proxy path.)
set -euo pipefail

if [[ "${GITHUB_DIRECT:-}" == "1" ]] || [[ "${GITHUB_DIRECT:-}" == "true" ]]; then
  unset ALL_PROXY all_proxy HTTP_PROXY HTTPS_PROXY http_proxy https_proxy \
    GIT_HTTP_PROXY GIT_HTTPS_PROXY SOCKS_PROXY socks_proxy SOCKS5_PROXY socks5_proxy \
    __CURSOR_SANDBOX_ENV_RESTORE CURSOR_SANDBOX_ENV_RESTORE || true
  echo "GITHUB_DIRECT: proxy variables cleared; curling GitHub directly."
fi

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
if [[ "${GITHUB_DIRECT:-}" == "1" ]] || [[ "${GITHUB_DIRECT:-}" == "true" ]]; then
  curl --noproxy '*' -fsSL --connect-timeout 60 "$URL" -o "$TMP/archive.tar.gz"
else
  curl -fsSL --connect-timeout 60 "$URL" -o "$TMP/archive.tar.gz"
fi
tar -xzf "$TMP/archive.tar.gz" -C "$TMP"
install -m 0755 "$TMP/$NAME/bin/gh" "$DEST/gh"

case ":${PATH:-}:" in
  *:"${HOME}/.local/bin":*) ;;
  *)
    cat << EOF

Installed: ${DEST}/gh
Add ~/.local/bin to PATH (new shell afterward), or append once to ~/.bashrc:

  export PATH="\$HOME/.local/bin:\$PATH"
EOF
    ;;
esac

"${DEST}/gh" --version
