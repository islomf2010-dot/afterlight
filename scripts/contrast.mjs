/**
 * Caption contrast audit.
 *
 * Reads the real bounding box of each scene's overlay prose from the live DOM,
 * clips a screenshot to exactly that box, and measures the composited result.
 *
 * Measuring by eye or by guessed coordinates is not trustworthy: anti-aliasing
 * at small type means the brightest pixel in a band can be film grain rather
 * than a glyph stroke. The stroke core is taken as the 98th percentile and the
 * background as the median, so isolated grain outliers cannot pass as text.
 *
 *   node scripts/contrast.mjs
 *
 * Exits non-zero if any caption block falls below WCAG AA for body text.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

/** WCAG 2.x relative luminance, evaluated in the page against decoded pixels. */
const MEASURE = async ({ dataUrl, rect }) => {
  const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob());
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  const { data } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

  const channel = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const rows = [];
  // Only the element's own pixels; the rest of the frame is the film behind it.
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const i = (bitmap.width * y + x) << 2;
      if (i + 2 >= data.length) continue;
      rows.push([
        data[i],
        data[i + 1],
        data[i + 2],
        0.2126 * channel(data[i]) +
          0.7152 * channel(data[i + 1]) +
          0.0722 * channel(data[i + 2]),
      ]);
    }
  }
  if (rows.length < 50) return null;
  rows.sort((a, b) => a[3] - b[3]);
  const at = (q) => rows[Math.min(rows.length - 1, Math.floor(rows.length * q))];

  const contrast = (a, b) => {
    const [hi, lo] = a[3] >= b[3] ? [a[3], b[3]] : [b[3], a[3]];
    return (hi + 0.05) / (lo + 0.05);
  };

  const bg = at(0.5);
  const core = at(0.98);
  return {
    bg: [bg[0], bg[1], bg[2]],
    core: [core[0], core[1], core[2]],
    ratio: contrast(core, bg),
    samples: rows.length,
  };
};

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
const page = await context.newPage();

const SCENES = [
  { id: 'void', at: 0.08 },
  { id: 'fracture', at: 0.27 },
  { id: 'threshold', at: 0.48 },
  { id: 'echoes', at: 0.7 },
  { id: 'afterlight', at: 0.93 },
];

console.log('\n  scene             text   background   measured    WCAG AA');
console.log('  ' + '─'.repeat(60));

const results = [];

for (const vp of [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'phone' },
]) {
  await page.setViewportSize(vp);
  await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
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

  for (const scene of SCENES) {
    await page.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * f, behavior: 'auto' });
    }, scene.at);
    await page.waitForTimeout(2600);

    // The caption column ends with the overlay's prose paragraph.
    const box = await page.evaluate((id) => {
      const section = document.querySelector(`[data-scene="${id}"]`);
      const prose = [...(section?.querySelectorAll('p') ?? [])].at(-1);
      if (!prose) return null;
      const r = prose.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom > window.innerHeight || r.top < 0) return null;
      // Viewport-relative, matching the viewport screenshot sampled below.
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height),
        fontSize: parseFloat(getComputedStyle(prose).fontSize),
        color: getComputedStyle(prose).color,
      };
    }, scene.id);

    if (!box) {
      console.log(`  ${(vp.name + '/' + scene.id).padEnd(14)} offscreen — skipped`);
      continue;
    }

    const frame = await page.screenshot();
    const measured = await page.evaluate(MEASURE, {
      dataUrl: `data:image/png;base64,${frame.toString('base64')}`,
      rect: box,
    });
    if (!measured) {
      console.log(`  ${(vp.name + '/' + scene.id).padEnd(14)} too few pixels — skipped`);
      continue;
    }

    const ok = measured.ratio >= 4.5;
    results.push({ label: `${vp.name}/${scene.id}`, ratio: measured.ratio, ok });
    console.log(
      `  ${`${vp.name}/${scene.id}`.padEnd(17)}${`${box.fontSize}px`.padEnd(7)}` +
        `${`rgb(${measured.bg.join(',')})`.padEnd(13)}${`${measured.ratio.toFixed(2)}:1`.padEnd(12)}` +
        `${ok ? 'pass' : 'BELOW AA'}`,
    );
  }
}

console.log('');
const failing = results.filter((r) => !r.ok);
if (failing.length === 0) {
  console.log(`  all ${results.length} caption blocks meet WCAG AA (4.5:1)`);
} else {
  console.log(`  ${failing.length} of ${results.length} below AA:`);
  for (const f of failing) console.log(`    ${f.label} ${f.ratio.toFixed(2)}:1`);
}

await browser.close();
process.exitCode = failing.length === 0 ? 0 : 1;