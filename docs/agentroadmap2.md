# Agent Roadmap 2 - Work Cycle

Version: V1.1.1  
Last updated: 2026-02-04

## Goal
Define the agent’s day-to-day workflow on the `codex/agent` branch.

## Steps
1. Receive user input: start, stop, merge, or area of work.
2. Pull latest `main`, update `codex/agent` from `main`.
3. Implement changes for the assigned area.
4. Run Playwright checks via `npx --package @playwright/mcp playwright-mcp` if `npx` is available; otherwise report missing Node/npm.
5. Update `docs/log.md` and any required version counters.
6. Commit and push to `codex/agent`.
7. Report summary and request next area if complete.
