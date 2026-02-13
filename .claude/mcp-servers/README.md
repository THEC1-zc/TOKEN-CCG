# Claude Dev Tools MCP Server

Custom MCP server that gives Claude full development autonomy on TOKEN-CCG project.

## Features

### 🔧 File Operations
- **patch_file**: Search and replace (exact string matching)
- **patch_file_regex**: Search and replace with regex patterns
- **replace_function**: Replace entire JS/TS functions by name
- **insert_at_line**: Insert content at specific line numbers
- **backup_file**: Create backups before modifications
- **restore_backup**: Restore files from backups

### 📦 Git Operations
- **git_commit**: Stage and commit changes with custom messages
- **git_push**: Push to remote repository
- **git_status**: Check current git status

### 🖥️ Shell Operations
- **run_command**: Execute any shell command in project root

## Installation

See [INSTALL.md](./INSTALL.md) for complete setup instructions.

Quick start:
```bash
cd .claude/mcp-servers
npm install
```

Then update `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "claude-dev-tools": {
      "command": "node",
      "args": ["/Users/fabio/workspace/TOKEN-CCG/.claude/mcp-servers/server.js"]
    }
  }
}
```

## Usage Examples

### Patch a file
```javascript
// Claude can now do:
patch_file({
  file_path: "deck-minter.html",
  search: "<title>TOKEN - Deck Minter v2.0.2</title>",
  replace: "<title>TOKEN - Deck Minter v2.1.0</title>",
  description: "Update version number"
})
```

### Replace a function
```javascript
replace_function({
  file_path: "deck-minter.html",
  function_name: "mintOnchainBatch",
  new_function: "async function mintOnchainBatch(factionName) { ... }",
  description: "Implement batch minting"
})
```

### Commit and push
```javascript
git_commit({
  message: "feat: implement batch minting for deck minter",
  files: ["deck-minter.html", "contracts/TokenCard.sol"]
})

git_push({ branch: "codex/agent" })
```

## Architecture

- **Language**: JavaScript (Node.js)
- **Framework**: @modelcontextprotocol/sdk
- **Transport**: stdio (standard input/output)
- **Project Root**: `/Users/fabio/workspace/TOKEN-CCG`

## Security

This server has full access to:
- Read/write files in project directory
- Execute git commands
- Run arbitrary shell commands

Only use in trusted projects.

## Development

The server runs on stdio and communicates via JSON-RPC 2.0 protocol.

Test manually:
```bash
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node server.js
```

## Version

Current: 1.0.0

## License

Part of TOKEN-CCG project.
