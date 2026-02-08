#!/usr/bin/env bash
# Version: V1.0.0
set -euo pipefail

echo "[agent-bootstrap] checking Node/npm..."
node -v
npm -v

echo "[agent-bootstrap] installing npm dependencies..."
npm install

echo "[agent-bootstrap] installing Playwright browser (chromium)..."
npx playwright install chromium

echo "[agent-bootstrap] done."
