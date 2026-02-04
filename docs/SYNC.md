# TOKEN-CCG - Sync & Coordination

Version: V1.1.0

## 📍 Project Info
- **Repo:** https://github.com/THEC1-zc/TOKEN-CCG
- **Live:** https://token-ccg.vercel.app
- **Last Update:** 2026-02-04

---

## 🤖 AI Assistants Division

### **Codex (ChatGPT)**
- ✅ Modifiche codice rapide
- ✅ Fix bug UI/UX
- ✅ Implementazione features frontend
- ✅ Refactoring
- ✅ Aggiorna questo file dopo ogni sessione

### **Claude**
- ✅ Architettura backend (Supabase)
- ✅ Schema database
- ✅ Smart contracts (Solidity)
- ✅ Planning & Roadmap
- ✅ Code review
- ✅ Documentazione tecnica

---

## 📁 Current File Structure

```
TOKEN-CCG/
├── assets/
│   ├── cardback.svg
│   ├── game-bg.svg            # Game board background with logo
│   ├── header.css             # Global header styles
│   ├── main icon.png
│   ├── token_icon.png
│   ├── wallet-ui.css          # Wallet header UI
│   └── wallet-ui.js
├── docs/
│   ├── rules.md
│   ├── roadmap.md
│   ├── log.md
│   └── SYNC.md
├── index.html                 # Homepage
├── game.html                  # Game v1.6.4 (mobile-first)
├── deck-builder.html          # Deck Builder v1.5.1
├── deck-minter.html           # Deck Minter v1.5.4
├── card-minter.html           # Card Minter v2.0.2
├── collection.html            # Collection Viewer v1.3.3
├── generate-cardback.html
├── cardback.png               # Card back image (root)
├── coding rules.md            # Coding guidelines
└── vercel.json                # Vercel config
```

---

## 🎮 Current Versions

| Component | Version | Status |
|-----------|---------|--------|
| Game | v1.6.4 | ✅ Mobile-first, timer 15s, surrender, collapsible log + cardback |
| Deck Builder | v1.5.1 | ✅ Faction auto-select + quick-load by faction |
| Deck Minter | v1.5.4 | ✅ House/Icon selectors + color updates |
| Card Minter | v2.0.2 | ⚠️ Bug: cards not saving to collection |
| Collection | v1.3.3 | ✅ Working |
| Home | v1.3.5 | ✅ Global header + TOKEN wordmark |

---

## 🗺️ Roadmap

### Phase 1 - Backend (IN PROGRESS)
- [ ] Setup Supabase project
- [ ] Create DB schema (users, cards, decks, games)
- [ ] Migrate from localStorage to Supabase
- [ ] API endpoints

### Phase 2 - Auth
- [ ] Wallet connect (Coinbase/MetaMask)
- [ ] Farcaster login
- [ ] Link wallet ↔ user

### Phase 3 - Onchain (Read Only)
- [ ] Deploy contract on Base Sepolia
- [ ] Register cards/decks onchain
- [ ] No transactions yet

### Phase 4 - Onchain (Transactions)
- [ ] NFT minting
- [ ] Burn mechanics
- [ ] Trading

---

## 🐛 Known Issues

1. **Card Minter** - Cards not being added to collection (localStorage issue)
2. **Card Minter** - Should block duplicate values per faction
3. **Vercel** - Deploy delay (wait for build before verifying UI)

---

## 📝 Changelog

### 2026-02-04
- Global header added across pages (logo, breadcrumb, quick actions, status, wallet).
- Wallet dropdown added (Farcaster/Base/Wallet) with shared assets.
- TOKEN wordmark switched to `token_icon.png` and resized (responsive).
- House colors standardized (BTC orange, ETH silver, Base blue, Tysm blue; no background).
- Deck Builder: added quick-load by faction (auto house + fill).
- Game: cardback path fixed.

### 2025-02-04
- Game v1.4.0: Complete mobile-first redesign
  - New layout: Header (surrender, wallet, timer) | Score bar | Game board | Footer log
  - Player rows: JD pile | Hand | Captures pile
  - 15s turn timer with auto-play
  - Surrender button (0-3 loss, 0 XP)
  - Collapsible game log in footer
  - game-bg.svg background with TOKEN logo
  - cardback.png for all card backs
- Deck Builder v1.1.0: Faction auto-select feature
- Repo made public
- Started Supabase backend planning

### 2025-02-03
- Game v1.2.0: Play animations, game log
- Beta deployment to Vercel
- GitHub repo setup

---

## 🔧 For Codex

When making changes:
1. Update the **Changelog** section with date and changes
2. Update **Current Versions** table if version changes
3. Update **Known Issues** if bugs are fixed or found
4. Keep file structure updated

Example changelog entry:
```
### YYYY-MM-DD
- Component vX.X.X: Brief description
  - Detail 1
  - Detail 2
```

---

## 🔧 For Claude

When reviewing/planning:
1. Check this file first for current state
2. Update Roadmap progress
3. Add architectural decisions to docs/
4. Coordinate with user on Supabase credentials

---

## 🔑 Environment (DO NOT COMMIT SECRETS)

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

User will provide these separately.

---

## 📞 Sync Protocol

1. **Start of session:** Read SYNC.md for context
2. **During work:** Make changes, test
3. **End of session:** Update SYNC.md changelog
4. **Switch AI:** Other AI reads updated SYNC.md
