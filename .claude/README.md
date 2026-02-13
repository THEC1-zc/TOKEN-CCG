# Claude Git Integration

Scripts per automazione Git quando Claude modifica i file.

## 🚀 Quick Start

### Opzione 1: Script Bash (Veloce)
```bash
cd .claude
./git-sync.sh "Claude: descrizione modifiche"
```

### Opzione 2: Node.js (Più controllo)
```bash
node .claude/auto-git.js sync "Claude: descrizione modifiche"
```

## 📝 Comandi Disponibili

### Bash Script
```bash
./git-sync.sh "messaggio"  # Commit + Push
```

### Node.js
```bash
node auto-git.js status           # Vedi cambiamenti
node auto-git.js commit "msg"     # Solo commit
node auto-git.js push              # Solo push
node auto-git.js sync "msg"        # Commit + Push
```

## 🔧 Setup

Rendi eseguibile lo script bash:
```bash
chmod +x .claude/git-sync.sh
```

## 📊 Log

Tutti i sync vengono registrati in `.claude/git-log.txt`

## 🎯 Workflow Consigliato

Dopo ogni modifica di Claude:
```bash
cd /Users/fabio/workspace/TOKEN-CCG
.claude/git-sync.sh "Claude: [cosa hai fatto]"
```

Esempio:
```bash
.claude/git-sync.sh "Claude: Fixed Card Minter bug + integrated Supabase"
```

## ⚙️ Integrazione Automatica

Claude può chiamare questi script dopo ogni modifica per mantenere il repo sempre sincronizzato.
