/**
 * Manual verification harness.
 *
 * Loads the built app in headless Chromium, drives the critical flows, and
 * reports every console message plus the state of each scene's DOM. Used
 * during development to catch runtime errors that static analysis cannot.
 *
 *   node scripts/verify.mjs [--shots]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const SHOTS = process.argv.includes('--shots');
const OUT = new URL('../.verify/', import.meta.url).pathname;
if (SHOTS) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const messages = [];
let phase = 'boot';
page.on('console', (m) => {
  const line = `[${phase}] ${m.type().toUpperCase()}: ${m.text()}`;
  messages.push(line);
  if (m.type() === 'error' || m.text().includes('AudioContext')) console.log('   !', line.slice(0, 150));
});
page.on('pageerror', (e) => messages.push(`PAGEERROR: ${e.message}\n${e.stack ?? ''}`));
page.on('requestfailed', (r) =>
  messages.push(`REQFAIL: ${r.url()} — ${r.failure()?.errorText ?? 'unknown'}`),
);

const step = (name) => { phase = name; console.log(`\n▶ ${name}`); };
const shot = async (name) => {
  if (SHOTS) await page.screenshot({ path: `${OUT}${name}.png` });
};

try {
  step('load /?renderer=force');
  await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });

  const enterDisabled = await page.getByRole('button', { name: /^enter$/i }).isDisabled();
  console.log('   ENTER disabled during load:', enterDisabled);

  await page.waitForSelector('button:not([disabled])', { timeout: 40000 });
  const tasks = await page.$$eval('li', (nodes) =>
    nodes
      .filter((n) => /typeface|render context|shader programs|scene modules/i.test(n.textContent ?? ''))
      .map((n) => (n.textContent ?? '').replace(/\s+/g, ' ').trim()),
  );
  console.log('   loading tasks:', tasks);
  await shot('01-intro');

  step('press ENTER');
  await page.getByRole('button', { name: /^enter$/i }).click();
  await page.waitForTimeout(4000);
  console.log('   canvas count:', await page.locator('canvas').count());
  console.log(
    '   webgl context:',
    await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return Boolean(c && (c.getContext('webgl2') || c.getContext('webgl')));
    }),
  );
  await shot('02-void');

  step('scroll the film');
  const stops = [0.08, 0.2, 0.34, 0.5, 0.66, 0.8, 0.95];
  for (const [i, f] of stops.entries()) {
    await page.evaluate((frac) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * frac, behavior: 'auto' });
    }, f);
    await page.waitForTimeout(1600);
    const active = await page.evaluate(
      () =>
        document.querySelector('nav[aria-label="Scene navigation"] .text-ivory')?.textContent?.trim() ??
        'n/a',
    );
    const heading = await page.evaluate(() => {
      const els = [...document.querySelectorAll('section[data-scene] h2')];
      const found = els.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top > 0 && r.top < window.innerHeight;
      });
      return found?.textContent ?? null;
    });
    console.log(`   ${(f * 100).toFixed(0)}% → active="${active}" heading="${heading}"`);
    await shot(`03-scroll-${i}`);
  }

  step('fracture controls');
  await page.evaluate(() => {
    const el = document.querySelector('section[data-scene="fracture"]');
    el?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1500);
  console.log('   before:', await page.getByText(/Cohesion \d{3}%/).textContent());
  await page.getByRole('button', { name: /^disintegrate$/i }).click();
  await page.waitForTimeout(2000);
  console.log('   after disintegrate:', await page.getByText(/Cohesion \d{3}%/).textContent());
  await page.getByRole('button', { name: /^reassemble$/i }).click();
  await page.waitForTimeout(2500);
  console.log('   after reassemble:', await page.getByText(/Cohesion \d{3}%/).textContent());
  await shot('04-fracture');

  step('laboratory');
  await page.goto(`${BASE}/lab?renderer=force`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  console.log('   canvas:', await page.locator('canvas').count());
  const before = await page.getByLabel('Particle count').inputValue();
  await page.getByLabel('Particle count').fill('9000');
  await page.waitForTimeout(1200);
  const after = await page.getByLabel('Particle count').inputValue();
  console.log(`   particle count ${before} → ${after}`);
  await shot('05-lab');

  step('capture');
  const download = page.waitForEvent('download', { timeout: 20000 }).catch(() => null);
  await page.getByRole('button', { name: /^capture$/i }).click();
  const dl = await download;
  console.log('   download:', dl ? dl.suggestedFilename() : 'NONE');

  step('archive / credits / 404');
  for (const route of ['/archive', '/credits', '/does-not-exist']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const h1 = await page.evaluate(() => document.querySelector('main h1, main h2')?.textContent ?? null);
    console.log(`   ${route} → "${h1}"`);
  }
  await shot('06-archive');
} catch (error) {
  console.error('\n✖ harness failed:', error.message);
  process.exitCode = 1;
} finally {
  console.log('\n=== console output ===');
  if (messages.length === 0) console.log('(clean — no console messages)');
  for (const m of messages) console.log(m);
  await browser.close();
}
