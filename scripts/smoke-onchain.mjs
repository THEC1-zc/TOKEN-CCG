// Version: V1.1.4
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BASE_URL = process.env.TOKEN_BASE_URL || 'http://127.0.0.1:4173';
const PAGES = [
  'index.html',
  'card-minter.html',
  'deck-minter.html',
  'collection.html',
  'deck-builder.html',
  'admin.html'
];

function findChromiumExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_PATH;
  }
  if (process.platform !== 'darwin') return null;

  const cacheRoot = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  if (!fs.existsSync(cacheRoot)) return null;

  const entries = fs.readdirSync(cacheRoot).filter((name) => name.startsWith('chromium-'));
  for (const entry of entries) {
    const base = path.join(cacheRoot, entry);
    const candidates = [
      path.join(base, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
      path.join(base, 'chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing')
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

async function launchBrowser() {
  const errors = [];
  const commonArgs = ['--disable-crashpad'];
  if (process.platform === 'darwin') {
    try {
      return await chromium.launch({ headless: true, channel: 'chrome', args: commonArgs });
    } catch (err) {
      errors.push(`channel=chrome failed: ${err?.message || err}`);
    }
    try {
      return await chromium.launch({ headless: false, channel: 'chrome', args: commonArgs });
    } catch (err) {
      errors.push(`channel=chrome headful failed: ${err?.message || err}`);
    }
  }
  const executablePath = findChromiumExecutable();
  if (executablePath) {
    try {
      return await chromium.launch({ headless: true, executablePath, args: commonArgs });
    } catch (err) {
      errors.push(`executablePath failed: ${err?.message || err}`);
    }
  }
  try {
    return await chromium.launch({ headless: true, args: commonArgs });
  } catch (err) {
    errors.push(`default launch failed: ${err?.message || err}`);
  }
  throw new Error(`Playwright launch failed. ${errors.join(' | ')}`);
}

async function run() {
  const browser = await launchBrowser();
  const context = await browser.newContext();
  const report = [];

  for (const path of PAGES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} :: ${req.failure()?.errorText || 'failed'}`);
    });

    const url = `${BASE_URL}/${path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const walletApi = await page.evaluate(() => Boolean(window.TokenWallet));
    const onchainCfg = await page.evaluate(() => window.TokenOnchainConfig || null);

    report.push({
      page: path,
      url: page.url(),
      walletApi,
      onchainCfg,
      consoleErrors,
      failedRequests
    });

    await page.close();
  }

  await browser.close();
  const outputDir = path.join(process.cwd(), 'output', 'playwright');
  fs.mkdirSync(outputDir, { recursive: true });
  const outPath = path.join(outputDir, 'smoke-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (report.length !== PAGES.length) {
    console.error(`Smoke report incomplete: expected ${PAGES.length}, got ${report.length}`);
    process.exit(1);
  }

  const hardFail = report.some((r) => r.consoleErrors.length > 0);
  process.exit(hardFail ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
