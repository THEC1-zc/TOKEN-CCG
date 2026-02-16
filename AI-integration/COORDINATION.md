# coordination.md v1.4.0 - TokenCard V0.4.0 DEPLOYED, audit passed

# AI Integration - Coordination File

**Branch**: `main`  
**Last Updated**: 2025-02-16 (Claude)  
**Contract**: TokenCard V0.4.0 @ `0xDA0bab807633f07f013f94DD0E6A4F96F8742B53`

---

## ✅ AUDIT PASSED

Security and coherence audit completed. See `docs/SECURITY_AUDIT.md` for full report.

| Check | Status |
|-------|--------|
| Contract deployed | ✅ V0.4.0 on Base Sepolia |
| Config updated | ✅ onchain-config.js |
| ABI consistent | ✅ claimGameXp in game.html |
| XP reading | ✅ collection + deck-builder |
| No secrets in code | ✅ |
| No eval/dangerous | ✅ |

---

## 🎮 FLUSSO COMPLETO

```
MINT → PLAY → CLAIM XP → SELL
  │       │        │        │
  │       │        │        └── Marketplace (futuro)
  │       │        │
  │       │        └── 1 firma wallet, tutte le carte
  │       │
  │       └── Offchain, gratis
  │
  └── batchMint(), paga gas
```

---

## 📋 STATO PER CODEX

### ✅ Completato (Claude)
- TokenCard V0.4.0 deployed
- `claimGameXp()` per players
- Frontend aggiornato (game.html)
- XP letto da contratto
- Audit sicurezza passato

### 🔄 In Progress (Codex)
- Cloudflare image storage
- Sostituire `example.com` URLs con Cloudflare

### ⏳ Da Fare
- Test completo flusso
- UI per claim XP (popup a fine partita?)

---

## 🔧 CONTRATTI

| Contract | Version | Address | Chain |
|----------|---------|---------|-------|
| **TokenCard** | **V0.4.0** | `0xDA0bab807633f07f013f94DD0E6A4F96F8742B53` | Base Sepolia |
| TokenDeck | V0.1.0 | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` | Base Sepolia |

### TokenCard V0.4.0 ABI
```solidity
// PLAYER FUNCTIONS
mint(string uri) → uint256
batchMint(string[] uris) → uint256[]
claimGameXp(uint256[] tokenIds, uint256 xpEach)  // max 50 XP
getXp(uint256 tokenId) → uint256
levelOf(uint256 tokenId) → uint256

// ADMIN ONLY (backend)
adminBurn(uint256 tokenId)
adminSetXp(uint256 tokenId, uint256 xp)
setTokenUri(uint256 tokenId, string uri)
```

---

## 🎯 XP SYSTEM

### Formula (game.html)
```javascript
baseXp = 10                      // per game
tokenBonus = playerTokens * 5    // per TOKEN/scopa
winBonus = win ? 20 : tie ? 10 : 0
totalXp = min(base + token + win, 50)
```

### Esempio
| Risultato | TOKENs | XP Totale |
|-----------|--------|-----------|
| Vittoria, 2 TOKEN | 2 | 10 + 10 + 20 = 40 |
| Sconfitta, 1 TOKEN | 1 | 10 + 5 + 0 = 15 |
| Pareggio, 0 TOKEN | 0 | 10 + 0 + 10 = 20 |

---

## 📁 FILE CHIAVE

| File | Scopo |
|------|-------|
| `contracts/TokenCard.sol` | Contratto V0.4.0 |
| `assets/onchain-config.js` | Indirizzi contratti |
| `game.html` | Logica XP claim |
| `collection.html` | Lettura XP da chain |
| `deck-builder.html` | Lettura XP da chain |
| `docs/SECURITY_AUDIT.md` | Report audit |

---

## 🚨 REGOLE

1. **ONCHAIN** = cards, decks, XP
2. **NO SUPABASE** per game data
3. **Admin** = solo backend/moderation
4. **Pull prima di lavorare**
5. **Aggiorna questo file dopo modifiche**

---

## 📝 SESSION LOG

### 2025-02-16 - Claude
- TokenCard V0.4.0 creato e deployed
- Config aggiornata con nuovo CA
- Audit sicurezza e coerenza completato
- Documentazione aggiornata

### 2025-02-16 - Codex
- Cloudflare image storage (in progress)

---

## 🔗 LINKS

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live**: https://token-ccg.vercel.app
- **TokenCard V0.4.0**: https://sepolia.basescan.org/address/0xDA0bab807633f07f013f94DD0E6A4F96F8742B53

---

end of coordination.md v1.4.0
