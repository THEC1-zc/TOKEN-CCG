// Version: V1.1.0
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TOKEN_BASE_URL || 'http://127.0.0.1:4173';
const PAGES = [
  'index.html',
  'card-minter.html',
  'deck-minter.html',
  'collection.html',
  'deck-builder.html',
  'admin.html'
];

async function run() {
  const browser = await chromium.launch({ headless: true });
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
