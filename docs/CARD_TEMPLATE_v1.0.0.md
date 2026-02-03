# TOKEN - Card Template Specifications

> Versione: 1.0.0
> Ultimo aggiornamento: Febbraio 2025

---

## 📐 Dimensioni

| Proprietà | Valore | Note |
|-----------|--------|------|
| **Aspect Ratio** | 2:3 | Fisso, non modificabile |
| **Base Size** | 180 × 270 px | Dimensione riferimento |
| **Export Size** | 540 × 810 px | 3x scale per qualità |
| **Border Radius** | ~6.7% della larghezza | ~12px a 180w |
| **Border Width** | ~1.2% della larghezza | ~2px a 180w |

---

## 📊 Layout Proporzioni

```
┌─────────────────────────────┐
│                             │
│          HEADER             │  15% altezza
│                             │
├─────────────────────────────┤
│                             │
│                             │
│          CENTER             │  55% altezza
│       (Image Area)          │
│                             │
│                             │
├─────────────────────────────┤
│          FOOTER             │  30% altezza
│   Name / Faction / XP       │
└─────────────────────────────┘
```

### Header (15%)
- Sfondo: rgba(0,0,0,0.2)
- Linea separazione: colore House con 44% opacità
- **House Symbol**: sinistra, 8% altezza carta come font-size
- **Value**: destra, 11% altezza carta come font-size, colore bianco

### Center (55%)
- **Image Area**: quadrata, centrata
- Padding: 7.5% larghezza carta
- Border radius: 5.5% larghezza carta
- Background: gradiente #1f1f35 → #12121f
- Border: colore House con 66% opacità

### Footer (30%)
- Background: rgba(0,0,0,0.4)
- Padding laterale: 6.7% larghezza carta

| Elemento | Posizione | Font Size | Colore |
|----------|-----------|-----------|--------|
| **Card Name** | 18% dall'alto del footer | 5.5% altezza | Colore House |
| **Faction Frame** | 35% dall'alto | 28% altezza footer | Bordo House |
| **XP Bar** | 8% sotto faction | 20% altezza footer | Grigio |

---

## 🎨 Colori Houses

| House | Simbolo | Primary | Secondary |
|-------|---------|---------|-----------|
| **Bitcoin** | ₿ | #F7931A | #FFD93D |
| **Ethereum** | ◊ | #C0C0C0 | #E8E8E8 |
| **Base** | ■ | #0052FF | #5C9DFF |
| **Tysm** | 🙏 | #10B981 | #6EE7B7 |

### Uso Colori
- **Border**: Gradiente Primary → Secondary (135°)
- **Card Name**: Primary
- **Faction Name**: Primary
- **House Symbol**: Primary con glow
- **Image Border**: Primary 66% opacità

---

## 🔤 Tipografia

| Elemento | Font | Weight | Size (% altezza) |
|----------|------|--------|------------------|
| **House Symbol** | Arial | Bold | 8% |
| **Value** | Arial | Bold | 11% |
| **Card Name** | Arial | Bold | 5.5% |
| **Faction Name** | Arial | Bold | 3.3% |
| **XP Text** | Monospace | Bold | 2.8% |

### Allineamento
- **Card Name**: Centro (orizzontale)
- **Faction Name**: Centro (orizzontale), ignora icona
- **XP Text**: Centro

---

## 📝 Limiti Testo

| Campo | Max Caratteri | Formato |
|-------|---------------|---------|
| **Card Name** | 16 | UPPERCASE |
| **Faction Name** | 16 | UPPERCASE |

---

## 🖼️ Image Area

### Con Immagine Caricata
- **Fit**: Contain (mostra immagine intera)
- **Padding interno**: 3% dell'area
- **Allineamento**: Centrato orizzontale e verticale

### Senza Immagine (Placeholder)
- **Contenuto**: Valore carta (2-J, Q, K, etc.)
- **Font size**: 50% dell'area immagine
- **Opacità**: 60%
- **Colore**: Random tra palette

### Palette Colori Placeholder
```
#F7931A  (Arancio)
#C0C0C0  (Argento)
#0052FF  (Blu)
#10B981  (Verde)
#FFD700  (Oro)
#A855F7  (Viola)
#EC4899  (Rosa)
#06B6D4  (Ciano)
```

---

## 🏷️ Faction Frame

```
┌─────────────────────────────────┐
│ [ICON]      [FACTION NAME]      │
└─────────────────────────────────┘
```

| Proprietà | Valore |
|-----------|--------|
| **Border** | 2px gradiente House |
| **Inner Background** | Gradiente #1a1a2e → #0f0f1a |
| **Border Radius** | 6px esterno, 4px interno |
| **Icon Size** | 60% altezza frame |
| **Icon Position** | Sinistra, 5% padding |

### Faction Icon
- **Tipo**: Emoji o Immagine caricata
- **Se Emoji**: Centrato verticalmente nel box
- **Se Immagine**: Clippata con border-radius 4px

---

## 📊 XP Bar

```
┌─────────────────────────────────┐
│         0 XP • LV1              │
└─────────────────────────────────┘
```

| Proprietà | Valore |
|-----------|--------|
| **Background** | #1a1a24 |
| **Border** | 1px #3f3f46 |
| **Border Radius** | 50% dell'altezza (pill) |
| **Text Color** | #FFFFFF |
| **Font** | Monospace Bold |

### Livelli XP (per riferimento)

| Livello | XP Range | Colore Fill |
|---------|----------|-------------|
| 1 | 0 - 99 | #71717A (Grigio) |
| 2 | 100 - 299 | #22C55E (Verde) |
| 3 | 300 - 599 | #3B82F6 (Blu) |
| 4 | 600 - 999 | #A855F7 (Viola) |
| MAX | 1000+ | #FFD700 (Oro) |

---

## 📤 Export

### Filename Format
```
token_[house]_[value]_[cardname].png
```

**Esempi:**
- `token_bitcoin_7_claude.png`
- `token_ethereum_J_mycard.png`
- `token_base_10_test.png`

### Specifiche Export
| Proprietà | Valore |
|-----------|--------|
| **Formato** | PNG |
| **Dimensioni** | 540 × 810 px |
| **Qualità** | Lossless |
| **Background** | Incluso (no trasparenza) |

---

## 🔢 Valori Carta

| Display | Valore Numerico | Tipo |
|---------|-----------------|------|
| 2-10 | 2-10 | Base |
| J | 11 | Figura |
| A | 1 | Asso (speciale) |
| Q | 12 | Regina (speciale) |
| K | 13 | Re (speciale) |
| ⚔ | 14 | Cavaliere (speciale) |
| ★ | 15 | Stella (speciale) |

---

## 📱 Responsive Sizes (UI Preview)

| Size Name | Dimensioni | Uso |
|-----------|------------|-----|
| **Small** | 120 × 180 px | Gallery, lista |
| **Medium** | 150 × 225 px | Deck builder |
| **Large** | 180 × 270 px | Preview, dettaglio |

---

## Changelog

| Versione | Data | Modifiche |
|----------|------|-----------|
| 1.0.0 | Feb 2025 | Prima versione con specifiche complete |

---

*Documento di riferimento per sviluppo template carta TOKEN*
