// Version: V1.0.0
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'assets', 'onchain-config.js');

const ADMIN_1 = '0xd29c790466675153A50DF7860B9EFDb689A21cDe';
const ADMIN_2 = '0x3b6CF1436B630035Ac1C6eEA0A8cF3C7C5f6d0f8';

function usage() {
  console.log(
    [
      'Usage:',
      '  node scripts/remix-assist.mjs plan card',
      '  node scripts/remix-assist.mjs plan deck',
      '  node scripts/remix-assist.mjs set-deck 0xYourDeckContract',
      '  node scripts/remix-assist.mjs set-card 0xYourCardContract'
    ].join('\n')
  );
}

function printPlan(kind) {
  const isDeck = kind === 'deck';
  const contractName = isDeck ? 'TokenDeck' : 'TokenCard';
  const filePath = isDeck ? 'contracts/TokenDeck.sol' : 'contracts/TokenCard.sol';

  console.log(`Remix plan for ${contractName}`);
  console.log(`File: ${filePath}`);
  console.log('Network: Base Sepolia (84532 / 0x14a34)');
  console.log('Compiler: 0.8.20 (opt enabled)');
  console.log('Constructor args:');
  console.log(`  1) ${ADMIN_1}`);
  console.log(`  2) ${ADMIN_2}`);
  console.log('Post deploy: copy contract address and run set-card/set-deck command.');
}

function setContractAddress(key, address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid address format. Expected 0x + 40 hex chars.');
  }
  const current = fs.readFileSync(CONFIG_PATH, 'utf8');
  const regex = new RegExp(`${key}:\\s*'[^']*'`);
  if (!regex.test(current)) {
    throw new Error(`Could not find '${key}' in ${CONFIG_PATH}`);
  }
  const updated = current.replace(regex, `${key}: '${address}'`);
  fs.writeFileSync(CONFIG_PATH, updated, 'utf8');
  console.log(`Updated ${key} contract in assets/onchain-config.js -> ${address}`);
}

const [cmd, arg] = process.argv.slice(2);
if (!cmd) {
  usage();
  process.exit(1);
}

try {
  if (cmd === 'plan') {
    if (arg !== 'card' && arg !== 'deck') throw new Error("plan requires 'card' or 'deck'");
    printPlan(arg);
    process.exit(0);
  }
  if (cmd === 'set-deck') {
    if (!arg) throw new Error("set-deck requires address");
    setContractAddress('deck', arg);
    process.exit(0);
  }
  if (cmd === 'set-card') {
    if (!arg) throw new Error("set-card requires address");
    setContractAddress('card', arg);
    process.exit(0);
  }
  usage();
  process.exit(1);
} catch (err) {
  console.error(err.message || String(err));
  process.exit(1);
}
