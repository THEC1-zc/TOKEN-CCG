# Decisions

Version: V1.0.1
Last updated: 2026-02-03

## Compliance baseline
- Follow official, up-to-date docs for Neynar, Farcaster Mini Apps, Base App, and Vercel.
- Do not deviate from required specifications.

## Deployment
- Use Vercel static hosting with `vercel.json` project configuration.

## Mini App structure
- Target Farcaster Mini App spec for embed metadata and manifest.
- Provide `/.well-known/farcaster.json` and sign it for domain association.

## Game architecture (current)
- All apps are static HTML/CSS/JS files with local storage.
- Multiplayer and onchain integration are not yet implemented.

## To decide next
- Production domain and signing identity for Farcaster manifest.
- Which pages will be indexed as Mini Apps.
- Neynar API usage and plan (required for rate limits + webhooks).
