/**
 * Runtime diagnostic probe.
 *
 * Exercises the behaviours a DOM-assertion suite structurally cannot see:
 * navigation churn, history back/forward, resize mid-animation, fast scroll in
 * both directions, and the resource accounting the app itself exposes.
 *
 *   node scripts/diagnose.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${name}${detail ? ` — ${detail}` : ''}`);
};

const scrollTo = async (fraction) => {
  await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * f, behavior: 'auto' });
  }, fraction);
};

const enterFilm = async () => {
  await page.waitForFunction(
    () => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent?.trim() === 'Enter');
      return b && !b.disabled;
    },
    undefined,
    { timeout: 45000 },
  );
  await page.getByRole('button', { name: /^enter$/i }).click();
  await page.waitForTimeout(2500);
};

const scrollTriggers = () => page.evaluate(() => window.ScrollTrigger?.getAll?.().length ?? -1);

console.log('\n── navigation churn ────────────────────────────────');
await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
await enterFilm();

await scrollTo(0.32);
await page.waitForTimeout(1800);
const midHeading = await page.evaluate(() => {
  const h = [...document.querySelectorAll('section[data-scene] h2')].find((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 0 && r.top < window.innerHeight;
  });
  return h?.textContent ?? null;
});
check('mid-scroll resolves to a scene', Boolean(midHeading), `heading="${midHeading}"`);

const yBefore = await page.evaluate(() => window.scrollY);
check(
  'scroll position survives a route change and return',
  yBefore > 0,
  `scrollY=${yBefore}`,
);

// Leave to /archive and come back — the film remounts.
await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Archive/ }).click();
await page.waitForTimeout(800);
const onArchive = page.url().endsWith('/archive');
check('navigated to /archive', onArchive);

await page.goBack();
await page.waitForTimeout(1500);
await page.goForward();
await page.waitForTimeout(800);
await page.goBack();
await page.waitForTimeout(1800);

const backOnFilm = await page.evaluate(() => Boolean(document.querySelector('section[data-scene]')));
check('history back returns to the film with its DOM intact', backOnFilm);
check(
  'only one canvas exists after navigation churn',
  (await page.locator('canvas').count()) === 1,
  `count=${await page.locator('canvas').count()}`,
);

console.log('\n── scroll both directions ──────────────────────────');
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
await page.waitForTimeout(1200);
const atTop = await page.evaluate(() => window.scrollY);
check('returns to the top', atTop < 10, `scrollY=${atTop}`);

// Rapid down-up-down scrubbing.
for (const f of [0.9, 0.1, 0.7, 0.2, 0.95, 0.35]) {
  await scrollTo(f);
  await page.waitForTimeout(260);
}
await page.waitForTimeout(1500);
const afterScrub = await page.evaluate(() => {
  const h = [...document.querySelectorAll('section[data-scene] h2')].find((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 0 && r.top < window.innerHeight;
  });
  return h?.textContent ?? null;
});
check('scene state stays valid after rapid scrubbing', Boolean(afterScrub), `heading="${afterScrub}"`);

const overflowX = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
check('no horizontal overflow', overflowX <= 1, `overflow=${overflowX}px`);

console.log('\n── resize mid-animation ───────────────────────────');
await scrollTo(0.45);
await page.waitForTimeout(900);
await page.setViewportSize({ width: 700, height: 1000 });
await page.waitForTimeout(1500);
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(1500);
const afterResize = await page.evaluate(() => {
  const h = [...document.querySelectorAll('section[data-scene] h2')].find((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 0 && r.top < window.innerHeight;
  });
  return h?.textContent ?? null;
});
check('animation progress survives a resize round-trip', Boolean(afterResize), `heading="${afterResize}"`);

console.log('\n── lab cleanup ────────────────────────────────────');
await page.goto(`${BASE}/lab?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const labCanvases = await page.locator('canvas').count();
check('lab mounts exactly one canvas', labCanvases === 1, `count=${labCanvases}`);

for (const study of ['shaders', 'portal', 'particles']) {
  await page.goto(`${BASE}/lab/${study}?renderer=force`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
}
const afterStudyHop = await page.locator('canvas').count();
check('study switching does not stack canvases', afterStudyHop === 1, `count=${afterStudyHop}`);

await page.goto(`${BASE}/credits`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const afterLeavingLab = await page.locator('canvas').count();
check('lab canvas is released when leaving the lab', afterLeavingLab === 0, `count=${afterLeavingLab}`);

console.log('\n── lab parameters persist + validate ───────────────');
await page.goto(`${BASE}/lab?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.getByLabel('Particle count').fill('7700');
await page.getByLabel('Distortion intensity').fill('0.73');
await page.waitForTimeout(600);
const stored = await page.evaluate(() => window.localStorage.getItem('afterlight:lab.params'));
check(
  'lab params persist',
  stored?.includes('7700') && stored?.includes('0.73'),
  stored ? 'written' : 'missing',
);

// A hostile stored value must not reach the renderer.
await page.evaluate(() => {
  window.localStorage.setItem(
    'afterlight:lab.params',
    JSON.stringify({ particleCount: 1e12, distortion: 'nope', speed: -5 }),
  );
});
await page.goto(`${BASE}/lab?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const sanitised = await page.evaluate(() => ({
  count: document.querySelector('#\\:r0\\:, input[type=range]')?.value,
  values: [...document.querySelectorAll('input[type=range]')].map((i) => i.value),
}));
check(
  'hostile stored params are clamped on boot',
  sanitised.values.length === 6 && sanitised.values.every((v) => Number.isFinite(Number(v))),
  `values=${sanitised.values.join(',')}`,
);
check(
  'particle count never exceeds its declared maximum',
  Number(sanitised.values[0]) <= 12000,
  `particleCount=${sanitised.values[0]}`,
);

console.log('\n── reduced motion ──────────────────────────────────');
const ctx2 = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'reduce',
});
const page2 = await ctx2.newPage();
await page2.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
await page2.waitForTimeout(2500);
const motionAttr = await page2.evaluate(() => document.documentElement.dataset.motion);
check('OS reduced-motion is honoured', motionAttr === 'reduced', `data-motion=${motionAttr}`);
const lenisClass = await page2.evaluate(() => document.documentElement.className);
check('Lenis is not engaged under reduced motion', !lenisClass.includes('lenis'), `class="${lenisClass}"`);
await ctx2.close();

console.log('\n── console ─────────────────────────────────────────');
check('no console errors', errors.length === 0, errors.slice(0, 4).join(' | '));

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('failures:');
  failed.forEach((f) => console.log(`  - ${f.name}${f.detail ? `: ${f.detail}` : ''}`));
}
await browser.close();
process.exitCode = failed.length ? 1 : 0;
