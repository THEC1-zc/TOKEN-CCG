# Decisions

Version: V1.1.1
Last updated: 2026-02-07

## Compliance baseline
- Follow official, up-to-date docs for Neynar, Farcaster Mini Apps, Base App, and Vercel.
- Do not deviate from required specifications.

## Deployment
- Use Vercel static hosting with `vercel.json` project configuration.

## Repository
- GitHub: https://github.com/THEC1-zc/TOKEN-CCG

## Mini App structure
- Target Farcaster Mini App spec for embed metadata and manifest.
- Provide `/.well-known/farcaster.json` and sign it for domain association.

## Wallet login architecture (current decision)
- Keep a single dropdown UI with separate actions for:
  - Farcaster login (Mini App context only)
  - Base wallet login
  - Browser wallet login
  - Logout
- Use Farcaster PFP when available, otherwise a generic browser wallet avatar.

## Testnet contracts (Base Sepolia)
- TokenCard (ERC-721): `0x561F84D0b4246b64dFbAb1BDf87D6842412F1A18`
- TokenDeck (ERC-721): pending deployment on `84532` (contract draft added in repo)
- Runtime override path for contract addresses is enabled via `localStorage.token_onchain_config`.

## Game architecture (current)
- Apps remain static HTML/CSS/JS, but mint/save flows are now onchain-first for cards and decks.
- Supabase is retained as admin mirror backend (best-effort writes), not as canonical gameplay source.
- Local onchain cache keys:
  - `token_onchain_cards`
  - `token_onchain_decks`

## To decide next
- Production domain and signing identity for Farcaster manifest.
- Which pages will be indexed as Mini Apps.
- Neynar API usage and plan (required for rate limits + webhooks).
