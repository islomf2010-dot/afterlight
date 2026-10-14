import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const BASE = 'http://127.0.0.1:4173';
const OUT = new URL('../.shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /^enter$/i }).waitFor({ state: 'visible' });
await page.waitForFunction(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent?.trim() === 'Enter');
  return b && !b.disabled;
}, undefined, { timeout: 40000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}00-intro.png` });
await page.getByRole('button', { name: /^enter$/i }).click();
// Wait for the transition curtain to finish before judging any frame.
await page.waitForFunction(() => {
  const el = document.querySelector('[class*="z-[135]"]');
  return !el || !String(el.getAttribute('style') ?? '').includes('visibility: visible');
}, undefined, { timeout: 20000 });
await page.waitForTimeout(1500);

const stops = { void: 0.08, fracture: 0.27, threshold: 0.48, echoes: 0.70, afterlight: 0.93 };
for (const [name, f] of Object.entries(stops)) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * frac, behavior: 'auto' });
  }, f);
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log('shot', name);
}
await page.goto(`${BASE}/lab?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: `${OUT}lab-particles.png` });
await page.goto(`${BASE}/lab/shaders?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}lab-shaders.png` });
await page.goto(`${BASE}/lab/portal?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}lab-portal.png` });
await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}archive.png` });
await page.goto(`${BASE}/credits`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}credits.png` });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}mobile-intro.png` });
await page.getByRole('button', { name: /^enter$/i }).click();
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}mobile-void.png` });
await browser.close();
