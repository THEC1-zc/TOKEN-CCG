# coordination.md v1.3.0 - TokenCard V0.4.0 ready for deploy, player-controlled XP

# AI Integration - Coordination File

**Branch**: `main`  
**Last Updated**: 2025-02-16 (Claude session)

---

## 🎯 Current Status

**TokenCard V0.4.0** ready for deployment - waiting for Fabio to deploy via Remix.

### What Changed
- Players can now claim their own XP after games (no admin needed)
- Single transaction for all cards used in a game
- Anti-cheat: max 50 XP per game

---

## 🔄 Flusso Gioco Completo

```
┌─────────────────────────────────────────────────────────┐
│  1. MINT DECK                                           │
│     Giocatore → batchMint() → paga gas → ha 10 carte   │
├─────────────────────────────────────────────────────────┤
│  2. GIOCA PARTITA                                       │
│     Offchain, gratis                                    │
├─────────────────────────────────────────────────────────┤
│  3. FINE PARTITA → CLAIM XP                            │
│     Popup: "Claim XX XP for your cards?"               │
│     Giocatore firma 1 transazione                       │
│     claimGameXp([tokenIds], xpAmount)                  │
├─────────────────────────────────────────────────────────┤
│  4. CARTE AGGIORNATE                                    │
│     XP onchain → Level aumenta → Valore aumenta        │
├─────────────────────────────────────────────────────────┤
│  5. MARKETPLACE (futuro)                                │
│     Giocatore può vendere carte con XP alto            │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Per Codex

### Stato Attuale
- ✅ Contratto V0.4.0 pronto (`contracts/TokenCard.sol`)
- ✅ Frontend aggiornato (`game.html` usa `claimGameXp`)
- ✅ XP letto da contratto (`collection.html`, `deck-builder.html`)
- 🔄 **TU**: Cloudflare image storage
- ⏳ Deploy contratto (Fabio sta facendo)

### Cosa NON Toccare
- `contracts/TokenCard.sol` - pronto per deploy
- `game.html` funzione `updateXpOnchain` - già aggiornata
- `assets/onchain-config.js` - Fabio aggiornerà dopo deploy

### Cosa Puoi Fare
1. Completare Cloudflare image storage
2. Aggiornare card-minter/deck-minter per usare Cloudflare
3. UI improvements
4. Bug fixes

---

## 🧾 Smart Contract V0.4.0

### Funzioni Pubbliche (chiunque)
```solidity
// Minting
mint(string uri) → uint256 tokenId
batchMint(string[] uris) → uint256[] tokenIds

// XP (solo per proprie carte)
claimGameXp(uint256[] tokenIds, uint256 xpEach)  // max 50 XP
getXp(uint256 tokenId) → uint256
levelOf(uint256 tokenId) → uint256  // 1 + xp/100
```

### Funzioni Admin (solo backend)
```solidity
adminBurn(uint256 tokenId)
adminSetXp(uint256 tokenId, uint256 xp)
setTokenUri(uint256 tokenId, string uri)
```

### XP Formula (game.html)
```javascript
const baseXp = 10;                    // ogni partita
const tokenBonus = gs.playerTokens * 5;  // +5 per TOKEN
const winBonus = win ? 20 : (tie ? 10 : 0);
const totalXp = Math.min(baseXp + tokenBonus + winBonus, 50);
```

---

## 📁 File Modificati Oggi

| File | Versione | Cosa |
|------|----------|------|
| `contracts/TokenCard.sol` | V0.4.0 | claimGameXp per players |
| `game.html` | - | usa claimGameXp batch |
| `collection.html` | - | legge XP da contratto |
| `deck-builder.html` | - | legge XP da contratto |

---

## 🚨 Regole

1. **TUTTO ONCHAIN** - cards, decks, XP
2. **NO SUPABASE** per dati di gioco
3. **Admin = solo backend** (analytics, moderation)
4. **XP viaggia con NFT** - è il valore della carta

---

## 📝 Session Log

### 2025-02-16 - Claude (sessione corrente)
- Creato TokenCard V0.4.0 con `claimGameXp`
- Aggiornato game.html per batch XP claim
- Merge codex/agent → main
- In attesa deploy contratto

### 2025-02-16 - Codex
- Working on Cloudflare image storage

---

## 🔗 Links

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live**: https://token-ccg.vercel.app
- **Base Sepolia**: https://sepolia.basescan.org

### Contratti (da aggiornare dopo deploy V0.4.0)
| Contract | Version | Address |
|----------|---------|---------|
| TokenCard | V0.3.0 | `0x561F84D0b4246b64dFbAb1BDf87D6842412F1A18` |
| TokenCard | **V0.4.0** | **PENDING DEPLOY** |
| TokenDeck | V0.1.0 | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` |

---

end of coordination.md v1.3.0
