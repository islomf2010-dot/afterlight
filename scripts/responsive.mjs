/**
 * Responsive audit across the viewports the brief requires.
 *
 * Checks the things that break silently on a real device: horizontal overflow,
 * clipped or overlapping headings, touch targets below the 44px guideline,
 * illegibly small text, and headings that the fixed canvas chrome covers.
 *
 *   node scripts/responsive.mjs [--shots]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const SHOTS = process.argv.includes('--shots');
const OUT = new URL('../.shots/responsive/', import.meta.url).pathname;
if (SHOTS) mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop-1440x900', width: 1440, height: 900, coarse: false },
  { name: 'laptop-1280x800', width: 1280, height: 800, coarse: false },
  { name: 'tablet-768x1024', width: 768, height: 1024, coarse: true },
  { name: 'phone-390x844', width: 390, height: 844, coarse: true },
];

const ROUTES = [
  { path: '/?renderer=force', name: 'film', enter: true },
  { path: '/lab?renderer=force', name: 'lab' },
  { path: '/archive', name: 'archive' },
  { path: '/credits', name: 'credits' },
];

// WCAG 2.2 AA requires 24x24; Apple HIG and Material both advise 44x44 for
// touch. Desktop targets are checked against the AA floor because a mouse does
// not need 44px, and inflating the restrained desktop HUD to satisfy a touch
// guideline would be the wrong trade.
const MIN_TAP_TOUCH = 44;
const MIN_TAP_MOUSE = 24;
const MIN_TEXT = 10;

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

let failures = 0;
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.coarse,
    isMobile: vp.width < 500,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  console.log(`\n── ${vp.name} ${vp.coarse ? '(touch)' : ''} ─────────────────────`);

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });
    if (route.enter) {
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
      // Scroll into the film so the caption + rail are both on screen.
      await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.4, behavior: 'auto' }));
      await page.waitForTimeout(1800);
    }
    await page.waitForTimeout(900);

    const audit = await page.evaluate(
      ({ minTapMouse, minTapTouch, minText }) => {
        const minTap = matchMedia('(pointer: coarse)').matches ? minTapTouch : minTapMouse;
        const doc = document.documentElement;
        const overflowX = doc.scrollWidth - doc.clientWidth;

        // Anything sticking out past the viewport horizontally.
        const clipped = [];
        for (const el of document.querySelectorAll('main h1, main h2, main h3, main p, main button, main a, main input')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.bottom < 0 || r.top > doc.clientHeight) continue;
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            clipped.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
          }
        }

        // Interactive targets that are too small to hit reliably.
        const smallTargets = [];
        for (const el of document.querySelectorAll('button, a[href], input[type=range], [role=switch], [role=radio]')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const style = getComputedStyle(el);
          if (style.visibility === 'hidden') continue;
          // A skip link parked outside the viewport until focused is the correct
          // pattern, not a clipped element.
          if (r.bottom < 0 || r.top > doc.clientHeight) continue;
          if (r.height < minTap || r.width < minTap) {
            smallTargets.push(
              `${el.tagName.toLowerCase()}"${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 18)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
            );
          }
        }

        // Body copy that is too small to read comfortably.
        const tinyText = [];
        for (const el of document.querySelectorAll('p, button, label, dd, li')) {
          if (!el.textContent?.trim()) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const size = Number.parseFloat(getComputedStyle(el).fontSize);
          if (size > 0 && size < minText) tinyText.push(`${size}px: ${el.textContent.trim().slice(0, 22)}`);
        }

        // Headings hidden behind the fixed navigation bar.
        const underChrome = [];
        for (const el of document.querySelectorAll('main h1, main h2')) {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.top >= 0 && r.top < 64) underChrome.push(el.textContent?.trim().slice(0, 24));
        }

        return {
          overflowX,
          clipped: clipped.slice(0, 5),
          smallTargets: smallTargets.slice(0, 6),
          tinyText: tinyText.slice(0, 5),
          underChrome: underChrome.slice(0, 3),
        };
      },
      { minTapMouse: MIN_TAP_MOUSE, minTapTouch: MIN_TAP_TOUCH, minText: MIN_TEXT },
    );
    audit.pointer = await page.evaluate(() =>
      matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
    );

    const problems = [];
    if (audit.overflowX > 1) problems.push(`h-overflow ${audit.overflowX}px`);
    if (audit.clipped.length) problems.push(`clipped: ${audit.clipped.join(', ')}`);
    if (audit.smallTargets.length) problems.push(`small targets: ${audit.smallTargets.join(', ')}`);
    if (audit.tinyText.length) problems.push(`tiny text: ${audit.tinyText.join(', ')}`);
    if (audit.underChrome.length) problems.push(`under chrome: ${audit.underChrome.join(', ')}`);
    if (consoleErrors.length) problems.push(`console: ${consoleErrors.slice(0, 2).join(' | ')}`);

    const pass = problems.length === 0;
    if (!pass) failures += 1;
    console.log(`  ${pass ? ' ok ' : 'FAIL'} ${route.name.padEnd(9)} ${problems.join(' · ')}`);
    report.push({ vp: vp.name, route: route.name, problems, audit });

    if (SHOTS) {
      await page.screenshot({ path: `${OUT}${vp.name}--${route.name}.png` });
    }
  }

  await context.close();
}

console.log(`\n${failures === 0 ? 'all viewports clean' : `${failures} viewport/route combinations have findings`}`);
await browser.close();
process.exitCode = failures ? 1 : 0;
