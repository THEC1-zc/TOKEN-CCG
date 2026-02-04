# TOKEN - Project Roadmap

> Ultimo aggiornamento: 4 Febbraio 2026
> Versione: V0.2.1

---

## 📊 STATUS PROGETTO

```
█████████████████████░░░░░░ 65% Complete
```

**Fase attuale**: Offchain Testing Suite ✅ → Supabase Data Layer (WIP) → Multiplayer & Blockchain

---

## 🏷️ VERSIONING

Formato: `FILENAME_vX.Y.Z.ext`
- **X** = Major (cambiamenti breaking)
- **Y** = Minor (nuove feature)  
- **Z** = Patch (bug fix)

---

## 📋 GAME DESIGN (Teorico)

### ✅ Completato
- [x] Nome gioco: TOKEN
- [x] Card System (4 Houses, valori 2-15, Factions custom)
- [x] Regola unicità: 1 carta per valore per Faction
- [x] 4 metodi per ottenere carte (base, mazzo, singola, burn)
- [x] Deck Building: 2 mazzi, 10 carte, 8+2 Factions, House diverse
- [x] Gameplay completo (setup, JollyDraw, turni, fine game)
- [x] Sistema punteggio (Carte, TOKEN, Speciali, Assi)
- [x] Sistema XP (5 livelli, eventi XP)
- [x] Economy (entry fee tiers, 80/10/10 split)
- [x] Battle system (best of 3, voto cieco)
- [x] Glossario termini

### ⚠️ Da Completare
- [ ] XP totali richiesti per burn carte speciali
- [ ] Regole carte speciali nel deck (quante? obbligatorie?)

### ❌ Da Decidere
- [ ] Nome e simbolo token
- [ ] Costi minting (mazzo base, completo, singola)
- [ ] Royalties marketplace
- [ ] Sistema Ranked/ELO

---

## 💻 SVILUPPO (Pratico)

### ✅ Fase 1: Card System - COMPLETATO
- [x] Template carta HTML/CSS
- [x] card-minter_v1.7.2.html
  - [x] Selezione House (4)
  - [x] Selezione Value (2-J)
  - [x] Input Card/Faction Name (UPPERCASE, max 16 char)
  - [x] Filtro parolacce locale (multilingua)
  - [x] Perspective API predisposta
  - [x] Faction Icon (emoji picker + upload)
  - [x] Database Faction locale (LocalStorage)
  - [x] Upload immagine carta
  - [x] Preview live carta
  - [x] Safari storage fix
  - [x] Fix PNG template (proporzioni corrette)
  - [x] Colore nome carta = colore House
- [x] deck-minter_v1.1.0.html
  - [x] Generazione 10 carte automatica
  - [x] House random
  - [x] Faction name personalizzabile
  - [x] Download ZIP
  - [x] Salvataggio LocalStorage

### ✅ Fase 2: Deck Building - COMPLETATO
- [x] collection_v1.0.0.html
  - [x] Griglia carte (minter + deck)
  - [x] Filtri (House, Faction, Value)
  - [x] Ordinamento (Data, Valore, House)
  - [x] Ricerca
  - [x] Modal dettaglio carta
  - [x] Download PNG
  - [x] Elimina carta
- [x] deck-builder_v1.0.0.html
  - [x] 2 deck panels (10 slot ciascuno)
  - [x] Drag & drop carte
  - [x] Click to add
  - [x] Validazione real-time
  - [x] House selector
  - [x] Regola 8+2 Factions
  - [x] Valori unici check
  - [x] Salvataggio Battle Deck
  - [x] Load/Delete saved decks

### ✅ Fase 3: Game Core - COMPLETATO
- [x] game_v1.0.0.html
  - [x] Setup screen (select battle deck)
  - [x] Game table UI
  - [x] AI hand (face down)
  - [x] Player hand (selectable)
  - [x] Table cards
  - [x] JollyDraw system
  - [x] Capture logic (direct + sum)
  - [x] TOKEN detection
  - [x] Turn system
  - [x] Score calculation
  - [x] Game over screen

### ✅ Fase 4: Single Player - COMPLETATO
- [x] AI Opponent (logica base)
  - [x] Priorità cattura
  - [x] Play lowest if no capture
- [x] index.html (Hub navigazione)
  - [x] Stats dashboard
  - [x] Menu cards
  - [x] Quick actions
  - [x] How to play guide
  - [x] Quick rules

### 🟡 Fase 5: Data Layer (Supabase) - IN CORSO
- [x] Client Supabase integrato nei file HTML principali
- [x] Guest user helper per test offchain
- [x] Lettura collezione/mazzi/battle deck da Supabase (con fallback locale)
- [ ] Minting carte su DB (fix RLS/permessi/errori runtime)
- [ ] Minting deck/battle deck su DB
- [ ] Storage bucket per immagini carte
- [ ] Upload immagine carta su Storage + URL nel DB
- [ ] Disattivare fallback locale dopo stabilizzazione

### ❌ Fase 6: Multiplayer - DA FARE
- [ ] WebSocket integration
- [ ] Matchmaking
- [ ] Battle system (best of 3)
- [ ] Real-time sync

### ❌ Fase 7: Blockchain - DA FARE
- [ ] Smart Contract ERC-721
- [ ] Wallet integration (RainbowKit)
- [ ] Minting on-chain
- [ ] XP update on-chain
- [ ] Burn mechanism
- [ ] OpenSea compatibility

### ❌ Fase 8: Economy - DA FARE
- [ ] Token integration
- [ ] Entry fee system
- [ ] Payout distribution
- [ ] Marketplace interno

### ❌ Fase 9: Polish - DA FARE
- [ ] Sound effects
- [ ] Animazioni
- [ ] Mobile optimization
- [ ] Leaderboard
- [ ] Achievements

---

## 🎯 PROSSIME AZIONI (Sprint Prossimo)

### Priorità 🔴 ALTA

| # | Task | Stato | Output |
|---|------|-------|--------|
| 1 | Fix minting Supabase (RLS/permessi/console error) | ⏳ | DB write OK |
| 2 | Storage bucket + upload carte | ⏳ | URL immagini su DB |
| 3 | Verifica end-to-end mint → collection | ⏳ | QA Report |

### Priorità 🟡 MEDIA

| # | Task | Stato | Output |
|---|------|-------|--------|
| 4 | Test completo su Safari Mac | ⏳ | QA Report |
| 5 | Mobile responsive check | ⏳ | CSS fixes |
| 6 | Tutorial interattivo | ❌ | tutorial_v1.0.0.html |

### Priorità 🟢 BASSA

| # | Task | Stato | Output |
|---|------|-------|--------|
| 7 | AI migliorata | ❌ | game_v1.1.0.html |
| 8 | Sound effects base | ❌ | sounds/ folder |
| 9 | Animazioni carte | ❌ | CSS animations |

---

## 📁 FILE PROGETTO

### Documentazione

| File | Descrizione | Versione |
|------|-------------|----------|
| `TOKEN_RULES_v0.3.0.md` | Regole gioco complete | 0.3.0 |
| `ROADMAP_v0.2.0.md` | Questo file | 0.2.0 |
| `CARD_TEMPLATE_v1.0.0.md` | Specifiche template carta | 1.0.0 |
| `ARCHITECTURE_v1.0.0.md` | Architettura sistema | 1.0.0 |
| `PERSPECTIVE_API_SETUP.txt` | Istruzioni API | 1.0.0 |

### Applicazioni

| File | Descrizione | Versione |
|------|-------------|----------|
| `index.html` | Hub principale | 1.4.1 |
| `card-minter.html` | Crea carta singola | 2.1.1 |
| `deck-minter.html` | Genera mazzo 10 carte | 1.6.1 |
| `collection.html` | Visualizza collezione | 1.5.1 |
| `deck-builder.html` | Costruisci Battle Deck | 1.6.1 |
| `game.html` | Gameplay | 1.7.3 |
| `game_v1.0.0.html` | Gioca vs AI | 1.0.0 |

---

## 📝 NOTE SESSIONE

### Sessione 1 (Feb 2025)
- Creato Card Minter base
- Testato su Safari Mac
- Fix quota LocalStorage
- Identificato bug XP bar tagliata
- Scritte regole gioco complete
- Creata roadmap

### Sessione 2 (Feb 2025)
- ✅ Fix PNG template (proporzioni 15/55/30%)
- ✅ Colore nome carta = colore House
- ✅ Max 16 caratteri per nome carta/faction
- ✅ Creato CARD_TEMPLATE_v1.0.0.md
- ✅ Creato deck-minter_v1.1.0 con faction personalizzabile
- ✅ Creato ARCHITECTURE_v1.0.0.md
- ✅ Creato collection_v1.0.0.html
- ✅ Creato deck-builder_v1.0.0.html
- ✅ Creato game_v1.0.0.html (vs AI)
- ✅ Creato index.html (Hub)
- 🎉 **TESTING SUITE OFFCHAIN COMPLETA!**

### Prossima sessione
- [ ] Test completo su Safari Mac
- [ ] Fix bug emersi
- [ ] Iniziare Fase 5 (Multiplayer) o Fase 8 (Polish)

---

## 🔄 CHANGELOG ROADMAP

| Versione | Data | Modifiche |
|----------|------|-----------|
| 0.1.0 | Feb 2025 | Creazione roadmap, sistema versioning |
| 0.1.1 | Feb 2025 | Completata Fase 1 Card System |
| 0.2.0 | Feb 2025 | Completate Fasi 1-4, Testing Suite Offchain completa |

---

## QUICK START GUIDE

```
1. Apri index.html nel browser
2. Click "Quick Start" → genera 2 deck con deck-minter
3. Vai a Deck Builder → componi 2 mazzi da 10 carte
4. Salva il Battle Deck
5. Click "PLAY GAME"
6. Seleziona il tuo Battle Deck
7. START GAME → Gioca vs AI!
```

---

*Per aggiornare: modifica questo file e caricalo nella prossima sessione*
