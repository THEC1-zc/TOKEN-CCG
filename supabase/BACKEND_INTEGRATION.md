# TOKEN-CCG Backend Integration Guide

Version: V1.0.0

## ✅ Completed Steps

1. ✅ Supabase project created
2. ✅ Database schema deployed (users, cards, decks, battle_decks, games)
3. ✅ Row Level Security (RLS) enabled
4. ✅ Client JS created (`supabase/supabase-client.js`)

---

## 🔧 Integration Tasks

### Task 1: Add Supabase to All HTML Files

Add these scripts before `</body>` in every HTML file:

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<!-- TOKEN DB Client -->
<script src="supabase/supabase-client.js"></script>
<script>
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    TokenDB.init();
  });
</script>
```

**Files to update:**
- [ ] index.html
- [ ] card-minter.html
- [ ] deck-minter.html
- [ ] deck-builder.html
- [ ] collection.html
- [ ] game.html

---

### Task 2: Update Card Minter

**File:** `card-minter.html`

**Changes needed:**

1. **Check for duplicate values before minting:**
```javascript
// Before creating card, check if value exists in faction
async function canMintCard(factionName, value) {
  const userId = await getCurrentUserId(); // implement this
  const cards = await TokenDB.getUserCards(userId);
  return !cards.some(c => c.faction_name === factionName && c.value === value);
}
```

2. **Save to Supabase instead of localStorage:**
```javascript
// OLD (localStorage)
const cards = JSON.parse(localStorage.getItem('token_cards') || '[]');
cards.push(newCard);
localStorage.setItem('token_cards', JSON.stringify(cards));

// NEW (Supabase)
await TokenDB.createCard(userId, {
  house: newCard.house,
  factionName: newCard.factionName,
  factionIcon: newCard.factionIcon,
  value: parseInt(newCard.value),
  displayValue: newCard.displayValue,
  cardName: newCard.cardName
});
```

3. **Add duplicate check UI feedback:**
```javascript
// Show error if duplicate
if (!await canMintCard(factionName, value)) {
  alert(`Card with value ${displayValue} already exists in ${factionName}!`);
  return;
}
```

---

### Task 3: Update Deck Minter

**File:** `deck-minter.html`

**Changes needed:**

```javascript
// OLD
localStorage.setItem('token_decks', JSON.stringify(decks));

// NEW
await TokenDB.createDeck(userId, {
  house: deck.house,
  factionName: deck.faction,
  factionIcon: deck.factionIcon,
  cards: deck.cards
});
```

---

### Task 4: Update Deck Builder

**File:** `deck-builder.html`

**Changes needed:**

1. **Load cards from Supabase:**
```javascript
// OLD
const cards = JSON.parse(localStorage.getItem('token_cards') || '[]');

// NEW
const cards = await TokenDB.getUserCards(userId);
```

2. **Load decks from Supabase:**
```javascript
// OLD
const decks = JSON.parse(localStorage.getItem('token_decks') || '[]');

// NEW  
const decks = await TokenDB.getUserDecks(userId);
```

3. **Save battle deck to Supabase:**
```javascript
// OLD
localStorage.setItem('token_battle_decks', JSON.stringify(battleDecks));

// NEW
await TokenDB.createBattleDeck(userId, {
  name: battleDeck.name,
  deck1House: battleDeck.deck1House,
  deck2House: battleDeck.deck2House,
  deck1Cards: battleDeck.deck1Cards,
  deck2Cards: battleDeck.deck2Cards
});
```

---

### Task 5: Update Collection Viewer

**File:** `collection.html`

**Changes needed:**

```javascript
// OLD
const cards = JSON.parse(localStorage.getItem('token_cards') || '[]');
const decks = JSON.parse(localStorage.getItem('token_decks') || '[]');

// NEW
const cards = await TokenDB.getUserCards(userId);
const decks = await TokenDB.getUserDecks(userId);
```

---

### Task 6: Update Game

**File:** `game.html`

**Changes needed:**

1. **Load battle decks from Supabase:**
```javascript
// OLD
const battleDecks = JSON.parse(localStorage.getItem('token_battle_decks') || '[]');

// NEW
const battleDecks = await TokenDB.getUserBattleDecks(userId);
```

2. **Record game result:**
```javascript
// At end of game
await TokenDB.recordGame({
  player1Id: userId,
  player2Id: null, // AI game
  winnerId: winner === 'player' ? userId : null,
  player1Score: playerScore,
  player2Score: aiScore,
  player1Tokens: playerTokens,
  player2Tokens: aiTokens,
  isSurrender: surrendered,
  isAiGame: true,
  gameLog: gs.log
});
```

3. **Update card XP after game:**
```javascript
// Add XP to cards used in game
const xpPerCard = calculateXP(result);
for (const card of usedCards) {
  await TokenDB.updateCardXP(card.id, xpPerCard);
}
```

---

### Task 7: Guest Mode (No Auth Yet)

Until wallet/Farcaster auth is implemented, use a temporary guest user:

```javascript
// In supabase-client.js or each page
async function getOrCreateGuestUser() {
  let guestId = localStorage.getItem('token_guest_id');
  
  if (!guestId) {
    // Create guest user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert({ username: 'Guest_' + Date.now() })
      .select()
      .single();
    
    if (error) throw error;
    guestId = data.id;
    localStorage.setItem('token_guest_id', guestId);
  }
  
  return guestId;
}

// Use this to get userId
const userId = await getOrCreateGuestUser();
```

---

### Task 8: Migration Button

Add a one-time migration button for existing localStorage data:

```html
<!-- In index.html or settings -->
<button onclick="migrateData()">📦 Migrate Local Data to Cloud</button>

<script>
async function migrateData() {
  const userId = await getOrCreateGuestUser();
  const result = await TokenDB.migrateFromLocalStorage(userId);
  
  alert(`Migration complete!
Cards: ${result.cards}
Decks: ${result.decks}
Battle Decks: ${result.battleDecks}
Errors: ${result.errors.length}`);
  
  if (result.errors.length > 0) {
    console.log('Migration errors:', result.errors);
  }
}
</script>
```

---

## 📁 File Structure After Integration

```
TOKEN-CCG/
├── supabase/
│   ├── supabase-client.js    ← Supabase functions
│   ├── supabase-schema.sql   ← DB schema reference
│   └── BACKEND_INTEGRATION.md
├── docs/
│   └── SYNC.md               ← Coordination file
├── index.html                ← Add scripts
├── card-minter.html          ← Update save logic
├── deck-minter.html          ← Update save logic
├── deck-builder.html         ← Update load/save logic
├── collection.html           ← Update load logic
└── game.html                 ← Update load + record game
```

---

## 🔑 Supabase Credentials

```
URL: https://fyuqowfoklelfyzgndga.supabase.co
Anon Key: (in supabase-client.js)
```

---

## ⚠️ Important Notes

1. **All functions are async** - use `await` or `.then()`
2. **Error handling** - wrap in try/catch
3. **userId required** - get from guest or auth
4. **Duplicate check** - cards table has UNIQUE constraint on (user_id, faction_name, value)
5. **Keep localStorage as fallback** - for offline mode (future)

---

## 🧪 Testing Checklist

- [ ] Card Minter creates cards in Supabase
- [ ] Card Minter blocks duplicate values
- [ ] Deck Minter saves to Supabase
- [ ] Deck Builder loads cards from Supabase
- [ ] Deck Builder saves battle decks to Supabase
- [ ] Collection shows Supabase data
- [ ] Game loads battle decks from Supabase
- [ ] Game records results to Supabase
- [ ] Migration moves localStorage → Supabase

---

## 🚀 Next Steps After Integration

1. **Wallet Connect** - Replace guest with real wallet auth
2. **Farcaster Login** - For MiniApp
3. **Onchain** - Deploy smart contract on Base
4. **Multiplayer** - Supabase Realtime for live games
