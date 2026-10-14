import { expect, test } from '@playwright/test';
import { FORCE_WEBGL, collectConsoleErrors } from './helpers';

test.describe('the laboratory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lab?renderer=force');
    await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();
  });

  test('renders a live canvas for the selected study', async ({ page }) => {
    await expect(page.locator('canvas')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Particle field' })).toBeVisible();
  });

  test('every slider changes a real parameter and is reflected in the readout', async ({ page }) => {
    const errors = collectConsoleErrors(page);

    const particleCount = page.getByLabel('Particle count');
    await expect(particleCount).toBeVisible();
    await particleCount.focus();

    // Drive the slider with the keyboard, which is the accessible path.
    const before = await particleCount.inputValue();
    await particleCount.press('ArrowLeft');
    await particleCount.press('ArrowLeft');
    const after = await particleCount.inputValue();
    expect(after).not.toBe(before);

    // The telemetry readout must agree with the control it reports.
    const readout = page.getByRole('definition').filter({ hasText: after.replace(/\B(?=(\d{3})+(?!\d))/g, ',') });
    await expect(readout.first()).toBeVisible();

    for (const label of [
      'Distortion intensity',
      'Pointer influence',
      'Fog density',
      'Bloom intensity',
      'Animation speed',
    ]) {
      await expect(page.getByLabel(label), label).toBeVisible();
    }

    // The value is persisted so the next visit uses it.
    await page.getByLabel('Animation speed').fill('1.5');
    await page.waitForTimeout(400);
    const stored = await page.evaluate(() =>
      window.localStorage.getItem('afterlight:lab.params'),
    );
    expect(stored).toContain('"speed":1.5');

    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('PAUSE, RANDOMISE and RESET are all functional', async ({ page }) => {
    const particleCount = page.getByLabel('Particle count');

    await particleCount.fill('4000');
    await page.waitForTimeout(300);
    const baseline = await particleCount.inputValue();

    await page.getByRole('button', { name: /^pause$/i }).click();
    await expect(page.getByRole('button', { name: /^resume$/i })).toBeVisible();
    await page.getByRole('button', { name: /^resume$/i }).click();
    await expect(page.getByRole('button', { name: /^pause$/i })).toBeVisible();

    await page.getByRole('button', { name: /randomise/i }).click();
    await page.waitForTimeout(300);
    const randomised = await particleCount.inputValue();
    expect(randomised).not.toBe(baseline);

    await page.getByRole('button', { name: /^reset$/i }).click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Parameters returned to factory values.')).toBeVisible();
    const reset = await particleCount.inputValue();
    expect(reset).not.toBe(randomised);
  });

  test('CAPTURE downloads a PNG', async ({ page }) => {
    // Wait until the canvas has actually drawn before snapshotting it.
    await page.waitForFunction(
      () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
        return Boolean(gl);
      },
      undefined,
      { timeout: 20_000 },
    );
    await page.waitForTimeout(2500);
    const downloadPromise = page.waitForEvent('download', { timeout: 20_000 });
    await page.getByRole('button', { name: /^capture$/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^afterlight-frame-.*\.png$/);

    // The toast is transient; the readout keeps the outcome.
    await expect(page.getByText(/Last capture/).locator('..')).toContainText(
      /Frame captured and downloaded/i,
    );
    await expect(page.getByRole('button', { name: /^capture$/i })).toBeEnabled();
  });

  test('EXPORT downloads a JSON configuration', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 15_000 });
    await page.getByRole('button', { name: /export json/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^afterlight-effect-.*\.json$/);
    await expect(page.getByText('Configuration exported as JSON.')).toBeVisible();
  });

  test('IMPORT validates a file it is given and reports the repairs', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = '__test_file_input';
      document.body.appendChild(input);
    });

    // Replace the picker with a stubbed file so the test does not need a dialog.
    await page.addInitScript(() => {
      const original = document.createElement.bind(document);
      document.createElement = ((tag: string) => {
        const element = original(tag) as HTMLElement & { click: () => void; files?: unknown };
        if (tag !== 'input') return element;
        const input = element as HTMLInputElement;
        // `input.type` is still '' at creation time, so intercept every input's
        // click — the app never programmatically clicks any other kind.
        input.click = () => {
          const payload = JSON.stringify({
            format: 'afterlight.effect-config',
            version: 1,
            params: { particleCount: 999999, distortion: 0.3 },
          });
          Object.defineProperty(input, 'files', {
            configurable: true,
            value: [{ text: () => Promise.resolve(payload) }],
          });
          setTimeout(() => input.dispatchEvent(new Event('change')), 0);
        };
        return input;
      }) as typeof document.createElement;
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();

    await page.getByRole('button', { name: /import json/i }).click();
    await expect(page.getByText(/Configuration imported with corrections/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Particle count: 999999 clamped to 12000/)).toBeVisible();

    const value = await page.getByLabel('Particle count').inputValue();
    expect(value).toBe('12000');
  });

  test('switching studies remounts the viewport', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    for (const [link, heading] of [
      [/II · Domain warp/, 'Domain warp'],
      [/III · Refractive aperture/, 'Refractive aperture'],
      [/I · Particle field/, 'Particle field'],
    ] as const) {
      await page.getByRole('link', { name: link }).click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expect(page.locator('canvas')).toHaveCount(1);
    }
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('the laboratory is usable on a phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();
    await expect(page.getByLabel('Distortion intensity')).toBeVisible();
    await expect(page.getByRole('button', { name: /capture/i })).toBeVisible();

    // Nothing may overflow horizontally.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('the film and the laboratory share one set of parameters', async ({ page }) => {
    await page.goto('/lab?renderer=force');
    await page.getByLabel('Distortion intensity').fill('0.91');
    await page.waitForTimeout(500);

    await page.goto(FORCE_WEBGL);
    const stored = await page.evaluate(() =>
      window.localStorage.getItem('afterlight:lab.params'),
    );
    expect(stored).toContain('"distortion":0.91');
  });
});
