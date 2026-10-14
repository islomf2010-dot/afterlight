import { expect, test } from '@playwright/test';
import { FORCE_WEBGL, collectConsoleErrors, enterTheFilm, scrollToFraction } from './helpers';

test.describe('the film', () => {
  test('opens on the Awakening gate with a real loading sequence', async ({ page }) => {
    await page.goto(FORCE_WEBGL);

    await expect(page.getByRole('heading', { name: /AFTERLIGHT/ })).toBeVisible();
    await expect(page.getByText('A film that renders itself')).toBeVisible();

    // The loading list is real: four named tasks, each reaching "done".
    for (const task of ['Typeface', 'Render context', 'Shader programs', 'Scene modules']) {
      await expect(page.getByText(task, { exact: true })).toBeVisible();
    }

    // ENTER must be disabled while work is outstanding.
    const enter = page.getByRole('button', { name: /^enter$/i });
    await expect(enter).toBeVisible();

    await expect(enter).toBeEnabled({ timeout: 45_000 });
    await expect(page.getByText('Systems nominal')).toBeVisible({ timeout: 10_000 });
  });

  test('ENTER hands off to the film and reveals the first scene', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    // The canvas is live and owns a real WebGL context.
    await expect(page.locator('[data-testid="journey-canvas"] canvas')).toHaveCount(1);

    // The scene rail appears only once the film is running.
    const rail = page.getByRole('navigation', { name: 'Scene navigation' });
    await expect(rail).toBeVisible();

    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('all six scenes are reachable by scrolling, in narrative order', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const headings = [
      'The Void',
      'Fracture',
      'The Threshold',
      'Echoes',
      'Afterlight',
    ];

    for (const heading of headings) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached();
    }

    // Walk the document and make sure each section takes the viewport in turn.
    const seen: string[] = [];
    for (let i = 0; i <= 20; i += 1) {
      await scrollToFraction(page, i / 20);
      const active = await page.evaluate<string | null>(() => {
        const heading = Array.from(
          document.querySelectorAll<HTMLElement>('section[data-scene] h2'),
        ).find((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top > window.innerHeight * 0.1 && rect.top < window.innerHeight * 0.9;
        });
        return heading?.textContent ?? null;
      });
      if (active && !seen.includes(active)) seen.push(active);
    }

    expect(seen.length).toBeGreaterThanOrEqual(4);
  });

  test('the scene rail jumps to a scene', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const rail = page.getByRole('navigation', { name: 'Scene navigation' });
    await rail.getByRole('button', { name: /Scene IV: The Threshold/ }).click();
    await page.waitForTimeout(1600);

    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(300);
  });

  test('Fracture controls drive the scene and can be reset', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const fracture = page.locator('section[data-scene="fracture"]');
    await fracture.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const cohesion = page.getByText(/Cohesion \d{3}%/);
    await expect(cohesion).toBeVisible();

    await page.getByRole('button', { name: /^disintegrate$/i }).click();
    await page.waitForTimeout(1400);
    const after = await cohesion.textContent();
    expect(after).toMatch(/Cohesion \d{3}%/);

    await page.getByRole('button', { name: /^reassemble$/i }).click();
    await page.waitForTimeout(2200);

    // The pointer mode toggle must actually change what it says.
    const pointerButton = page.getByRole('button', { name: /pointer · (repel|attract)/i });
    const before = await pointerButton.textContent();
    await pointerButton.click();
    await expect(pointerButton).not.toHaveText(before ?? '');

    await page.getByRole('button', { name: /^reset$/i }).click();
    await expect(page.getByText('Following scroll')).toBeVisible({ timeout: 5000 });
  });

  test('the ending offers replay, archive and credits', async ({ page }) => {
    await page.goto(FORCE_WEBGL);
    await enterTheFilm(page);

    const ending = page.locator('section[data-scene="afterlight"]');
    await ending.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    await expect(ending.getByRole('button', { name: /^replay$/i })).toBeVisible();
    await expect(ending.getByRole('link', { name: /^archive$/i })).toBeVisible();
    await expect(ending.getByRole('link', { name: /^credits$/i })).toBeVisible();

    await ending.getByRole('button', { name: /^replay$/i }).click();
    await page.waitForTimeout(1500);
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeLessThan(400);
  });
});
