# Remix Agent Integration

Version: V1.0.0  
Last updated: 2026-02-07

## Goal
Bridge wallet-signed Remix deployment with the local agent flow.

## Why
The agent can prepare everything, but wallet signatures and deploy clicks must be done by the user in Remix/MetaMask.

## Commands
Run from repo root:

```bash
node scripts/remix-assist.mjs plan deck
node scripts/remix-assist.mjs plan card
```

These commands print:
1. contract file path
2. target network
3. compiler version
4. constructor args

## After Deploy
When Remix gives you deployed address:

```bash
node scripts/remix-assist.mjs set-deck 0xYOUR_DEPLOYED_DECK_ADDRESS
```

or

```bash
node scripts/remix-assist.mjs set-card 0xYOUR_DEPLOYED_CARD_ADDRESS
```

This updates `/Users/fabio/Documents/New project/TOKEN-CCG/assets/onchain-config.js` so all pages use the new contract by default.

## Recommended Sequence
1. `node scripts/remix-assist.mjs plan deck`
2. Deploy in Remix with printed args.
3. `node scripts/remix-assist.mjs set-deck <address>`
4. Run smoke:
   - `TOKEN_BASE_URL=http://127.0.0.1:4173 node scripts/smoke-onchain.mjs`
5. Push `codex/agent`.
