# Agent 1 Summary

Version: V1.0.0  
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

## Commands
- start: begin work
- stop: pause work
- merge: prepare merge summary only
- area: <topic> set new focus area

