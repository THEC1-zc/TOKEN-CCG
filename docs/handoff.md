# Handoff

Version: V1.0.1
Last updated: 2026-02-03

## Project summary
TOKEN is a web-based crypto trading card game inspired by Italian Scopa, with local-only HTML/CSS/JS apps for card minting, deck building, collection viewing, and single-player gameplay. Multiplayer + onchain are pending.

## Repo map (key files)
- index.html: main hub/dashboard
- card-minter.html: single-card creator
- deck-minter.html: 10-card deck generator
- collection.html: collection viewer
- deck-builder.html: deck validation and assembly
- game.html: single-player game
- generate-cardback.html: creates cardback.png
- assets/: background + cardback SVGs
- docs/rules.md, docs/roadmap.md: core rules + project roadmap
- vercel.json: deploy config

## Compliance requirements (must follow)
- Full compliance with Neynar, Farcaster, The Base App, Vercel, and desktop/mobile browser requirements.
- Use up-to-date official developer docs for all integrations and specs.

## Known gaps / missing items
- Farcaster Mini App embed meta tags not present in HTML.
- Manifest file missing: `/.well-known/farcaster.json`.
- Roadmap references docs not present in repo: TOKEN_RULES_v0.3.0.md, ROADMAP_v0.2.0.md, CARD_TEMPLATE_v1.0.0.md, ARCHITECTURE_v1.0.0.md, PERSPECTIVE_API_SETUP.txt.

## Immediate next steps
1. Add Farcaster Mini App embed metadata to relevant pages.
2. Create `/.well-known/farcaster.json` and sign it for domain association.
3. Align Base App indexing requirements and asset sizes.
4. Cross-browser/mobile QA (Safari priority).

## Open questions
- Which domain will host production? (needed for manifest signing)
- Which Neynar APIs will be used? (needs API key + rate limit awareness)
- Which chain features are in scope for MVP? (mint/burn, XP onchain, wallet flow)
