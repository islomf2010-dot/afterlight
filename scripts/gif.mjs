/**
 * Records the film and assembles a looping GIF for the README.
 *
 * Frames are captured by scrolling the real page — the same scroll that drives
 * the film — rather than by animating anything separately, so the GIF is a
 * genuine recording of what a visitor sees and nothing in it is staged.
 *
 *   node scripts/gif.mjs
 *
 * Output: docs/preview.gif
 */
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FRAMES = join(ROOT, '.frames');
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

// Sized to read well in a README column without bloating the repository.
const WIDTH = 760;
const COUNT = 46;
// Long enough that the slow scenes do not strobe, short enough to stay small.
const FPS = 14;

mkdirSync(FRAMES, { recursive: true });
for (const f of await (await import('node:fs')).promises.readdir(FRAMES)) {
  rmSync(join(FRAMES, f));
}

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${BASE}/?renderer=force`, { waitUntil: 'networkidle' });
await page.waitForFunction(
  () => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent?.trim() === 'Enter');
    return b && !b.disabled;
  },
  undefined,
  { timeout: 60000 },
);
// Let the curtain finish lifting before the first frame, or the GIF opens on
// a black rectangle.
await page.waitForTimeout(1500);
await page.getByRole('button', { name: /^enter$/i }).click();
await page.waitForTimeout(4000);

const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

for (let i = 0; i < COUNT; i += 1) {
  const at = i / (COUNT - 1);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), maxScroll * at);
  // The software rasteriser runs at roughly 8-20fps, so this is long enough for
  // the scene to mount, its camera to settle and the shader to recompile.
  await page.waitForTimeout(1800);
  const name = join(FRAMES, `f${String(i).padStart(3, '0')}.png`);
  await page.locator('[data-testid="journey-canvas"]').screenshot({ path: name, timeout: 60000 });
  process.stdout.write(`\r  frame ${i + 1}/${COUNT}`);
}
console.log('');
await browser.close();

// The canvas is fixed and full-viewport, so it covers the whole frame; the
// screenshots are therefore already 1440x900.
const out = join(ROOT, 'docs/preview.gif');
execFileSync('magick', [
  '-delay', String(Math.round(100 / FPS)),
  ...Array.from({ length: COUNT }, (_, i) => join(FRAMES, `f${String(i).padStart(3, '0')}.png`)),
  '-resize', `${WIDTH}x`,
  '-colors', '200',
  '-dither', 'FloydSteinberg',
  '-layers', 'OptimizeFrame',
  '-loop', '0',
  out,
], { stdio: 'inherit' });

console.log('docs/preview.gif written');