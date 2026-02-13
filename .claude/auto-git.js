#!/usr/bin/env node

/**
 * Auto Git Manager for Claude
 * Automatically commits and pushes changes made by Claude
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_PATH = process.cwd();
const LOG_FILE = path.join(REPO_PATH, '.claude', 'git-log.txt');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(logMessage);
}

function execGit(command) {
  try {
    const output = execSync(command, { 
      cwd: REPO_PATH,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return output.trim();
  } catch (error) {
    log(`❌ Git command failed: ${command}`);
    log(`Error: ${error.message}`);
    throw error;
  }
}

function hasChanges() {
  const status = execGit('git status --porcelain');
  return status.length > 0;
}

function getChangedFiles() {
  const status = execGit('git status --porcelain');
  return status.split('\n')
    .filter(line => line.trim())
    .map(line => line.substring(3));
}

function autoCommit(message = 'Claude: Auto-commit changes') {
  try {
    if (!hasChanges()) {
      log('✅ No changes to commit');
      return false;
    }

    const changedFiles = getChangedFiles();
    log(`📝 Changed files: ${changedFiles.join(', ')}`);

    // Add all changes
    execGit('git add -A');
    log('✅ Staged all changes');

    // Commit with message
    const commitMessage = `${message}\n\nFiles modified:\n${changedFiles.map(f => `- ${f}`).join('\n')}`;
    execGit(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    log('✅ Committed changes');

    return true;
  } catch (error) {
    log(`❌ Auto-commit failed: ${error.message}`);
    return false;
  }
}

function autoPush() {
  try {
    // Get current branch
    const branch = execGit('git branch --show-current');
    log(`🌿 Current branch: ${branch}`);

    // Push to remote
    execGit(`git push origin ${branch}`);
    log('✅ Pushed to remote');

    return true;
  } catch (error) {
    log(`❌ Auto-push failed: ${error.message}`);
    return false;
  }
}

function autoSync(commitMessage) {
  log('🚀 Starting auto-sync...');
  
  if (autoCommit(commitMessage)) {
    autoPush();
    log('✅ Auto-sync complete!');
  } else {
    log('ℹ️ No changes to sync');
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const message = args[1] || 'Claude: Auto-commit changes';

  switch (command) {
    case 'commit':
      autoCommit(message);
      break;
    case 'push':
      autoPush();
      break;
    case 'sync':
      autoSync(message);
      break;
    case 'status':
      if (hasChanges()) {
        console.log('📝 Changed files:');
        getChangedFiles().forEach(f => console.log(`  - ${f}`));
      } else {
        console.log('✅ No changes');
      }
      break;
    default:
      console.log(`
Usage:
  node auto-git.js commit [message]  - Commit changes
  node auto-git.js push               - Push to remote
  node auto-git.js sync [message]     - Commit + Push
  node auto-git.js status             - Check status
      `);
  }
}

module.exports = { autoCommit, autoPush, autoSync, hasChanges, getChangedFiles };
