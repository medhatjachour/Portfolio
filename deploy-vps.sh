#!/usr/bin/env bash
#
# Deploy the portfolio to the shared VPS.
#
# The live site is NOT a container of its own. It is served as static files by the shared
# reverse proxy (bizflow-nginx) that fronts every site on the host, which bind-mounts
# /home/medhat/bizflow/portfolio-dist read-only as its web root. This script therefore only
# replaces the contents of that one directory. It does not rebuild or restart BizFlow or
# TransHub, and it does not touch the proxy config, the TLS certificates or DNS.
#
# Authoritative procedure: BizFlow/docs/PRODUCTION_SERVER_RUNBOOK.md §15.
#
# Usage:  ./deploy-vps.sh [--skip-build]
#
set -euo pipefail

VPS_USER="${VPS_USER:-medhat}"
VPS_HOST="${VPS_HOST:-168.231.107.207}"
REMOTE_DIR="${REMOTE_DIR:-/home/medhat/bizflow/portfolio-dist}"
COMPOSE_DIR="${COMPOSE_DIR:-/home/medhat/bizflow}"
SITE_URL="${SITE_URL:-https://medhatjachour.tech}"
NGINX_CONTAINER="${NGINX_CONTAINER:-bizflow-nginx}"
TARBALL="portfolio-dist.tar.gz"

cd "$(dirname "$0")"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m  warn:\033[0m %s\n' "$1"; }
ok()   { printf '\033[1;32m  ok:\033[0m %s\n' "$1"; }
fail() { printf '\n\033[1;31m  fail:\033[0m %s\n' "$1" >&2; exit 1; }

usage() {
  cat <<'EOF'
Deploy the portfolio to the shared VPS.

Builds dist/, ships it to the host directory that the shared reverse proxy
(bizflow-nginx) bind-mounts as its web root, then smoke-tests the live site.
Only that one directory is touched — BizFlow, TransHub, the proxy config, the
TLS certificates and DNS are all left alone.

Usage:
  ./deploy-vps.sh [--skip-build]

Options:
  --skip-build    Deploy the existing dist/ without running `npm run build`
  -h, --help      Show this help

Overridable environment variables (defaults shown in the script header):
  VPS_USER  VPS_HOST  REMOTE_DIR  COMPOSE_DIR  SITE_URL  NGINX_CONTAINER

Requires key-based SSH access to the VPS: the script runs ssh with
BatchMode=yes, so it fails fast rather than hanging on a password prompt.

Authoritative procedure: BizFlow/docs/PRODUCTION_SERVER_RUNBOOK.md §15.
EOF
}

SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help) usage; exit 0 ;;
    *) fail "unknown argument: $arg" ;;
  esac
done

# ---------------------------------------------------------------------------
# 0. Preflight
# ---------------------------------------------------------------------------
step "Preflight"
for bin in tar ssh scp curl; do
  command -v "$bin" >/dev/null 2>&1 || fail "'$bin' is not on PATH"
done
[ "$SKIP_BUILD" -eq 1 ] || command -v npm >/dev/null 2>&1 || fail "'npm' is not on PATH"
ok "required tools present"

if [ "$SKIP_BUILD" -eq 0 ] && [ -f .env ]; then
  missing=""
  for key in VITE_GEMINI_API_KEY VITE_WEB3FORMS_KEY; do
    grep -qE "^[[:space:]]*${key}=.+" .env 2>/dev/null || missing="$missing $key"
  done
  if [ -n "$missing" ]; then
    warn ".env has no value for:$missing"
    warn "the build will still succeed, but those features silently fall back to defaults"
    warn "(offline agent personality / hard-coded Web3Forms key) instead of using your keys"
  fi
fi

# ---------------------------------------------------------------------------
# 1. Build
# ---------------------------------------------------------------------------
if [ "$SKIP_BUILD" -eq 0 ]; then
  step "Building (Vite inlines VITE_* at this point, so .env must be final)"
  npm run build
else
  step "Skipping build (--skip-build)"
fi

[ -f dist/index.html ] || fail "dist/index.html is missing — the build did not produce a site"
ok "dist/index.html present"

# ---------------------------------------------------------------------------
# 2. Package
# ---------------------------------------------------------------------------
step "Packaging dist/"
rm -f "$TARBALL"
tar -czf "$TARBALL" -C dist .
ok "$(du -h "$TARBALL" | cut -f1) -> $TARBALL"

# ---------------------------------------------------------------------------
# 3. Ship
# ---------------------------------------------------------------------------
step "Copying to $VPS_USER@$VPS_HOST:/tmp/"
scp -q "$TARBALL" "$VPS_USER@$VPS_HOST:/tmp/$TARBALL"
ok "uploaded"

# ---------------------------------------------------------------------------
# 4. Extract into the mounted web root
#
# The extraction runs in a throwaway root container on purpose. Docker created
# $REMOTE_DIR as root:root, and $VPS_USER has no passwordless sudo, so a plain
# `tar -x` over ssh fails with permission denied. Being in the docker group is the
# only way in. tar extracts *over* the existing tree without deleting it, which is
# deliberate: old hashed assets stay reachable for clients that still hold them.
# ---------------------------------------------------------------------------
step "Extracting into $REMOTE_DIR"
ssh -o BatchMode=yes "$VPS_USER@$VPS_HOST" "
  set -e
  docker run --rm \
    -v /tmp/$TARBALL:/src.tar.gz:ro \
    -v $REMOTE_DIR:/target \
    alpine \
    sh -c 'tar -xzf /src.tar.gz -C /target && chown -R 1000:1000 /target'
  rm -f /tmp/$TARBALL
"
ok "files in place, staged tarball removed"

# ---------------------------------------------------------------------------
# 5. Make sure the container can actually see the files
#
# Normally nothing to do: a bind mount is live, so nginx serves the new bytes the
# moment they land. The one exception is the very first deploy, when $REMOTE_DIR did
# not exist and Docker silently created it as an empty directory *as the mount
# source was resolved* — nginx is then serving a stale/empty view until it restarts.
# This restarts the shared proxy, which briefly blips every site on the host, so it
# is only ever done when the web root really is unreadable.
# ---------------------------------------------------------------------------
step "Verifying the container can read the web root"
if ssh -o BatchMode=yes "$VPS_USER@$VPS_HOST" \
     "docker exec $NGINX_CONTAINER test -f /usr/share/nginx/html/index.html" 2>/dev/null; then
  ok "$NGINX_CONTAINER sees index.html — no reload needed"
else
  warn "$NGINX_CONTAINER cannot see index.html; recreating it so the bind mount is picked up"
  warn "this briefly interrupts every site behind the proxy"
  ssh -o BatchMode=yes "$VPS_USER@$VPS_HOST" "cd $COMPOSE_DIR && docker compose up -d nginx"
  ok "container recreated"
fi

# ---------------------------------------------------------------------------
# 6. Smoke test
#
# The 404 probe is the regression guard for the empty-web-root incident: a missing
# web root answers 403 on / and 500 on everything else, and a loose SPA fallback
# would answer 200 with HTML for a missing script.
# ---------------------------------------------------------------------------
step "Smoke-testing $SITE_URL"
failures=0
check() {
  got="$(curl -s -o /dev/null -w '%{http_code}' "${SITE_URL}$1" || echo 000)"
  if [ "$got" = "$2" ]; then
    printf '      %-30s %s\n' "$1" "$got"
  else
    printf '\033[1;31m  FAIL %-30s %s (want %s)\033[0m\n' "$1" "$got" "$2"
    failures=$((failures + 1))
  fi
}
check "/" 200
check "/favicon.svg" 200
check "/favicon.ico" 200
check "/profile.png" 200
check "/assets/does-not-exist.js" 404

printf '\n'
if [ "$failures" -gt 0 ]; then
  fail "$failures check(s) failed — the site may be serving a stale or broken build"
fi
ok "live at $SITE_URL"
