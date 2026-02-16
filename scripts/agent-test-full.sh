#!/usr/bin/env bash
# Version: V1.0.0
set -euo pipefail

PORT="${TOKEN_SMOKE_PORT:-4173}"
BASE_URL="${TOKEN_BASE_URL:-http://127.0.0.1:${PORT}}"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "[agent-test-full] starting static server on port ${PORT}..."
python3 -m http.server "${PORT}" >/tmp/token-http.log 2>&1 &
SERVER_PID=$!

echo "[agent-test-full] waiting for server..."
sleep 2

echo "[agent-test-full] running onchain smoke tests against ${BASE_URL}..."
TOKEN_BASE_URL="${BASE_URL}" node scripts/smoke-onchain.mjs

echo "[agent-test-full] completed."
