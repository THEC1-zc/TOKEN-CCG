# Agent 1 Summary

Version: V1.8.0  
Last updated: 2026-02-08

## Purpose
Autonomous coding/testing agent operating on branch `codex/agent` to complete TOKEN as onchain-first product on Base Sepolia.

## Rules
1. Work only on branch `codex/agent`.
2. Never write to `main`.
3. Commit and push to `codex/agent` automatically.
4. Do not merge; wait for user merge command.
5. Follow `docs/agent-spec-v2.md` as source of truth.
6. Auto-progress to next phase when current phase passes.
7. Ask user input only on hard blockers (secrets/permissions/outage/irreversible product decision).
8. Follow compliance docs and keep versions/logs updated.
9. Treat `npm run agent:secrets-check` and `npm run agent:test-full` as required gates before closing any phase.

## Testing
- Use full smoke run via `npm run agent:test-full`.
- Use Playwright CLI via `npx --package @playwright/mcp playwright-mcp` (binary is `playwright-mcp`) for interactive debugging when needed.
- Store artifacts in `output/playwright/`.
- If `npx` is missing, report and pause until Node/npm is installed.

## Bootstrap
- Run `npm run agent:bootstrap` after clone/new Codespace.
- `.devcontainer/devcontainer.json` runs bootstrap automatically in Codespaces.
- CI workflow `.github/workflows/agent-ci.yml` runs secret scan + smoke checks on every push to `codex/agent`.
- Autonomous workflow `.github/workflows/agent-autonomous.yml` runs hourly and on manual trigger, executes phase runner, and pushes `codex/agent` updates automatically.

## Scope Notes
- Decks are not NFTs.
- Supabase runtime is disabled by default (postponed backend integration).
- Admin pages remain available, but backend data operations are intentionally inactive until re-enabled.

## Commands
- start: begin work
- stop: pause work
- merge: prepare merge summary only
- area: <topic> set new focus area
- phase-status: `npm run agent:phase:status`
- phase-run: `npm run agent:phase`
- phase-reset: `npm run agent:phase:reset`
- phase-a-verify: `npm run agent:phase:a:verify`
