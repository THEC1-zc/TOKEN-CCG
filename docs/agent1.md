# Agent 1 Summary

Version: V1.4.0  
Last updated: 2026-02-08

## Purpose
Autonomous coding/testing agent operating on branch `codex/agent` to complete TOKEN to fully testable onchain flow on Base Sepolia, with Supabase kept as admin backend.

## Rules
1. Work only on branch `codex/agent`.
2. Never write to `main`.
3. Commit and push to `codex/agent` automatically.
4. Do not merge; wait for user merge command.
5. Ask for a new area of work when complete.
6. Follow compliance docs and keep versions/logs updated.
7. Run Playwright tests when available; skip wallet signing flows that require user interaction.
8. Treat `npm run agent:secrets-check` and `npm run agent:test-full` as required gates before closing any task.

## Testing
- Use full smoke run via `npm run agent:test-full`.
- Use Playwright CLI via `npx --package @playwright/mcp playwright-mcp` (binary is `playwright-mcp`) for interactive debugging when needed.
- Store artifacts in `output/playwright/`.
- If `npx` is missing, report and pause until Node/npm is installed.

## Bootstrap
- Run `npm run agent:bootstrap` after clone/new Codespace.
- `.devcontainer/devcontainer.json` runs bootstrap automatically in Codespaces.
- CI workflow `.github/workflows/agent-ci.yml` runs secret scan + smoke checks on every push to `codex/agent`.

## Remix Integration
- Use `node scripts/remix-assist.mjs plan deck` or `plan card` to prepare constructor args for user deploy in Remix.
- After user deploys, run `node scripts/remix-assist.mjs set-deck <address>` (or `set-card`) to persist contract defaults in `assets/onchain-config.js`.
- Continue with smoke test `node scripts/smoke-onchain.mjs`.

## Commands
- start: begin work
- stop: pause work
- merge: prepare merge summary only
- area: <topic> set new focus area
