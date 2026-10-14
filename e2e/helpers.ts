import { expect, type Page } from '@playwright/test';

/**
 * Shared helpers for the browser suite.
 *
 * Headless Chromium here runs on SwiftShader (software WebGL). The capability
 * probe deliberately classifies software rasterisers as "no WebGL", so every
 * test that exercises the 3D path opts back in with `?renderer=force`. Tests
 * that verify the *fallback* deliberately do not pass it.
 */

export const FORCE_WEBGL = '/?renderer=force';

/** Console errors that the app is allowed to produce (none, by design). */
export const collectConsoleErrors = (page: Page): string[] => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
};

/** Waits for the real loading tasks to settle so ENTER becomes enabled. */
export const waitForEntry = async (page: Page): Promise<void> => {
  const enter = page.getByRole('button', { name: /^enter$/i });
  await expect(enter).toBeVisible({ timeout: 45_000 });
  await expect(enter).toBeEnabled({ timeout: 45_000 });
};

export const enterTheFilm = async (page: Page): Promise<void> => {
  await waitForEntry(page);
  await page.getByRole('button', { name: /^enter$/i }).click();
  await expect(page.getByRole('heading', { name: 'The Void' })).toBeVisible({ timeout: 20_000 });
};

/** Scrolls the film to a fraction of the total document height. */
export const scrollToFraction = async (page: Page, fraction: number): Promise<void> => {
  await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * f, behavior: 'auto' });
  }, fraction);
  // One frame for ScrollTrigger to process, plus a little slack for the
  // damped camera to settle.
  await page.waitForTimeout(900);
};

export const hasWebGLCanvas = (page: Page): Promise<boolean> =>
  page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    return Boolean(gl);
  });
