# Agent Roadmap 1 - Creation

Version: V1.0.0  
Last updated: 2026-02-04

## Goal
Create a local-only agent that works on branch `codex/agent`, can code, test, debug, and push, and respects compliance requirements (Farcaster, Base, onchain).

## Steps
1. Ensure repo is clean and on `main`.
2. Create or checkout branch `codex/agent`.
3. Confirm git remote is set and push is allowed.
4. Define agent rules: never touch `main`, always commit to `codex/agent`, never merge.
5. Record start/stop commands and required user inputs.

