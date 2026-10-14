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

export interface SampledFrame {
  stats: FrameStats;
  /** Downscaled per-pixel luminance, for frame-to-frame comparison. */
  luma: number[];
}

/**
 * Waits for a frame to stop changing, then returns it.
 *
 * A fixed timeout is wrong here: on the software rasteriser a scene can take
 * well over four seconds to compile its programs and let the damped camera
 * settle, and that time scales with machine load — which is exactly what a
 * full-suite run adds. Sampling until two consecutive frames agree removes the
 * coupling without weakening the assertions: a genuinely broken scene never
 * settles on a composed frame, so the checks below still fail.
 */
const settleFrame = async (
  page: Page,
  target: Locator,
  { attempts = 14, interval = 1200, tolerance = 0.6 } = {},
): Promise<FrameStats> => {
  let previous: FrameStats | null = null;
  let latest: FrameStats | null = null;

  for (let i = 0; i < attempts; i += 1) {
    latest = await sampleFrame(page, target);
    if (
      previous !== null &&
      Math.abs(latest.mean - previous.mean) < tolerance &&
      Math.abs(latest.deviation - previous.deviation) < tolerance
    ) {
      return latest;
    }
    previous = latest;
    if (i < attempts - 1) await page.waitForTimeout(interval);
  }
  // Never settled. Return the last real frame so the caller reports actual
  // numbers instead of a synthetic "timed out" value.
  if (latest === null) throw new Error('settleFrame: no frame could be sampled');
  return latest;
};

/**
 * Screenshots the viewport and measures the luminance histogram of `target`
 * within it.
 *
 * Deliberately *not* `locator.screenshot()`: that waits for the element to be
 * "stable" across animation frames first, and on a saturated software rasteriser
 * that wait can outlast its own 30s timeout — which is the flake this replaced.
 * A plain viewport screenshot has no such precondition, and cropping to the
 * element's rect yields the identical pixels.
 */
const grabFrame = async (page: Page, target: Locator): Promise<SampledFrame> => {
  const rect = await target.boundingBox();
  if (!rect || rect.width < 2 || rect.height < 2) {
    throw new Error('grabFrame: target has no measurable box');
  }
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('grabFrame: no viewport');

  const buffer = await page.screenshot({ timeout: 30_000 });
  return page.evaluate(
    async ({ dataUrl, rect: r, vw }) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();

      const scale = image.naturalWidth / vw;
      const scratch = document.createElement('canvas');
      scratch.width = 160;
      scratch.height = 90;
      const ctx = scratch.getContext('2d');
      if (!ctx) throw new Error('no 2d context for sampling');
      // Clip to the element's own box before downscaling, so the measurement
      // covers the canvas and not the HUD composited over it.
      ctx.drawImage(
        image,
        r.x * scale,
        r.y * scale,
        r.width * scale,
        r.height * scale,
        0,
        0,
        scratch.width,
        scratch.height,
      );
      const { data } = ctx.getImageData(0, 0, scratch.width, scratch.height);

      let min = 255;
      let max = 0;
      let sum = 0;
      let sumSq = 0;
      let lit = 0;
      const n = scratch.width * scratch.height;
      const luma = new Float64Array(n);
      for (let i = 0; i < n; i += 1) {
        const value = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
        luma[i] = value;
        if (value < min) min = value;
        if (value > max) max = value;
        if (value > 6) lit += 1;
        sum += value;
        sumSq += value * value;
      }
      const mean = sum / n;
      return {
        stats: { min, max, mean, deviation: Math.sqrt(Math.max(0, sumSq / n - mean * mean)), litRatio: lit / n },
        luma: Array.from(luma),
      };
    },
    {
      dataUrl: `data:image/png;base64,${buffer.toString('base64')}`,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      vw: viewport.width,
    },
  );
};

const sampleFrame = async (page: Page, target: Locator): Promise<FrameStats> =>
  (await grabFrame(page, target)).stats;

/**
 * Mean absolute per-pixel difference between two frames.
 *
 * Comparing *means* cannot answer "did the picture move": an animating warp
 * redistributes light without changing how much there is, so the difference of
 * means stays around 0.05 while the image is in fact completely different.
 * Comparing pixels can.
 */
const pixelDifference = (a: number[], b: number[]): number => {
  if (a.length !== b.length) throw new Error('pixelDifference: frame sizes differ');
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += Math.abs(a[i] - b[i]);
  return total / a.length;
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
      // Let the scene mount, compile its programs, and let the damped camera
      // settle — waiting for the frame to stabilise rather than for a fixed
      // period, which is how this test used to flake under suite load.
      const stats = await settleFrame(page, stage);
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

      const stats = await settleFrame(page, page.locator('canvas').first());
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
    await page.waitForTimeout(2000);
    const a = await grabFrame(page, stage);
    await page.waitForTimeout(2000);
    const b = await grabFrame(page, stage);
    const whilePaused = pixelDifference(a.luma, b.luma);

    await page.getByRole('button', { name: /^resume$/i }).click();
    await page.waitForTimeout(4000);
    const c = await grabFrame(page, stage);
    const afterResume = pixelDifference(b.luma, c.luma);

    // Thresholds come from measurement, not from what makes the test pass.
    // Measured on this rasteriser: paused frames differ by ~1.0-1.2 mean
    // absolute level, running frames by ~8.5-9.8 — an eightfold gap. The paused
    // floor is not zero because the post-processing grain is driven by the
    // renderer's own clock, which Pause does not stop (it halts the scene
    // clock); the assertion therefore checks separation, not silence.
    expect(whilePaused, 'frame kept moving while paused').toBeLessThan(3);
    expect(afterResume, 'frame did not resume').toBeGreaterThan(5);
    expect(afterResume, 'paused and running frames are indistinguishable').toBeGreaterThan(whilePaused * 2);
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
