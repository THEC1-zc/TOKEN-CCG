# Admin Panel Plan

Version: V1.0.2  
Last updated: 2026-02-04

## Goal
Provide a Supabase-backed admin dashboard for TOKEN with wallet-gated access (owner-only) to validate DB integration, inspect data, and perform basic admin checks during offchain testing.

## Access Control
- Wallet login required.
- Only allow access if connected wallet matches the owner address:
  - `0xd29c790466675153A50DF7860B9EFDb689A21cDe`
- All other wallets see “Access denied”.
- No server-side auth for now; client-side gating only.

## Login UI Behavior
- Single dropdown with explicit actions:
  - Farcaster login (Mini App only)
  - Base wallet login
  - Browser wallet login
  - Logout
- PFP uses Farcaster avatar when available, otherwise generic wallet avatar.

## Initial Scope (MVP)
- Page: `admin.html`
- Shared header + wallet connect UI.
- Access state (authorized / denied).
- Basic tabs/sections (read-only):
  - Cards
  - Decks
  - Battle Decks
  - Users / Stats
- Minimal layout and table placeholders.
 - No admin actions in MVP (delete/reset will come later).

## Data Model Expectations (Supabase)
- Tables are read-only for admin MVP (no writes).
- Required fields for lists:
  - Cards: `id`, `user_id`, `card_name`, `house`, `value`, `faction`, `created_at`
  - Decks: `id`, `user_id`, `house`, `faction`, `cards_count`, `created_at`
  - Battle Decks: `id`, `user_id`, `house`, `deck_name`, `created_at`
  - Users/Stats: `user_id`, `created_at`, `cards_count`, `decks_count`, `games_count`

## Future (Post-MVP)
- Filtering and search.
- Row detail modal.
- Admin tools: delete/flag/reset.
- Audit log.
- Role-based access.
