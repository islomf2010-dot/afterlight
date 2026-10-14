import { expect, test } from '@playwright/test';
import { FORCE_WEBGL, collectConsoleErrors } from './helpers';

const ROUTES = ['/', '/lab', '/lab/particles', '/lab/shaders', '/lab/portal', '/archive', '/credits'];

test.describe('routing', () => {
  test('every route responds with a real page', async ({ page }) => {
    for (const route of ROUTES) {
      const errors = collectConsoleErrors(page);
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);

      await expect(page.getByRole('main'), route).toBeVisible();
      // The shared navigation exists on every route. On `/` it is withheld
      // from assistive tech until the visitor enters the film — the film opens
      // on black and a keyboard user should not tab into chrome they cannot
      // see — so assert its absence there and its presence everywhere else.
      const nav = page.getByRole('navigation', { name: 'Primary' });
      if (route === '/') await expect(nav).toHaveCount(0);
      else await expect(nav).toBeVisible();
      expect(errors, `${route}\n${errors.join('\n')}`).toHaveLength(0);
    }
  });

  test('a browser refresh works on every nested route', async ({ page }) => {
    for (const route of ROUTES.slice(2)) {
      await page.goto(route);
      await page.reload();
      await expect(page.getByRole('main'), route).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Primary' }), route).toBeVisible();
    }
  });

  test('unknown paths render the 404, not a blank page', async ({ page }) => {
    for (const bad of ['/nope', '/deep/deep/path']) {
      await page.goto(bad);
      await expect(page.getByRole('heading', { name: /Nothing was shot here/ }), bad).toBeVisible();
      await expect(page.getByText(bad), bad).toBeVisible();
    }

    // An unknown *study* is a genuine 404 too: /lab/nope is not a redirect to
    // the laboratory hub.
    await page.goto('/lab/nope');
    await expect(page.getByRole('heading', { name: /Nothing was shot here/ })).toBeVisible();
    await expect(page).toHaveURL(/\/404$/);
  });

  test('client-side navigation between routes works without a reload', async ({ page }) => {
    await page.goto('/archive');
    await expect(page.getByRole('heading', { name: 'The log' })).toBeVisible();

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Laboratory/ }).click();
    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.getByRole('heading', { name: 'Studies' })).toBeVisible();

    await page.getByRole('link', { name: /II · Domain warp/ }).click();
    await expect(page).toHaveURL(/\/lab\/shaders$/);
    await expect(page.getByRole('heading', { name: 'Domain warp' })).toBeVisible();

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Credits/ }).click();
    await expect(page).toHaveURL(/\/credits$/);
    await expect(page.getByRole('heading', { name: 'AFTERLIGHT' }).first()).toBeVisible();
  });

  test('the archive permalinks jump into the film', async ({ page }) => {
    await page.goto(`${FORCE_WEBGL}`);
    await page.getByRole('button', { name: /^enter$/i }).click();
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Archive/ }).click();
    await expect(page.getByRole('heading', { name: 'The log' })).toBeVisible();

    await page.getByRole('button', { name: /Enter scene/ }).nth(2).click();
    await expect(page).toHaveURL(/\/$/);
    await page.waitForTimeout(1800);

    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(200);
  });

  test('the film mounts without a WebGL context and still tells its story', async ({ page }) => {
    // `renderer=off` forces the written version, exactly as a WebGL-less browser
    // would get it. The loading gate must still open — a visitor with no GPU
    // must never be locked out of the film.
    await page.goto('/?renderer=off');
    await expect(page.getByRole('button', { name: /^enter$/i })).toBeEnabled({ timeout: 30_000 });
    await page.getByRole('button', { name: /^enter$/i }).click();

    await expect(page.getByText('Static mode')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    for (const heading of ['The Void', 'Fracture', 'The Threshold', 'Echoes', 'Afterlight']) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached();
    }

    // The archive is the canonical written version and must still work.
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Archive/ }).click();
    await expect(page.getByRole('heading', { name: 'The log' })).toBeVisible();
  });
});
