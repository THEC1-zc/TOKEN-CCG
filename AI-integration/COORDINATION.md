# coordination.md v2.0.0 - HARD RULES + PRODUCT ROADMAP

## ⚠️ HARD RULES - LEGGERE PRIMA DI OGNI MODIFICA

1. **MAI localStorage** - solo come cache momentanea, MAI come storage dati
2. **MINT = NFT COMPLETO** - ogni mint crea NFT con immagine su R2, visibile in wallet
3. **ONCHAIN = verità** - cards, XP, ownership dal contratto
4. **SUPABASE = backend** - user stats, battle decks, game history
5. **OGNI MODIFICA = PRODOTTO FUNZIONANTE** - no prove, no vicoli ciechi
6. **AGGIORNA SEMPRE COORDINATION** - prima di codificare: leggi. dopo: aggiorna.

---

## 🎯 PRODUCT ROADMAP

### ✅ FASE 1 - MINT (in corso)
- [x] TokenCard V0.5.0 deployed
- [ ] Card Minter → mint + upload R2 automatico
- [ ] Deck Minter → batch mint + upload R2 automatico
- [ ] Collection → legge NFT dal wallet

### ⏳ FASE 2 - PLAY
- [ ] Deck Builder → crea Battle Deck (salva su Supabase)
- [ ] Game → usa Battle Deck reale
- [ ] XP Claim → transazione a fine partita

### 🔮 FASE 3 - PVP
- [ ] Matchmaking
- [ ] Game PvP

### 🔮 FASE 4 - TOKEN
- [ ] $TOKEN integration
- [ ] Fees in-game

### 🔮 FASE 5 - BURN & MINT 12-15
- [ ] Burn mechanic
- [ ] Mint carte speciali 12-15

---

## 🔧 CONTRACTS

| Contract | Address | Chain |
|----------|---------|-------|
| TokenCard V0.5.0 | `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99` | Base Sepolia |
| TokenGame V0.1.0 | `0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005` | Base Sepolia |
| TokenDeck V0.1.0 | `0xc75170E7268A25CE759cEe019F1c6030F414a82d` | Base Sepolia |

---

## 📁 API ENDPOINTS

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `/api/upload-card` | **NONE** | Upload image+metadata (public) |
| `/api/metadata/[tokenId]` | None | Read metadata |
| `/api/admin/upload-card` | admin key | Admin upload (deprecated) |

**Protezione anti-spam**: L'utente DEVE pagare gas per mintare. Questo è il filtro.

---

## 🎮 FLUSSI

### MINT CARD
```
User apre card-minter
  → Configura carta
  → Clicca MINT
  → Firma transazione (paga gas)
  → NFT creato onchain
  → Immagine uploadata su R2 (automatico)
  → Carta visibile in wallet ✓
```

### MINT DECK (10 carte)
```
User apre deck-minter
  → Sceglie House + Faction
  → Clicca MINT
  → Firma transazione batch (paga gas)
  → 10 NFT creati onchain
  → 10 immagini uploadate su R2
  → Carte visibili in wallet ✓
```

### COLLECTION
```
User apre collection
  → Legge NFT dal wallet (ownerOf)
  → Fetch metadata da R2
  → Mostra carte per House/Faction/XP
```

### BATTLE DECK (Supabase)
```
User apre deck-builder
  → Vede proprie carte (dal wallet)
  → Seleziona 20 carte (2 deck da 10)
  → Salva → POST /api/battle-deck (Supabase)
```

### GAME + XP
```
User apre game
  → Carica Battle Deck da Supabase
  → Gioca vs AI
  → Fine partita → Claim XP (transazione)
  → Stats salvate su Supabase
```

---

## 📝 SESSION LOG

### 2026-02-17 - Claude
- Creato `/api/upload-card` pubblico (no admin key)
- Aggiornato card-minter e deck-minter per usare endpoint pubblico
- Definite HARD RULES
- Definita ROADMAP prodotto

---

## 🔗 LINKS

- **Repo**: https://github.com/THEC1-zc/TOKEN-CCG
- **Live**: https://token-ccg.vercel.app
- **Contracts**: Base Sepolia

---

end of coordination.md v2.0.0
