# Claude Dev Tools MCP Server - Installation Guide

## 🎯 What This Does

This MCP server gives Claude **full autonomy** to:
- ✅ Patch files (search/replace, regex, function replacement)
- ✅ Git operations (commit, push, status)
- ✅ Run shell commands
- ✅ Backup/restore files
- ✅ Insert content at specific lines

No more manual patches - Claude can modify files directly!

---

## 📋 Step-by-Step Installation

### Step 1: Install Dependencies

```bash
cd /Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers
npm install
```

This installs the MCP SDK and dependencies.

---

### Step 2: Test the Server

```bash
cd /Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers
node server.js
```

You should see:
```
Claude Dev Tools MCP Server running on stdio
```

Press `Ctrl+C` to stop it.

---

### Step 3: Update Claude Desktop Config

Open the config file:
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Replace the entire content** with this:

```json
{
  "preferences": {
    "sidebarMode": "chat",
    "coworkScheduledTasksEnabled": false
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/fabio/workspace/TOKEN-CCG"]
    },
    "claude-dev-tools": {
      "command": "node",
      "args": ["/Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers/server.js"]
    }
  }
}
```

**Save and exit** (Ctrl+O, Enter, Ctrl+X)

---

### Step 4: Restart Claude Desktop

1. **Quit Claude Desktop completely** (Cmd+Q)
2. **Reopen Claude Desktop**

---

### Step 5: Verify Installation

After reopening Claude, ask me:

> "Can you use the patch_file tool to show me the available tools?"

Or:

> "What dev tools do you have available?"

I should be able to list all the new tools!

---

## 🛠️ Available Tools

Once installed, I'll have these tools:

### File Operations
- `patch_file` - Search and replace (exact match)
- `patch_file_regex` - Search and replace with regex
- `replace_function` - Replace entire functions by name
- `insert_at_line` - Insert content at specific line numbers
- `backup_file` - Create .backup files
- `restore_backup` - Restore from backup

### Git Operations
- `git_commit` - Stage and commit changes
- `git_push` - Push to remote
- `git_status` - Check status

### Shell Operations
- `run_command` - Execute any shell command in project directory

---

## ✅ Success Criteria

After installation, I should be able to:

1. **Patch deck-minter.html** without manual intervention
2. **Commit changes** automatically
3. **Push to GitHub** when ready
4. **Run npm/python scripts** directly

---

## 🐛 Troubleshooting

### Error: "Server disconnected"

**Check**: Is Node.js installed?
```bash
node --version  # Should be v18 or higher
```

**Check**: Are dependencies installed?
```bash
cd /Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers
ls node_modules/  # Should see @modelcontextprotocol
```

### Error: "Cannot find module"

Run:
```bash
cd /Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers
npm install --force
```

### Config not updating

1. Make sure you saved the file (Ctrl+O in nano)
2. Make sure you quit Claude with Cmd+Q (not just closed window)
3. Check config syntax:
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool
```

If it shows an error, there's a JSON syntax problem.

---

## 🚀 After Installation

Once working, test with:

> "Claude, can you patch deck-minter.html to update the version from v2.0.2 to v2.1.0?"

I should be able to do it automatically! 🎉

---

## 📞 If Problems Persist

1. Check Claude Desktop logs:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

2. Manually test the server:
```bash
cd /Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node server.js
```

Should output available tools.

---

## 🔐 Security Note

This gives Claude direct access to:
- Modify files in `/Users/fabio/workspace/TOKEN-CCG`
- Run git commands
- Execute shell commands in project directory

Only use this in projects you trust Claude to modify!
