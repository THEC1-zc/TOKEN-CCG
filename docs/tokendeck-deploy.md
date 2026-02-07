# TokenDeck Deploy (Base Sepolia)

Version: V1.0.0  
Last updated: 2026-02-07

## Target
- Network: Base Sepolia
- ChainId: `84532` (`0x14a34`)
- Contract: `/Users/fabio/Documents/New project/TOKEN-CCG/contracts/TokenDeck.sol`

## Constructor Args
Deploy with:
1. `admin1`: `0xd29c790466675153A50DF7860B9EFDb689A21cDe`
2. `admin2`: `0x3b6CF1436B630035Ac1C6eEA0A8cF3C7C5f6d0f8`

## Remix Steps
1. Open Remix and load `TokenDeck.sol`.
2. Compiler: `0.8.20` (or compatible `^0.8.20`), optimization on.
3. Environment: `Injected Provider - MetaMask`.
4. Verify MetaMask is on Base Sepolia.
5. Select contract `TokenDeck`.
6. Paste constructor args in order:
   - `0xd29c790466675153A50DF7860B9EFDb689A21cDe`
   - `0x3b6CF1436B630035Ac1C6eEA0A8cF3C7C5f6d0f8`
7. Click `Deploy`.
8. Copy deployed contract address.

## Post-Deploy Wiring (No Code Edit)
Run in browser console on TOKEN app:

```js
localStorage.setItem('token_onchain_config', JSON.stringify({
  contracts: {
    deck: '0xREPLACE_WITH_DEPLOYED_DECK_CONTRACT'
  }
}));
location.reload();
```

## Verification Checklist
1. `admin.html`: deck contract status shows `deployed`.
2. `admin.html`: `Read Deck` returns `nextTokenId`.
3. `deck-minter.html`: `Save Deck` triggers onchain mint tx.
4. `collection.html`: cards from onchain deck cache appear.
5. `deck-builder.html`: onchain cards/decks appear in pool.
