# Agent Spec v2

Version: V1.3.0  
Last updated: 2026-02-08

## Mission
Complete TOKEN to production-ready gameplay with onchain card NFTs first.

Scope now:
1. Onchain-first runtime only.
2. Single cards are ERC-721 NFTs.
3. Decks are not NFTs.
4. Supabase is postponed and disabled in runtime.

## Operating Rules
1. Work only on branch `codex/agent`.
2. Commit/push autonomously on `codex/agent`.
3. Never merge to `main` automatically.
4. Run required checks before finishing a phase:
   - `npm run agent:secrets-check`
   - `npm run agent:test-full`
5. Update version markers (`Vx.y.z`) for edited files.
6. Append a concise entry to `docs/log.md` after each completed phase.

## Escalation Rule
Auto-progress to the next phase with no user input when current phase is green.
Ask the user only when blocked by one of these:
1. Missing secret or private key.
2. External service outage or hard permission denial.
3. Irreversible decision with multiple valid product choices.

## Phases (Auto Sequence)
1. Phase A: Runtime onchain-only hardening.
2. Phase B: ERC-721 card contract deploy/test pipeline on Base Sepolia.
3. Phase C: Card mint UX + wallet ownership sync + collection consistency.
4. Phase D: Deck builder/game flow using owned NFT cards only (no deck NFT).
5. Phase E: Mobile readiness pass.
6. Phase F: Farcaster/Base Mini App readiness.
7. Phase G: Final regression pass and mainnet transition checklist.

## Phase Runner Commands
Use the phase runner as the default execution interface:
1. `npm run agent:phase:status` -> show current phase state.
2. `npm run agent:phase` -> run current phase gates and auto-advance through A->B->C while green.
3. `npm run agent:phase:reset` -> reset state to phase A.
4. `npm run agent:phase:a:verify` -> validate Phase A scope hard rules.

State is persisted in `.agent/phase-state.json`.

Cloud autonomous execution:
1. Use `.github/workflows/agent-autonomous.yml`.
2. Trigger manually (`workflow_dispatch`) or hourly schedule.
3. Run bootstrap -> phase runner -> conditional commit/push on `codex/agent`.

## End-of-Run Output Format
1. `Changed`: file list.
2. `Validated`: commands + result.
3. `Status`: pass/fail + blockers.
4. `Next`: exact next phase/task.
