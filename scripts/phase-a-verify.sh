#!/usr/bin/env bash
# Version: V1.0.0
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

RUNTIME_PAGES=(
  "index.html"
  "game.html"
  "card-minter.html"
  "deck-minter.html"
  "deck-builder.html"
  "collection.html"
)

echo "[phase-a-verify] checking runtime pages for Supabase script includes..."
for page in "${RUNTIME_PAGES[@]}"; do
  if grep -q "@supabase/supabase-js\\|supabase/supabase-client.js" "${page}"; then
    echo "[phase-a-verify] FAIL: Supabase include found in ${page}"
    exit 1
  fi
done

echo "[phase-a-verify] checking deck minter is non-NFT deck flow..."
if grep -q "mintOnchainDeck\\|Onchain deck mint\\|Onchain Deck Mint\\|ethers\\.umd\\.min\\.js" "deck-minter.html"; then
  echo "[phase-a-verify] FAIL: deck-minter still contains deck NFT minting path"
  exit 1
fi

echo "[phase-a-verify] checking runtime pages do not reference TokenDB..."
for page in "${RUNTIME_PAGES[@]}"; do
  if grep -q "TokenDB" "${page}"; then
    echo "[phase-a-verify] FAIL: TokenDB reference found in ${page}"
    exit 1
  fi
done

echo "[phase-a-verify] PASS"
