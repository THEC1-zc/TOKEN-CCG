# coordination.md v1.2.0 - XP onchain implementation complete, merged to main

# AI Integration - Coordination File

**Branch**: `main` (merged from `codex/agent`)  
**Last Updated**: 2025-02-16 (Claude session)

---

## 🎯 Purpose

This file serves as the **single source of truth** for coordination between Claude and Codex during the development of TOKEN-CCG. Both AI assistants will update this file after every work session to maintain continuity and avoid conflicts.

---

## 🤖 AI Assistants Roles

### **Claude**
- Backend architecture (Supabase integration)
- Database schema design
- Smart contracts (Solidity for Base)
- Strategic planning & roadmap
- Technical documentation
- Code review & architecture decisions

### **Codex (ChatGPT)**
- Frontend development (HTML/CSS/JS)
- UI/UX implementation
- Bug fixes
- Feature implementation
- Quick code modifications
- Cloudflare image storage setup

---

## 📋 Current Work Session

**Working on**: Full Onchain Architecture - XP stored and read from smart contract  
**Started**: 2025-02-16 (Claude)  
**Status**: ✅ COMPLETE - Merged to main

### Changes Made This Session (Claude)

#### 1. XP/Level Reading from Smart Contract
All pages now read XP and Level directly from the smart contract instead of metadata:

- **collection.html**: 
  - Added `xpByToken()` and `levelOf()` to ABI
  - Reads XP onchain with fallback to metadata if contract call fails

- **deck-builder.html**: 
  - Added `xpByToken()` and `levelOf()` to ABI
  - Reads XP onchain for all cards

- **game.html**: 
  - Added ethers.js library
  - Created `updateXpOnchain()` function
  - Added XP calculation at game end:
    - Base: 10 XP per game
    - +5 XP per TOKEN (scopa)
    - +20 XP for win, +10 XP for tie
  - Calls `setXp()` on contract after each game (requires admin permission)

#### 2. Branch Merge
- Merged `codex/agent` branch into `main`
- Pushed all changes to origin

### Files Modified
- `collection.html` - XP onchain reading ✅
- `deck-builder.html` - XP onchain reading ✅
- `game.html` - XP reading + update after game ✅
- `AI-integration/COORDINATION.md` - This file ✅

---

## 📊 Project State

### Architecture Decision: FULL ONCHAIN
**Every card is an NFT with transferable XP:**
- XP is stored in `xpByToken` mapping on smart contract
- When card is transferred, XP goes with it (this is the card's value!)
- Level calculated as `1 + (XP / 100)`
- Frontend reads XP from contract, not metadata

### Completed ✅
- Smart contract V0.3.0 with batch minting deployed
- XP/Level stored onchain in contract
- Frontend reads XP from contract (collection, deck-builder)
- Game calculates and attempts XP update after each game
- Branch merged to main

### In Progress 🔄
- **Codex**: Cloudflare image storage setup
- XP update after game (requires admin permission or contract upgrade)

### Pending Actions ⏳
1. **XP Update Permission**: Currently `setXp()` is `onlyAdmin`
   - Option A: Add player wallet as admin (centralized)
   - Option B: Upgrade contract to allow owner to update own cards' XP
   - Option C: Create game verifier contract

---

## 🧾 Page & Asset Versions (Current)

### Pages
| Page | Version | XP Onchain |
|------|---------|------------|
| index.html | V1.4.7 | N/A |
| game.html | V1.7.9+ | ✅ Read + Update |
| collection.html | V1.8.0+ | ✅ Read |
| deck-builder.html | V1.8.0+ | ✅ Read |
| card-minter.html | V2.3.6 | N/A |
| deck-minter.html | V2.0.2 | N/A |
| admin.html | V1.2.2 | N/A |

### Smart Contracts (Base Sepolia)
| Contract | Version | Address |
|----------|---------|---------|
| TokenCard | V0.3.0 | `0x561F84D0b4246b64dFbAb1BDf87D6842412F1A18` |
| TokenDeck | V0.1.0 | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` |

### Contract ABI (TokenCard V0.3.0)
```solidity
// XP Functions
function xpByToken(uint256 tokenId) view returns (uint256)
function levelOf(uint256 tokenId) view returns (uint256)
function setXp(uint256 tokenId, uint256 xp) external // onlyAdmin

// Minting
function mint(string uri) returns (uint256)
function batchMint(string[] uris) returns (uint256[])

// Admin
function setAdmin(address, bool) // onlyOwner
function adminBurn(uint256 tokenId) // onlyAdmin
function setTokenUri(uint256 tokenId, string uri) // onlyAdmin
```

---

## 🎮 XP System

### How XP Works
1. **Storage**: `xpByToken[tokenId]` mapping in smart contract
2. **Level**: Calculated as `1 + (xp / 100)`
3. **Transfer**: XP travels with the NFT when transferred
4. **Value**: Cards with higher XP are more valuable

### XP Earning (per game)
| Action | XP |
|--------|-----|
| Play a game | +10 |
| Each TOKEN (scopa) | +5 |
| Win | +20 |
| Tie | +10 |
| Lose | +0 (still get base) |

### Current Limitation
`setXp()` requires admin permission. Options:
1. Add game server as admin
2. Modify contract for owner-only XP updates
3. Create verifier contract

---

## 🔄 Handoff to Codex

### Current State
- All code on `main` branch
- XP reading works from contract
- XP update coded but needs admin permission
- Cloudflare integration in progress (Codex)

### For Codex to Know
1. **DO NOT use Supabase** for game data - everything is onchain
2. **XP is onchain** - read from `xpByToken()` not metadata
3. **Images**: Codex is setting up Cloudflare storage
4. **Contract addresses** are in `assets/onchain-config.js`

### Suggested Next Steps
1. Complete Cloudflare image storage
2. Update card-minter/deck-minter to use Cloudflare for images
3. Test full flow: mint → deck builder → game → verify XP
4. Consider contract upgrade for XP permissions

---

## 📁 Important Files

| Path | Purpose |
|------|---------|
| `/contracts/TokenCard.sol` | Card NFT contract V0.3.0 |
| `/contracts/TokenDeck.sol` | Deck NFT contract V0.1.0 |
| `/assets/onchain-config.js` | Contract addresses |
| `/AI-integration/COORDINATION.md` | This file |
| `/supabase/` | Backend (PAUSED - not for game data) |

---

## 🚨 Critical Rules

1. **ONCHAIN ONLY** for cards, decks, XP - no Supabase for game data
2. **XP travels with NFT** - this is the card's value
3. **Always pull before starting work**
4. **Update this file after changes**
5. **Commit with descriptive messages**

---

## 📝 Session Log

### 2025-02-16 - Claude
- Implemented XP reading from smart contract (collection, deck-builder)
- Added XP update logic to game.html
- Merged codex/agent → main
- Updated coordination file

### 2025-02-16 - Codex (in progress)
- Working on Cloudflare image storage

### 2025-02-13 - Claude
- Upgraded TokenCard V0.2.0 → V0.3.0 with batchMint
- Created deployment documentation

---

## 🔗 Quick Links

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live Site**: https://token-ccg.vercel.app
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **TokenCard Contract**: https://sepolia.basescan.org/address/0x561F84D0b4246b64dFbAb1BDf87D6842412F1A18

---

end of coordination.md v1.2.0
