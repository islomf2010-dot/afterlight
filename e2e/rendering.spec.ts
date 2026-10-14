import { expect, test, type Locator, type Page } from '@playwright/test';
import { FORCE_WEBGL, collectConsoleErrors, enterTheFilm } from './helpers';

/**
 * Pixel-level assertions.
 *
 * Every other suite in this project checks that the DOM is right. These check
 * that something was actually *drawn* — the failure mode DOM assertions cannot
 * see. A real bug shipped during development where the laboratory's particle
 * exhibit rendered at zero opacity while every control, every readout and every
 * other test around it passed.
 *
 * Measurement is done on a Playwright screenshot of the composited page rather
 * than on `canvas.toDataURL()`: `preserveDrawingBuffer` is deliberately off
 * (it costs a buffer copy on every frame of normal playback), so reading the
 * drawing buffer from outside the render task legitimately yields black. What
 * the visitor sees is the composited result, and that is what we assert on.
 */

export interface FrameStats {
  min: number;
  max: number;
  mean: number;
  /** Population standard deviation of luminance. */
  deviation: number;
  /** Fraction of samples that are not pure black. */
  litRatio: number;
}

/** Screenshots `target` and measures the luminance histogram in the page. */
const sampleFrame = async (page: Page, target: Locator): Promise<FrameStats> => {
  const buffer = await target.screenshot({ animations: 'disabled', timeout: 30_000 });
  return page.evaluate(async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();

    const scratch = document.createElement('canvas');
    scratch.width = 160;
    scratch.height = 90;
    const ctx = scratch.getContext('2d');
    if (!ctx) throw new Error('no 2d context for sampling');
    ctx.drawImage(image, 0, 0, scratch.width, scratch.height);
    const { data } = ctx.getImageData(0, 0, scratch.width, scratch.height);

    let min = 255;
    let max = 0;
    let sum = 0;
    let sumSq = 0;
    let lit = 0;
    const n = scratch.width * scratch.height;
    for (let i = 0; i < n; i += 1) {
      const luma = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
      if (luma < min) min = luma;
      if (luma > max) max = luma;
      if (luma > 6) lit += 1;
      sum += luma;
      sumSq += luma * luma;
    }
    const mean = sum / n;
    return { min, max, mean, deviation: Math.sqrt(Math.max(0, sumSq / n - mean * mean)), litRatio: lit / n };
  }, `data:image/png;base64,${buffer.toString('base64')}`);
};

test.describe('rendering', () => {
  test('the film canvas paints a composed frame in every scene', async ({ page }) => {
    test.setTimeout(300_000);
    const errors = collectConsoleErrors(page);
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const stage = page.locator('[data-testid="journey-canvas"]');
    const stops: Array<[string, number]> = [
      ['void', 0.1],
      ['fracture', 0.3],
      ['threshold', 0.5],
      ['echoes', 0.72],
      ['afterlight', 0.9],
    ];

    const means: number[] = [];
    for (const [name, fraction] of stops) {
      await page.evaluate((f) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: max * f, behavior: 'auto' });
      }, fraction);
      // Let the scene mount, compile its programs, and let the damped camera settle.
      await page.waitForTimeout(4000);

      const stats = await sampleFrame(page, stage);
      means.push(stats.mean);
      // Not a flat black frame...
      expect(stats.max, `${name}: max luminance`).toBeGreaterThan(12);
      // ...not a flat white one...
      expect(stats.mean, `${name}: mean luminance`).toBeLessThan(205);
      // ...and genuinely composed, not a single blown-out value.
      expect(stats.deviation, `${name}: luminance spread`).toBeGreaterThan(3);
    }

    // The five scenes must not all be the same picture.
    expect(new Set(means.map((m) => Math.round(m))).size, `scenes identical: ${means.join(', ')}`).toBeGreaterThan(2);

    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('each laboratory study paints a distinct, non-empty frame', async ({ page }) => {
    test.setTimeout(300_000);
    const errors = collectConsoleErrors(page);
    const means: number[] = [];

    for (const study of ['particles', 'shaders', 'portal']) {
      await page.goto(`/lab/${study}?renderer=force`);
      await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();
      await page.waitForTimeout(4000);

      const stats = await sampleFrame(page, page.locator('canvas').first());
      expect(stats.max, `${study}: max luminance`).toBeGreaterThan(10);
      expect(stats.litRatio, `${study}: lit ratio`).toBeGreaterThan(0.01);
      expect(stats.deviation, `${study}: luminance spread`).toBeGreaterThan(2);
      means.push(stats.mean);
    }

    expect(new Set(means.map((m) => Math.round(m))).size, `studies identical: ${means.join(', ')}`).toBeGreaterThan(1);
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('PAUSE freezes the picture and RESUME restarts it', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/lab/shaders?renderer=force');
    await expect(page.getByRole('heading', { name: 'Domain warp' })).toBeVisible();
    await page.waitForTimeout(3500);
    const stage = page.locator('canvas').first();

    await page.getByRole('button', { name: /^pause$/i }).click();
    await page.waitForTimeout(1500);
    const a = await sampleFrame(page, stage);
    await page.waitForTimeout(1800);
    const b = await sampleFrame(page, stage);
    expect(Math.abs(a.mean - b.mean), 'frame kept moving while paused').toBeLessThan(3);

    await page.getByRole('button', { name: /^resume$/i }).click();
    await page.waitForTimeout(3000);
    const c = await sampleFrame(page, stage);
    expect(Math.abs(c.mean - b.mean), 'frame did not resume').toBeGreaterThan(0.3);
  });

  test('the transition curtain never covers the film', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);
    await page.waitForTimeout(1500);

    // The regression this guards: the curtain used to clear its own inline
    // styles on cleanup, which stripped React's `visibility: hidden` and left
    // an opaque panel over the entire film while every DOM assertion passed.
    const curtain = page.getByTestId('scene-curtain');
    await expect(curtain).toHaveCSS('visibility', 'hidden');

    const transform = await curtain.evaluate((el) => getComputedStyle(el).transform);
    expect(
      transform === 'none' || transform.includes('matrix(1, 0, 0, 0'),
      `curtain transform was ${transform}`,
    ).toBe(true);

    const stats = await sampleFrame(page, page.locator('[data-testid="journey-canvas"]'));
    expect(stats.max, 'film is black behind the curtain').toBeGreaterThan(10);
    expect(stats.deviation, 'film is a flat black panel').toBeGreaterThan(3);
  });
});
