// Version: V1.0.1
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const repoRoot = process.cwd();
const stateDir = path.join(repoRoot, '.agent');
const statePath = path.join(stateDir, 'phase-state.json');

const PHASES = [
  {
    id: 'A',
    name: 'Runtime onchain-only hardening',
    gates: ['npm run agent:phase:a:verify', 'npm run agent:secrets-check', 'npm run agent:test-full'],
    next: 'B'
  },
  {
    id: 'B',
    name: 'ERC-721 card contract deploy/test pipeline on Base Sepolia',
    gates: ['npm run agent:secrets-check', 'npm run agent:test-full'],
    next: 'C'
  },
  {
    id: 'C',
    name: 'Card mint UX + wallet ownership sync + collection consistency',
    gates: ['npm run agent:secrets-check', 'npm run agent:test-full'],
    next: 'D'
  }
];

function phaseById(id) {
  return PHASES.find((p) => p.id === id) || null;
}

function ensureState() {
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
  if (!fs.existsSync(statePath)) {
    const initial = {
      version: 'V1.0.0',
      currentPhase: 'A',
      history: []
    };
    fs.writeFileSync(statePath, JSON.stringify(initial, null, 2));
  }
}

function readState() {
  ensureState();
  return JSON.parse(fs.readFileSync(statePath, 'utf8'));
}

function writeState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function runCmd(cmd) {
  const out = spawnSync('bash', ['-lc', cmd], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env
  });
  return out.status === 0;
}

function doStatus() {
  const state = readState();
  const phase = phaseById(state.currentPhase);
  console.log(JSON.stringify({
    stateFile: '.agent/phase-state.json',
    currentPhase: state.currentPhase,
    currentName: phase ? phase.name : 'unknown',
    remainingAutoPhases: PHASES.map((p) => p.id).slice(
      Math.max(0, PHASES.findIndex((p) => p.id === state.currentPhase))
    )
  }, null, 2));
}

function doReset(phaseId = 'A') {
  const phase = phaseById(phaseId);
  if (!phase) {
    console.error(`Unknown phase: ${phaseId}`);
    process.exit(1);
  }
  const state = readState();
  state.currentPhase = phase.id;
  state.history.push({
    at: new Date().toISOString(),
    action: 'reset',
    phase: phase.id
  });
  writeState(state);
  doStatus();
}

function doRun() {
  const state = readState();
  let current = phaseById(state.currentPhase);
  if (!current) {
    console.error(`Unknown current phase in state: ${state.currentPhase}`);
    process.exit(1);
  }

  while (current) {
    console.log(`\n[agent-phase] START phase ${current.id}: ${current.name}`);
    let ok = true;
    for (const gate of current.gates) {
      console.log(`[agent-phase] gate: ${gate}`);
      ok = runCmd(gate);
      if (!ok) break;
    }

    state.history.push({
      at: new Date().toISOString(),
      action: 'run',
      phase: current.id,
      ok
    });

    if (!ok) {
      writeState(state);
      console.log(`[agent-phase] STOP on phase ${current.id}: gate failed`);
      process.exit(1);
    }

    if (!current.next || !phaseById(current.next)) {
      state.currentPhase = current.id;
      writeState(state);
      console.log(`[agent-phase] DONE: no further auto phases after ${current.id}`);
      process.exit(0);
    }

    state.currentPhase = current.next;
    writeState(state);
    console.log(`[agent-phase] PASS phase ${current.id} -> auto-advance to ${current.next}`);
    current = phaseById(current.next);
  }
}

const action = process.argv[2] || 'status';
const arg = process.argv[3];

if (action === 'status') doStatus();
else if (action === 'reset') doReset(arg || 'A');
else if (action === 'run') doRun();
else {
  console.error('Usage: node scripts/agent-phase-runner.mjs [status|run|reset <PHASE_ID>]');
  process.exit(1);
}
