# coordination.md v1.6.0 - Full debug session, NFT metadata on R2

# AI Integration - Coordination File

**Branch**: `main`  
**Last Updated**: 2026-02-17 (Claude)  
**Contract**: TokenCard V0.5.0 @ `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99`

---

## ✅ CURRENT STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| TokenCard V0.5.0 | ✅ Deployed | `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99` |
| TokenGame V0.1.0 | ✅ Deployed | `0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005` |
| TokenDeck V0.1.0 | ✅ Deployed | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` |
| R2 Upload API | ✅ Ready | `/api/upload` |
| Card Minter | ✅ Fixed | tokenId extraction improved |
| Deck Minter | ✅ Fixed | tokenId extraction improved |
| Collection | ✅ Reads onchain | Shows tokenId |
| Wallet Logout | ✅ Fixed | Revokes permissions |

---

## 🎮 NFT FLOW

```
MINT CARD/DECK
     │
     ▼
┌─────────────────┐
│ 1. Mint onchain │ → Get tokenId from receipt
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. Generate IMG │ → Canvas with tokenId visible
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. Upload R2    │ → /api/upload (image + metadata)
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. NFT Ready    │ → Visible in wallet with image
└─────────────────┘
```

---

## 🔧 CONTRACTS

| Contract | Version | Address | Chain |
|----------|---------|---------|-------|
| **TokenCard** | **V0.5.0** | `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99` | Base Sepolia |
| **TokenGame** | **V0.1.0** | `0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005` | Base Sepolia |
| **TokenDeck** | **V0.1.0** | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` | Base Sepolia |

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `assets/onchain-config.js` | Contract addresses |
| `api/upload/index.js` | Upload image+metadata to R2 |
| `api/metadata/[tokenId].js` | Read metadata from R2 |
| `card-minter.html` | Single card mint |
| `deck-minter.html` | Batch 10 cards mint |
| `collection.html` | View cards from wallet |
| `game.html` | Play + XP claim |

---

## 🎯 NFT METADATA FORMAT

```json
{
  "name": "Card Name - HOUSE VALUE",
  "description": "A TOKEN CCG card...",
  "image": "https://r2.../images/{tokenId}.png",
  "external_url": "https://token-ccg.vercel.app/collection.html?card={tokenId}",
  "attributes": [
    { "trait_type": "House", "value": "bitcoin" },
    { "trait_type": "Faction", "value": "satoshi" },
    { "trait_type": "Value", "value": "7" },
    { "trait_type": "Card Name", "value": "..." },
    { "trait_type": "XP", "value": 0 },
    { "trait_type": "Level", "value": 1 }
  ]
}
```

---

## 🚨 RULES

1. **ONCHAIN** = source of truth for cards, XP
2. **NO localStorage** for card data (only cache)
3. **TokenId visible** on all card images
4. **R2** for image/metadata storage
5. **Pull before working**
6. **Update this file after changes**

---

## 📝 SESSION LOG

### 2026-02-17 - Claude
- Fixed wallet logout (revokes permissions)
- Fixed TOKEN title style in Quick Rules
- Added tokenId to card images (bottom right)
- Removed localStorage dependency in minters
- Fixed tokenId extraction from tx receipt (ethers.BigNumber)
- Added tokenId display in collection grid/modal
- Aligned deck-minter to R2 upload flow

---

## 🔗 LINKS

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live**: https://token-ccg.vercel.app
- **TokenCard**: https://sepolia.basescan.org/address/0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99

---

end of coordination.md v1.6.0
