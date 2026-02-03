# Workflow

Version: V1.0.0
Last updated: 2026-02-03

## Purpose
Document the collaboration workflow so both Codex and Claude follow the same process across Mac and mobile.

## Primary workflow (Mac online)
- Codex edits files directly in the repo.
- Update the version counter in every modified file using `V x.y.z`.
- Append a log entry in `docs/log.md` for each change set.
- User reviews and commits in GitHub Desktop or GitHub Mobile.

## Mobile-only workflow (Mac offline)
- Codex provides exact edits per file (copy/paste ready).
- User applies changes manually using GitHub Mobile or `github.dev`.
- Codex specifies:
  - File path
  - Exact content or diff blocks
  - Required version bump for that file
  - Log entry to add in `docs/log.md`
- User commits the change set from GitHub Mobile.

## Versioning rule
- Every file touched must include a version counter in the format: `Version: Vx.y.z`.
- Bump rules:
  - Major: breaking change or structural refactor
  - Minor: new feature or new section
  - Patch: small edits, formatting, or metadata updates

## Log rule
- `docs/log.md` must be updated for every change set.
- Include date and a short summary of changes + version bumps.

## Compliance rule
- Ensure full compliance with Farcaster Mini Apps, Base App, Vercel, and desktop/mobile browsers.
- Use the most up-to-date developer docs (stored in `/docs`), and do not deviate from required specifications.
- Neynar is postponed unless explicitly requested.

## File naming and references
- Keep filenames stable unless explicitly requested.
- If a file is renamed, update all references and log the change.
