# TOKEN - Game Rules & Specifications

> Crypto Trading Card Game ispirato alle regole della Scopa italiana
> Blockchain: Base Network | Standard: ERC-721
> Versione: 0.3.0

---

## 📋 INDICE

1. [Overview](#overview)
2. [Card System](#card-system)
3. [Come Ottenere le Carte](#come-ottenere-le-carte)
4. [Deck Building](#deck-building)
5. [Gameplay](#gameplay)
6. [Punteggio](#punteggio)
7. [Sistema XP](#sistema-xp)
8. [Economy](#economy)
9. [Burn & Carte Speciali](#burn--carte-speciali)
10. [Specifiche Tecniche](#specifiche-tecniche)
11. [Glossario](#glossario)

---

## Overview

### Nome Gioco
**TOKEN**

### Concept
Gioco di carte collezionabili multiplayer ispirato alle regole della Scopa italiana. Le carte sono NFT su Base Network, guadagnano esperienza, possono essere scambiate e bruciate per sbloccare carte speciali.

### Cosa Serve per Giocare
- **2 mazzi da 10 carte ciascuno** (totale 20 carte per giocatore)
- Ogni mazzo deve essere di una **House diversa**
- Wallet connesso (per NFT e token) che contenga le carte che compongono i mazzi

---

## Card System

### Anatomia della Carta

```
┌─────────────────────────────┐
│ [HOUSE]            [VALORE] │  ← Header
├─────────────────────────────┤
│                             │
│    ┌───────────────────┐    │
│    │                   │    │
│    │   [IMMAGINE]      │    │  ← Area Centrale
│    │                   │    │
│    └───────────────────┘    │
│                             │
├─────────────────────────────┤
│      [NOME CARTA]           │  ← Nome (UPPERCASE)
│ [ICON]  [FACTION NAME]      │  ← Faction con icona
│ [████████ XP • LV]          │  ← Barra XP
└─────────────────────────────┘
```

### Houses (Semi Principali)

**V1.0**: 4 Houses disponibili (in futuro potranno essere aggiunte altre)

| House | Simbolo | Colore |
|-------|---------|--------|
| **Bitcoin** | ₿ | #F7931A (Arancione) |
| **Ethereum** | ◊ | #C0C0C0 (Argento) |
| **Base** | ■ | #0052FF (Blu) |
| **Tysm** | 🙏 | #10B981 (Verde) |

### Valori Carte

| Tipo | Valori | Come Ottenere |
|------|--------|---------------|
| **Base** | 2, 3, 4, 5, 6, 7, 8, 9 | Minting singolo o mazzo |
| **Figure** | 10, J (11) | Minting singolo o mazzo |
| **Asso** | A (1) | Mazzo completo mint o burn carte max XP |
| **Speciali** | Q (12), K (13), ⚔ (14), ★ (15) | Solo burn carte max XP |

### Factions (Sub-semi)

- Nome personalizzato dall'utente (UPPERCASE, max 20 char)
- Icona: emoji o immagine caricata
- Filtro anti-parolacce multilingua (Perspective API)
- **Regola unicità**: Una carta per valore per Faction
  - Es: Se esiste "7 - DEGENS", non puoi creare un altro "7 - DEGENS"
- **Ownership**: Una volta creata, la Faction è riutilizzabile solo da chi possiede già una carta di quella Faction nel wallet, e solo per valori che non esistano in altri wallet per quella Faction

---

## Come Ottenere le Carte

### 1. Comprare Mazzo Base
| Caratteristica | Dettaglio |
|----------------|-----------|
| **Contenuto** | 10 carte (valori 2-J) |
| **House** | Auto-assegnata (random) |
| **Faction** | Auto-generata |
| **Costo** | [TBD] TOKEN |
| **Ideale per** | Iniziare subito a giocare |

### 2. Mintare Mazzo Completo
| Caratteristica | Dettaglio |
|----------------|-----------|
| **Contenuto** | 10 carte personalizzate |
| **Valori** | 2-J + opzione Asso |
| **Personalizzazione** | House, Faction, nome carta, immagine |
| **Costo** | [TBD] TOKEN |
| **Ideale per** | Creare mazzo unico |

### 3. Mintare Carta Singola
| Caratteristica | Dettaglio |
|----------------|-----------|
| **Valori** | 2-J |
| **Personalizzazione** | Completa |
| **Costo** | [TBD] TOKEN o USDC (BASE) |
| **Regola** | Non puoi creare se esiste stesso valore nella stessa Faction |

### 4. Burn per Carte Speciali
Vedi sezione [Burn & Carte Speciali](#burn--carte-speciali)

---

## Deck Building

### Requisiti per Giocare

Ogni giocatore deve presentare **2 mazzi**:

| Requisito | Dettaglio |
|-----------|-----------|
| **Carte per mazzo** | 10 |
| **House** | Stessa House per tutte le 10 carte del mazzo |
| **Mazzi diversi** | I 2 mazzi devono essere di House DIVERSE |
| **Composizione Faction** | 8 carte stessa Faction + 2 carte altra Faction (stessa House) |
| **Composizione Valori** | 10 carte di valore unico (no duplicati) |

### Esempio Valido

**Mazzo 1 - Bitcoin:**
- 8 carte Faction "DEGENS" (House Bitcoin)
- 2 carte Faction "HODLERS" (House Bitcoin)
- Valori: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J (tutti diversi)

**Mazzo 2 - Ethereum:**
- 8 carte Faction "GAS LORDS" (House Ethereum)
- 2 carte Faction "MINTERS" (House Ethereum)
- Valori: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J (tutti diversi)

### Esempio NON Valido

- ❌ Mazzo con carte di House diverse
- ❌ Mazzo con meno di 10 carte
- ❌ Due mazzi della stessa House
- ❌ Mazzo con più di 2 Faction diverse
- ❌ Mazzo con valori duplicati (es: due carte valore 7)

---

## Gameplay

### Glossario Partita

| Termine | Definizione |
|---------|-------------|
| **TURNO** | Singola carta giocata da un giocatore |
| **MANO** | Ciclo di 3 carte pescate e giocate per ciascun giocatore |
| **GAME** | Una partita completa |
| **BATTLE** | Serie best-of-3 tra due giocatori |

### Setup Partita

#### 1. Lancio Moneta
Determina **Bull** e **Bear**:
- **Bull**: Sceglie dorso carte, gioca per primo
- **Bear**: Gioca per secondo

#### 2. JollyDraw
- Ogni giocatore toglie **1 carta da ciascun mazzo** (2 carte totali per giocatore)
- Le 2 JollyDraw di ogni giocatore vengono messe da parte, **mischiate e coperte**
- Sono le uniche carte che il giocatore sa di avere certamente a disposizione
- Possono dettare scelte strategiche

#### 3. Preparazione Mazzo di Gioco
- Le carte restanti dei 4 mazzi (36 carte: 9+9+9+9) si mischiano insieme
- Formano un **unico mazzo di pesca**

#### 4. Distribuzione Iniziale
1. Ogni giocatore pesca **3 carte** (mano iniziale)
2. Le successive **4 carte** vengono messe **scoperte a tavola** (plancia)

### Turno di Gioco

1. Il giocatore di turno gioca **1 carta** dalla mano

2. **Regole di presa** (in ordine di priorità):

| Priorità | Tipo | Regola |
|----------|------|--------|
| 1 | **Presa diretta** | Se a tavola c'è carta dello stesso valore → DEVE prenderla |
| 2 | **Presa per somma** | Se può sommare carte a tavola per uguagliare il valore → DEVE prenderle |
| 3 | **Scarto** | Se non può prendere nulla → piazza la carta scoperta sul tavolo |

3. **TOKEN**: Se prendendo **svuota la plancia**, realizza un TOKEN che:
   - Vale punti nel punteggio finale
   - Dà +5 XP alla carta che ha realizzato la presa
   - La carta viene mostrata nel mazzo prese **trasversalmente a faccia in su**

4. **Fine turno** → Passa il turno all'avversario

### Fine Mano

Quando entrambi i giocatori hanno giocato le loro 3 carte:
- Pescano altre **3 carte** dal mazzo
- **Dal secondo turno in poi**: 1 delle 3 carte può essere la JollyDraw superiore nel proprio mazzo coperto
- **Ultima mano**: Se le carte non bastano, si è **obbligati** a prendere entrambe le JollyDraw

### Fine Game

1. I giocatori finiscono l'ultima mano e non hanno più carte da pescare

2. **Carte residue sulla plancia** vengono assegnate secondo questa priorità:
   1. Al giocatore che ha fatto l'**ultimo TOKEN**
   2. Se nessuno ha fatto TOKEN → al giocatore con **più carte prese**
   3. Se parità carte → al giocatore con **più carte valore 15**
   4. Se ancora parità → a scendere di valore (14, 13, 12, 11, A, 10, 9...)
   
   > **Nota**: L'Asso in questa valutazione si posiziona tra J(11) e Q(12)

### Battle (Best of 3)

Una BATTLE è una serie tra due giocatori:
- **Best of 3 Games** (vince chi arriva a 2)
- Alla fine del 1° e 2° Game (se si è 1-1): **voto cieco** per raddoppiare
- Se entrambi votano SÌ: chi vince 2 Game vince l'**intero jackpot** (con deduzioni)

---

## Punteggio

### Punti Game

| Punto | Condizione | Note |
|-------|------------|------|
| **Carte** | Chi raccoglie più carte (>20 su 40) | Parità = 0 punti a entrambi |
| **TOKEN** | Ogni volta che si svuota il tavolo | 1 punto per TOKEN |
| **Carte Speciali** | Chi raccoglie più carte 12-15 | 2 punti totali |
| **Primiera (Assi)** | Chi raccoglie più Assi | 1 punto |

---

## Sistema XP

### XP per Partecipazione
Ogni carta guadagna XP per ogni Game in cui è **inclusa nel mazzo iniziale**:

| Evento | XP Guadagnati | Applicato a |
|--------|---------------|-------------|
| Inclusa nel mazzo | +1 XP | La carta |
| Carta fa TOKEN | +5 XP | La carta che fa la presa |
| Giocatore prende più carte speciali | +2 XP | Ogni carta del deck del giocatore |
| Carta prende un Asso | +0.2 XP | La carta che fa la presa |
| Vittoria Game | +5 XP | Ogni carta del deck vincitore |

### Livelli XP

| Livello | XP Range | Colore Barra | Benefici |
|---------|----------|--------------|----------|
| 1 | 0 - 99 | Grigio | - |
| 2 | 100 - 299 | Verde | - |
| 3 | 300 - 599 | Blu | - |
| 4 | 600 - 999 | Viola | - |
| MAX | 1000+ | Oro | Può essere bruciata |

---

## Burn & Carte Speciali

### Come Funziona il Burn

| Requisito | Dettaglio |
|-----------|-----------|
| **Carte richieste** | Carte a livello MAX (1000+ XP) |
| **XP totali richiesti** | [TBD] XP complessivi tra le carte bruciate |
| **Stessa Faction** | Tutte le carte bruciate devono essere della stessa Faction |
| **Risultato** | 1 carta speciale (A, Q, K, ⚔, o ★) della stessa Faction |
| **Permanente** | Le carte bruciate vengono **distrutte per sempre** |

### Carte Speciali Ottenibili

| Carta | Valore | Rarità |
|-------|--------|--------|
| **Asso (A)** | 1 | Rara |
| **Queen (Q)** | 12 | Epica |
| **King (K)** | 13 | Epica |
| **Knight (⚔)** | 14 | Leggendaria |
| **Star (★)** | 15 | Leggendaria |

---

## Economy

### Token di Gioco
- **Nome**: [TBD]
- **Simbolo**: [TBD]
- **Blockchain**: Base Network

### Entry Fee Partite

| Tier | Entry Fee | Montepremi | Fee Gioco (10%) |
|------|-----------|------------|-----------------|
| Bronze | 1,000 TOKEN | 2,000 | 200 |
| Silver | 5,000 TOKEN | 10,000 | 1,000 |
| Gold | 10,000 TOKEN | 20,000 | 2,000 |
| Diamond | 50,000 TOKEN | 100,000 | 10,000 |
| **High Stake** | >50,000 TOKEN | Personalizzato | 10% |

### Distribuzione Montepremi

| Destinazione | Percentuale |
|--------------|-------------|
| **Vincitore** | 80% |
| **Fee Gioco** | 10% |
| **Redistribuzione punti** | 10% (diviso equamente per ogni punto fatto, a entrambi i giocatori) |

### Marketplace
- Trading carte P2P interno
- Compatibilità OpenSea
- Royalties su vendite secondarie: [TBD]%

---

## Specifiche Tecniche

### Stack Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Vite + Parcel

### Blockchain
- Network: Base (L2 Ethereum)
- Standard: ERC-721
- Wallet: RainbowKit / wagmi

### NFT Metadata Structure

```json
{
  "name": "Bitcoin 7 - DEGENS",
  "description": "TOKEN Card",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "House", "value": "Bitcoin" },
    { "trait_type": "Value", "value": 7 },
    { "trait_type": "Faction", "value": "DEGENS" },
    { "trait_type": "Faction_Icon", "value": "⚔️" },
    { "trait_type": "XP", "value": 0 },
    { "trait_type": "Level", "value": 1 },
    { "trait_type": "Games_Played", "value": 0 }
  ]
}
```

### Content Moderation
- Perspective API (Google) per filtro multilingua
- Lingue: EN, IT, ES, FR, DE, PT
- Soglia: 0.7 (70% certezza tossicità)

### Storage
- Immagini: IPFS (Pinata o NFT.Storage)
- Metadata: On-chain + IPFS
- Database locale (dev): LocalStorage

---

## Glossario

| Termine | Definizione |
|---------|-------------|
| **House** | Seme principale (Bitcoin, Ethereum, Base, Tysm) |
| **Faction** | Sub-seme creato dall'utente |
| **TOKEN** | Presa che svuota la plancia (equivalente della "Scopa") |
| **JollyDraw** | Carte messe da parte all'inizio, pescabili strategicamente |
| **Plancia** | Le carte scoperte sul tavolo |
| **Mano** | Ciclo di 3 carte pescate e giocate |
| **Turno** | Singola carta giocata |
| **Game** | Una partita completa |
| **Battle** | Serie best-of-3 tra due giocatori |
| **Bull** | Giocatore che vince il lancio moneta, gioca primo |
| **Bear** | Giocatore che perde il lancio moneta, gioca secondo |
| **Burn** | Distruggere carte per ottenere carte speciali |

---

## Decisioni Pending ❓

- [ ] Nome e simbolo token
- [ ] Costi minting (mazzo base, completo, singola carta)
- [ ] XP totali richiesti per burn
- [ ] Royalties marketplace
- [ ] Sistema ranked/ELO
- [ ] Regole per carte speciali nel deck (quante? obbligatorie?)

---

## Changelog

| Versione | Data | Modifiche |
|----------|------|-----------|
| 0.1.0 | Feb 2025 | Prima stesura |
| 0.2.0 | Feb 2025 | Rinominato in TOKEN, aggiunte regole deck building e gameplay base |
| 0.3.0 | Feb 2025 | Completate regole gameplay, XP, punteggio, Battle, glossario |

---

*Versione: 0.3.0 | Ultimo aggiornamento: Febbraio 2025*
