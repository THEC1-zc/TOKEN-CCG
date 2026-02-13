#!/usr/bin/env node

/**
 * Claude Dev Tools MCP Server
 * Provides file manipulation, git operations, and automation tools
 * for Claude to work autonomously on the TOKEN-CCG project
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Base path for the project
const PROJECT_ROOT = '/Users/fabio/workspace/TOKEN-CCG';

const server = new Server(
  {
    name: 'claude-dev-tools',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================
// TOOL HANDLERS
// ============================================

async function handleToolCall(name, args) {
  try {
    switch (name) {
      case 'patch_file': {
        const { file_path, search, replace, description } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        
        // Read file
        let content = await fs.readFile(fullPath, 'utf-8');
        
        // Check if search string exists
        if (!content.includes(search)) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Search string not found in ${file_path}\n\nSearched for:\n${search.substring(0, 200)}...`,
              },
            ],
          };
        }
        
        // Count occurrences
        const occurrences = (content.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        
        // Replace
        content = content.replace(search, replace);
        
        // Write back
        await fs.writeFile(fullPath, content, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Patched ${file_path}\n\nDescription: ${description}\nOccurrences replaced: ${occurrences}`,
            },
          ],
        };
      }

      case 'patch_file_regex': {
        const { file_path, pattern, replace, flags, description } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        
        let content = await fs.readFile(fullPath, 'utf-8');
        const regex = new RegExp(pattern, flags || 'g');
        
        const matches = content.match(regex);
        if (!matches) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Pattern not found in ${file_path}\n\nPattern: ${pattern}`,
              },
            ],
          };
        }
        
        content = content.replace(regex, replace);
        await fs.writeFile(fullPath, content, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Patched ${file_path} with regex\n\nDescription: ${description}\nMatches replaced: ${matches.length}`,
            },
          ],
        };
      }

      case 'replace_function': {
        const { file_path, function_name, new_function, description } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        
        let content = await fs.readFile(fullPath, 'utf-8');
        
        // Find function by name
        const functionPattern = new RegExp(
          `(async\\s+)?function\\s+${function_name}\\s*\\([^)]*\\)\\s*\\{`,
          'g'
        );
        
        const match = functionPattern.exec(content);
        if (!match) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Function '${function_name}' not found in ${file_path}`,
              },
            ],
          };
        }
        
        const startIdx = match.index;
        let pos = startIdx + match[0].length;
        let depth = 1;
        
        // Find matching closing brace
        while (pos < content.length && depth > 0) {
          if (content[pos] === '{') depth++;
          if (content[pos] === '}') depth--;
          pos++;
        }
        
        if (depth !== 0) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Could not find closing brace for function '${function_name}'`,
              },
            ],
          };
        }
        
        // Replace function
        content = content.substring(0, startIdx) + new_function + content.substring(pos);
        await fs.writeFile(fullPath, content, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Replaced function '${function_name}' in ${file_path}\n\nDescription: ${description}`,
            },
          ],
        };
      }

      case 'git_commit': {
        const { message, files } = args;
        
        // Add files
        if (files && files.length > 0) {
          for (const file of files) {
            await execAsync(`git add "${file}"`, { cwd: PROJECT_ROOT });
          }
        } else {
          await execAsync('git add -A', { cwd: PROJECT_ROOT });
        }
        
        // Commit
        const { stdout, stderr } = await execAsync(`git commit -m "${message}"`, { cwd: PROJECT_ROOT });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Git commit successful\n\nMessage: ${message}\n\nOutput:\n${stdout}\n${stderr}`,
            },
          ],
        };
      }

      case 'git_push': {
        const { branch } = args;
        const branchArg = branch || 'HEAD';
        
        const { stdout, stderr } = await execAsync(`git push origin ${branchArg}`, { cwd: PROJECT_ROOT });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Git push successful\n\nBranch: ${branchArg}\n\nOutput:\n${stdout}\n${stderr}`,
            },
          ],
        };
      }

      case 'git_status': {
        const { stdout } = await execAsync('git status --short', { cwd: PROJECT_ROOT });
        
        return {
          content: [
            {
              type: 'text',
              text: `Git Status:\n\n${stdout || 'No changes'}`,
            },
          ],
        };
      }

      case 'run_command': {
        const { command, description } = args;
        
        const { stdout, stderr } = await execAsync(command, { cwd: PROJECT_ROOT });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Command executed\n\nDescription: ${description}\nCommand: ${command}\n\nOutput:\n${stdout}\n${stderr}`,
            },
          ],
        };
      }

      case 'backup_file': {
        const { file_path } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        const backupPath = `${fullPath}.backup`;
        
        await fs.copyFile(fullPath, backupPath);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Backup created: ${file_path}.backup`,
            },
          ],
        };
      }

      case 'restore_backup': {
        const { file_path } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        const backupPath = `${fullPath}.backup`;
        
        await fs.copyFile(backupPath, fullPath);
        await fs.unlink(backupPath);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Restored ${file_path} from backup`,
            },
          ],
        };
      }

      case 'insert_at_line': {
        const { file_path, line_number, content: insertContent, description } = args;
        const fullPath = path.join(PROJECT_ROOT, file_path);
        
        let content = await fs.readFile(fullPath, 'utf-8');
        const lines = content.split('\n');
        
        if (line_number < 1 || line_number > lines.length + 1) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Invalid line number ${line_number} (file has ${lines.length} lines)`,
              },
            ],
          };
        }
        
        lines.splice(line_number - 1, 0, insertContent);
        content = lines.join('\n');
        
        await fs.writeFile(fullPath, content, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Inserted content at line ${line_number} in ${file_path}\n\nDescription: ${description}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `❌ Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}\n\nStack:\n${error.stack}`,
        },
      ],
      isError: true,
    };
  }
}

// Register tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return await handleToolCall(name, args);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'patch_file',
        description: 'Search and replace text in a file (exact match)',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root',
            },
            search: {
              type: 'string',
              description: 'Text to search for (must match exactly)',
            },
            replace: {
              type: 'string',
              description: 'Text to replace with',
            },
            description: {
              type: 'string',
              description: 'Description of what this patch does',
            },
          },
          required: ['file_path', 'search', 'replace', 'description'],
        },
      },
      {
        name: 'patch_file_regex',
        description: 'Search and replace using regular expressions',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root',
            },
            pattern: {
              type: 'string',
              description: 'Regex pattern to match',
            },
            replace: {
              type: 'string',
              description: 'Replacement string (can use $1, $2, etc.)',
            },
            flags: {
              type: 'string',
              description: 'Regex flags (default: "g")',
            },
            description: {
              type: 'string',
              description: 'Description of what this patch does',
            },
          },
          required: ['file_path', 'pattern', 'replace', 'description'],
        },
      },
      {
        name: 'replace_function',
        description: 'Replace an entire JavaScript/TypeScript function by name',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root',
            },
            function_name: {
              type: 'string',
              description: 'Name of the function to replace',
            },
            new_function: {
              type: 'string',
              description: 'Complete new function code (including signature)',
            },
            description: {
              type: 'string',
              description: 'Description of what this change does',
            },
          },
          required: ['file_path', 'function_name', 'new_function', 'description'],
        },
      },
      {
        name: 'git_commit',
        description: 'Stage and commit changes to git',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Commit message',
            },
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific files to commit (optional, defaults to all)',
            },
          },
          required: ['message'],
        },
      },
      {
        name: 'git_push',
        description: 'Push commits to remote repository',
        inputSchema: {
          type: 'object',
          properties: {
            branch: {
              type: 'string',
              description: 'Branch name (optional, defaults to current)',
            },
          },
        },
      },
      {
        name: 'git_status',
        description: 'Check git status',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'run_command',
        description: 'Run any shell command in the project directory',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Shell command to execute',
            },
            description: {
              type: 'string',
              description: 'What this command does',
            },
          },
          required: ['command', 'description'],
        },
      },
      {
        name: 'backup_file',
        description: 'Create a backup of a file (.backup extension)',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'restore_backup',
        description: 'Restore a file from its backup',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root (will restore from .backup)',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'insert_at_line',
        description: 'Insert content at a specific line number',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path relative to project root',
            },
            line_number: {
              type: 'number',
              description: 'Line number to insert at (1-indexed)',
            },
            content: {
              type: 'string',
              description: 'Content to insert',
            },
            description: {
              type: 'string',
              description: 'Description of what this does',
            },
          },
          required: ['file_path', 'line_number', 'content', 'description'],
        },
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Claude Dev Tools MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
