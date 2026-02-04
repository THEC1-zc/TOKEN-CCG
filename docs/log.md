# Project Log

Version: V0.4.0
Last updated: 2026-02-04

## 2026-02-03
- Added `docs/handoff.md` and `docs/decisions.md` for cross-agent continuity. (V1.0.1)
- Added version counters to `docs/farcaster llms.txt.txt` and `docs/base llms.txt`. (V0.1.1)
- Installed curated skills: `vercel-deploy`, `develop-web-game`, `security-best-practices`, `playwright`, `screenshot`.
- Added `coding rules.md` with session, versioning, logging, and compliance rules. (V1.0.0)
- Added `docs/workflow.md` with Mac+mobile collaboration rules and versioning/logging requirements. (V1.0.0)
- Added branching, commit, and testing rules to `coding rules.md`. (V1.1.0)
- Added 30-minute checkpoint rule for desktop/mobile re-checks in `coding rules.md`. (V1.2.0)
- Updated Base house icon color to blue on home page and added version marker. (index.html V1.0.1)
- Updated JollyDraw auto button to select + confirm, and bumped game version. (game.html V1.4.1)
- Updated editing workflow rule for desktop vs mobile output behavior. (`coding rules.md` V1.3.0)
- Added wallet login dropdown UI (Farcaster/Base/Wallet) to all main pages with shared assets. (index.html V1.1.0, card-minter.html V1.8.0, deck-minter.html V1.3.0, collection.html V1.1.0, deck-builder.html V1.2.0, game.html V1.5.0, assets/wallet-ui.css V1.0.0, assets/wallet-ui.js V1.0.1)
- Added main icon background to all pages except the game board. (index.html V1.2.0, card-minter.html V1.9.0, deck-minter.html V1.4.0, collection.html V1.2.0, deck-builder.html V1.3.0, generate-cardback.html V1.0.1)
- Switched main icon to centered overlay image while keeping original background colors. (index.html V1.2.1, card-minter.html V1.9.1, deck-minter.html V1.4.1, collection.html V1.2.1, deck-builder.html V1.3.1, generate-cardback.html V1.0.2)
- Added global header (logo, breadcrumb, quick actions, status, wallet) to all pages and shared header styles. (assets/header.css V1.0.0, assets/wallet-ui.css V1.1.0, assets/wallet-ui.js V1.1.0, index.html V1.3.0, card-minter.html V2.0.0, deck-minter.html V1.5.0, collection.html V1.3.0, deck-builder.html V1.4.0, game.html V1.6.0, generate-cardback.html V1.1.0)
- Upgraded TOKEN branding to green-red gradient and applied house color rules (Bitcoin orange, Ethereum silver, Base blue, Tysm yellow-blue gradient). (assets/header.css V1.1.0, index.html V1.3.1, card-minter.html V2.0.1, deck-minter.html V1.5.1, collection.html V1.3.1, deck-builder.html V1.4.1, game.html V1.6.1, generate-cardback.html V1.1.1)
- Fixed game cardback path and applied house color gradients consistently, plus added faction quick-load in deck builder. (game.html V1.6.2, deck-builder.html V1.5.0, deck-minter.html V1.5.2, collection.html V1.3.2, index.html V1.3.2)
- Switched TOKEN wordmark to `assets/token_icon.png` and removed Tysm icon background. (assets/header.css V1.2.0, index.html V1.3.3, card-minter.html V2.0.2, deck-minter.html V1.5.3, collection.html V1.3.3, deck-builder.html V1.5.1, game.html V1.6.3, generate-cardback.html V1.1.2)
- Increased TOKEN wordmark sizes for header and hero usage. (assets/header.css V1.3.0)
- Greatly increased TOKEN wordmark size across pages and added responsive sizes for mobile. (assets/header.css V1.4.0)
- Quadrupled hero wordmark size and doubled header wordmark size with responsive scaling. (assets/header.css V1.5.0)
- Centered oversized wordmark without affecting alignment and removed joystick icons. (assets/header.css V1.6.0, index.html V1.3.5, game.html V1.6.4, docs/roadmap.md, docs/ROADMAP_v0.2.0.md, docs/ARCHITECTURE_v1.0.0.md)
- Updated `docs/SYNC.md` with current versions, file structure, and 2026-02-04 changelog. (SYNC.md V1.1.0)
- Added Supabase integration guide at `supabase/BACKEND_INTEGRATION.md`, guest-user helper in `supabase-client.js`, and wired Supabase into key pages. (BACKEND_INTEGRATION.md V1.0.0, supabase-client.js V1.0.1, index.html V1.4.0, card-minter.html V2.1.0, deck-minter.html V1.6.0, deck-builder.html V1.6.0, collection.html V1.5.0, game.html V1.7.0)
- Set Supabase anon key in `supabase-client.js`. (supabase-client.js V1.0.2)
- Updated Supabase anon key to JWT value for production use. (supabase-client.js V1.0.3)

## 2026-02-04
- Replaced header TOKEN image with gradient text branding and moved token_icon usage to hero/back/toast only. (assets/header.css V1.7.2, index.html V1.4.1, card-minter.html V2.1.1, deck-minter.html V1.6.1, deck-builder.html V1.6.1, collection.html V1.5.1, game.html V1.7.2, generate-cardback.html V1.1.3)
- Switched game TOKEN toast to use only the hero token icon (no text). (game.html V1.7.3)
- Updated roadmaps with Supabase data-layer phase, priorities, and current file versions. (docs/roadmap.md V0.2.1, docs/ROADMAP_v0.2.0.md V0.2.1)
- Added admin panel plan and access rules. (docs/admin.md V1.0.0)
- Added admin dashboard page and admin data helpers, plus wallet UI export hooks. (admin.html V1.0.0, supabase/supabase-client.js V1.0.4, assets/wallet-ui.js V1.1.1, docs/admin.md V1.0.1)
- Added repository URL to decisions log. (docs/decisions.md V1.0.2)
- Added Admin link to header nav across pages. (index.html V1.4.2, card-minter.html V2.1.2, deck-minter.html V1.6.2, deck-builder.html V1.6.2, collection.html V1.5.2, game.html V1.7.4, generate-cardback.html V1.1.4)
- Added owner-only Admin link visibility and Admin badge in header. (assets/header.css V1.7.3, assets/admin-link.js V1.0.0, assets/wallet-ui.js V1.1.2, admin.html V1.0.1, index.html V1.4.3, card-minter.html V2.1.3, deck-minter.html V1.6.3, deck-builder.html V1.6.3, collection.html V1.5.3, game.html V1.7.5, generate-cardback.html V1.1.5)
