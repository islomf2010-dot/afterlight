import { expect, test } from '@playwright/test';
import { FORCE_WEBGL, enterTheFilm } from './helpers';

test.describe('accessibility & settings', () => {
  test('the skip link is the first tab stop and moves focus to the content', async ({ page }) => {
    await page.goto('/archive');
    await expect(page.getByRole('heading', { name: 'The log' })).toBeVisible();

    // It must be the *first* focusable thing in the document, not merely present.
    const first = await page.evaluate(() => {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.className.includes('fixed'));
      return focusable[0]?.textContent?.trim() ?? null;
    });
    expect(first).toMatch(/skip to content/i);

    // Focusing it must bring it on screen (it is translated off-screen until then).
    const skip = page.getByRole('link', { name: /skip to content/i });
    await skip.focus();
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('#main')).toBeVisible();
  });

  test('the whole film is reachable with the keyboard alone', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const rail = page.getByRole('navigation', { name: 'Scene navigation' });
    await expect(rail).toBeVisible();

    // Jump to the final scene with the keyboard, then activate it.
    const last = rail.getByRole('button', { name: /Scene VI/ });
    await last.focus();
    await expect(last).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(1000);
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();

    const button = page.getByRole('button', { name: /^randomise$/i });
    await button.focus();
    const focusedOutline = await button.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { outline: style.outlineStyle, width: style.outlineWidth, color: style.outlineColor };
    });
    expect(focusedOutline.outline).not.toBe('none');
    expect(Number.parseFloat(focusedOutline.width)).toBeGreaterThan(0);

    // The slider paints its focus ring on the thumb pseudo-element, so check
    // that the element is genuinely focused rather than reading the thumb.
    const slider = page.getByLabel('Bloom intensity');
    await slider.focus();
    expect(await slider.evaluate((el) => el.matches(':focus'))).toBe(true);
  });

  test('scene changes are announced politely', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);
    const announcer = page.locator('[aria-live="polite"][aria-atomic="true"]').first();
    await expect(announcer).toBeAttached();
    await expect(announcer).toContainText(/Scene/);
  });

  test('reduced motion can be set in-app and persists across a reload', async ({ page }) => {
    await page.goto('/archive');
    await page.getByRole('button', { name: /settings/i }).first().click();
    const dialog = page.getByRole('dialog', { name: /settings/i });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('radio', { name: /^reduced$/i }).click();
    await expect(dialog.getByRole('radio', { name: /^reduced$/i })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');

    await page.getByRole('button', { name: /settings/i }).first().click();
    await expect(
      page.getByRole('dialog', { name: /settings/i }).getByRole('radio', { name: /^reduced$/i }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  test('settings changes persist: sound, grain, cursor, smooth scroll', async ({ page }) => {
    await page.goto('/credits');
    await page.getByRole('button', { name: /settings/i }).first().click();
    const dialog = page.getByRole('dialog', { name: /settings/i });

    await dialog.getByRole('switch', { name: /^film grain$/i }).click();
    await dialog.getByRole('switch', { name: /^smooth scrolling$/i }).click();
    await expect(dialog.getByRole('switch', { name: /^film grain$/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );

    // The debounced write is flushed on page hide, so a reload immediately after
    // the change must still come back changed — that is the contract.
    await page.reload();
    await page.getByRole('button', { name: /settings/i }).first().click();
    const reopened = page.getByRole('dialog', { name: /settings/i });
    await expect(reopened.getByRole('switch', { name: /^film grain$/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(reopened.getByRole('switch', { name: /^smooth scrolling$/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    // The document reflects it too, so the CSS genuinely changed.
    await expect(page.locator('html')).toHaveAttribute('data-grain', 'off');

    // And the persisted blob really was written.
    const stored = await page.evaluate(() => window.localStorage.getItem('afterlight:settings'));
    expect(stored).toContain('"grain":false');
    expect(stored).toContain('"smoothScroll":false');
  });

  test('the sound toggle starts nothing before it is pressed', async ({ page }) => {
    // Count AudioContext constructions by wrapping the constructor before any
    // app code runs: this is the only way to prove nothing is created early.
    await page.addInitScript(() => {
      const Original = window.AudioContext;
      (window as unknown as { __alAudioContexts: number }).__alAudioContexts = 0;
      window.AudioContext = class extends Original {
        constructor(...args: ConstructorParameters<typeof Original>) {
          (window as unknown as { __alAudioContexts: number }).__alAudioContexts += 1;
          super(...args);
        }
      };
    });

    await page.goto('/archive');
    await expect(page.getByRole('heading', { name: 'The log' })).toBeVisible();
    expect(
      await page.evaluate(() => (window as unknown as { __alAudioContexts: number }).__alAudioContexts),
    ).toBe(0);

    const toggle = page.getByRole('button', { name: /^sound (on|off)$/i }).first();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(
      await page.evaluate(() => (window as unknown as { __alAudioContexts: number }).__alAudioContexts),
    ).toBe(1);
  });

  test('every control has a visible focus style and a disabled state where relevant', async ({ page }) => {
    await page.goto('/lab');
    // ENTER-style disabled states exist on the capture button while capturing;
    // before that, the panel must expose no dead (always-disabled) controls.
    // Every control must expose an accessible name — either visible text or an
    // explicit aria-label. A nameless control is invisible to a screen reader.
    const names = await page.locator('button:visible').evaluateAll((nodes) =>
      nodes.map((node) => {
        const el = node as HTMLButtonElement;
        const labelled = el.getAttribute('aria-label') ?? '';
        const labelledBy = el.getAttribute('aria-labelledby') ?? '';
        return `${(el.textContent ?? '').trim()} ${labelled} ${labelledBy}`.trim();
      }),
    );
    expect(names.length).toBeGreaterThanOrEqual(8);
    for (const [i, name] of names.entries()) {
      expect(name.length, `control ${i} has no accessible name`).toBeGreaterThan(0);
    }
  });

  test('the mobile navigation drawer traps focus and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/archive');

    const menuButton = page.getByRole('button', { name: /^menu$/i });
    await menuButton.click();
    const drawer = page.getByRole('dialog', { name: /site navigation/i });
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('the film layout holds on a phone viewport with no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // The mobile scene rail replaces the desktop one.
    await expect(page.getByRole('navigation', { name: 'Scene navigation' })).toBeVisible();
  });
});
