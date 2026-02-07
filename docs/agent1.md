# Agent 1 Summary

Version: V1.1.1  
Last updated: 2026-02-04

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

## Commands
- start: begin work
- stop: pause work
- merge: prepare merge summary only
- area: <topic> set new focus area
