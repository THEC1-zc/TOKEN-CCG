# coordination.md v1.7.0 - Full audit, removed duplicate API, documented admin key flow

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
| R2 Admin Upload | ✅ Ready | `/api/admin/upload-card` (requires admin key) |
| Card Minter | ✅ Fixed | tokenId extraction, R2 upload |
| Deck Minter | ✅ Fixed | tokenId extraction, R2 upload |
| Collection | ✅ Reads onchain | Shows tokenId |
| Wallet Logout | ✅ Fixed | Revokes permissions |

---

## 🔧 CONTRACTS

| Contract | Version | Address | Chain |
|----------|---------|---------|-------|
| **TokenCard** | **V0.5.0** | `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99` | Base Sepolia |
| **TokenGame** | **V0.1.0** | `0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005` | Base Sepolia |
| **TokenDeck** | **V0.1.0** | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` | Base Sepolia |

---

## 📁 API ENDPOINTS

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `/api/admin/upload-card` | x-admin-key | Upload image+metadata to R2 |
| `/api/metadata/[tokenId]` | None | Read metadata from R2 |

**Note**: Removed duplicate `/api/upload` (was public, security risk).

---

## 🔑 ADMIN KEY FLOW

```
1. Admin sets ADMIN_API_KEY in Vercel env vars
2. User saves key in localStorage:
   localStorage.setItem('token_onchain_config', JSON.stringify({admin:{apiKey:'...'}}))
3. onchain-config.js loads it into window.TOKEN_ADMIN_API_KEY
4. Minters send x-admin-key header to /api/admin/upload-card
5. If no key or wrong key → upload fails → fallback to placeholder URI
```

**For testnet**: Users without admin key can still mint, but NFT won't have R2 image.

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `assets/onchain-config.js` | Contract addresses + admin key |
| `api/admin/upload-card.js` | Upload image+metadata to R2 (Codex) |
| `api/metadata/[tokenId].js` | Read metadata from R2 (Codex) |
| `api/_utils/r2.js` | R2 client utilities (Codex) |
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

## 🚨 HARD RULES

1. **ONCHAIN** = source of truth for cards, XP
2. **NO localStorage** for card data (only cache)
3. **TokenId visible** on all card images
4. **R2** for image/metadata storage (admin only)
5. **Pull before working**
6. **Update this file after EVERY change**
7. **First and last line** must contain version

---

## 📝 SESSION LOG

### 2026-02-17 - Claude (afternoon)
- Full audit of all files for inconsistencies
- Removed duplicate `/api/upload` (was unused, security risk)
- Documented admin key flow for R2 uploads
- Verified all contract addresses match
- Verified ABI consistency across files

### 2026-02-17 - Claude (morning)
- Fixed wallet logout (revokes permissions)
- Fixed TOKEN title style in Quick Rules
- Added tokenId to card images (bottom right)
- Removed localStorage dependency in minters
- Fixed tokenId extraction from tx receipt (ethers.BigNumber)
- Added tokenId display in collection grid/modal
- Aligned deck-minter to R2 upload flow

### 2026-02-17 - Codex
- Created api/admin/upload-card.js with admin key auth
- Created api/metadata/[tokenId].js
- Created api/_utils/r2.js

---

## 🔗 LINKS

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live**: https://token-ccg.vercel.app
- **TokenCard**: https://sepolia.basescan.org/address/0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99

---

end of coordination.md v1.7.0
