# Agent 1 Summary

Version: V1.2.0  
Last updated: 2026-02-07

## Purpose
Local-only coding/testing agent operating on branch `codex/agent` with full compliance focus (Farcaster, Base, onchain).

## Rules
1. Work only on branch `codex/agent`.
2. Never write to `main`.
3. Commit and push to `codex/agent` automatically.
4. Do not merge; wait for user merge command.
5. Ask for a new area of work when complete.
6. Follow compliance docs and keep versions/logs updated.
7. Run Playwright tests when available; skip wallet signing flows that require user interaction.

## Testing
- Use Playwright CLI via `npx --package @playwright/mcp playwright-mcp` (binary is `playwright-mcp`).
- Store artifacts in `output/playwright/`.
- If `npx` is missing, report and pause until Node/npm is installed.

## Remix Integration
- Use `node scripts/remix-assist.mjs plan deck` or `plan card` to prepare constructor args for user deploy in Remix.
- After user deploys, run `node scripts/remix-assist.mjs set-deck <address>` (or `set-card`) to persist contract defaults in `assets/onchain-config.js`.
- Continue with smoke test `node scripts/smoke-onchain.mjs`.

## Commands
- start: begin work
- stop: pause work
- merge: prepare merge summary only
- area: <topic> set new focus area
