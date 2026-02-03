# Coding Rules

Version: V1.3.0
Last updated: 2026-02-03

## Session start
- Always confirm whether the user is on desktop or mobile, or determine it from context before proceeding.
- Only re-check desktop vs mobile if at least 30 minutes have passed since the last session checkpoint.

## Editing workflow
- When on mobile, provide the full file content in the response for any modified file.
- When on desktop, apply changes directly without dumping full files unless asked.
- When a new file is created, use the exact requested filename.

## Versioning
- Every file touched must include a version counter in the format `Version: Vx.y.z`.
- Bump rules:
  - Major: breaking change or structural refactor.
  - Minor: new feature or new section.
  - Patch: small edits, formatting, or metadata updates.

## Log rule
- Update `docs/log.md` for every change set with date, summary, and version bumps.

## Compliance rule
- Do not deviate from best practices defined in the latest official developer docs.
- Follow Farcaster Mini Apps, Base App, Vercel, and desktop/mobile browser requirements.
- Neynar is postponed unless explicitly requested.

## File naming
- Keep filenames stable unless explicitly requested to rename.
- If a file is renamed, update all references and log the change.

## Coordination
- If you are on mobile, provide exact copy/paste-ready full-file edits.
- If you are on desktop, edits can be applied directly by Codex.

## Branching
- Use branch names prefixed with `codex/` and scoped to the task (e.g., `codex/miniapp-manifest`).
- Keep `main` clean; only merge after review.

## Commits
- Use conventional commit-style prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Keep commit messages short and task-focused.

## Testing
- Run tests when changes affect game logic or shared components.
- If tests are skipped, state why in the log.
