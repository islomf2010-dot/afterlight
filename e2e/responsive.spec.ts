import { expect, test } from '@playwright/test';
import { FORCE_WEBGL, enterTheFilm } from './helpers';

/**
 * Responsive regression suite.
 *
 * These assertions exist because of three real defects found during audit that
 * no other test could see:
 *
 *  1. `hidden` loses to `inline-flex` in Tailwind's cascade, so controls marked
 *     `className="hidden lg:inline-flex"` were rendering on phones. The DOM was
 *     correct — the classes were simply not doing what they said.
 *  2. At exactly 768px the desktop navigation switched on while the sound and
 *     settings controls were still visible, and the header overflowed.
 *  3. The scene rail's markers were 20×24px on touch — below any reasonable
 *     target size.
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, touch: false },
  { name: 'laptop', width: 1280, height: 800, touch: false },
  { name: 'tablet', width: 768, height: 1024, touch: true },
  { name: 'phone', width: 390, height: 844, touch: true },
] as const;

interface RouteSpec {
  path: string;
  name: string;
  enter: boolean;
}

const ROUTES: readonly RouteSpec[] = [
  { path: FORCE_WEBGL, name: 'film', enter: true },
  { path: '/lab?renderer=force', name: 'lab', enter: false },
  { path: '/archive', name: 'archive', enter: false },
  { path: '/credits', name: 'credits', enter: false },
];

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch });

    for (const route of ROUTES) {
      test(`${route.name} fits without overflow, clipping or tiny targets`, async ({ page }) => {
        const errors = collectConsole(page);
        await page.goto(route.path);
        if (route.enter) await enterTheFilm(page);
        await page.waitForTimeout(700);

        const audit = await page.evaluate(() => {
          const doc = document.documentElement;
          const coarse = matchMedia('(pointer: coarse)').matches;
          // WCAG 2.2 AA floors a target at 24x24; touch pointers get the 44px
          // that Apple and Material advise. A mouse does not need 44px, and
          // inflating the desktop HUD to satisfy a touch rule is the wrong trade.
          const minTarget = coarse ? 44 : 24;
          const inViewport = (r: DOMRect): boolean =>
            r.bottom >= 0 && r.top <= doc.clientHeight && r.right >= 0 && r.left <= doc.clientWidth;

          const clipped: string[] = [];
          const small: string[] = [];

          for (const el of document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main button, main a, main input')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (!inViewport(r)) continue; // pinned/focused-only elements are fine
            if (r.right > doc.clientWidth + 1 || r.left < -1) {
              clipped.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 20)}"`);
            }
          }

          for (const el of document.querySelectorAll<HTMLElement>('button, a[href], input[type=range], [role=switch], [role=radio]')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (getComputedStyle(el).visibility === 'hidden') continue;
            if (!inViewport(r)) continue; // the skip link lives off-screen by design
            if (r.height < minTarget || r.width < minTarget) {
              small.push(
                `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 18)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
              );
            }
          }

          return {
            overflowX: doc.scrollWidth - doc.clientWidth,
            clipped: clipped.slice(0, 4),
            small: small.slice(0, 6),
            coarse,
          };
        });

        expect(audit.overflowX, `${route.name} horizontal overflow`).toBeLessThanOrEqual(1);
        expect(audit.clipped, `${route.name} clipped elements`).toEqual([]);
        expect(audit.small, `${route.name} small targets (pointer: ${audit.coarse ? 'coarse' : 'fine'})`).toEqual([]);
        expect(errors, `${route.name} console errors`).toEqual([]);
      });
    }

    test('the header shows exactly the controls that fit', async ({ page }) => {
      await page.goto('/archive');
      await page.waitForTimeout(600);

      const header = await page.evaluate(() => {
        const visible = (el: Element | null): boolean => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none';
        };
        const header = document.querySelector('header');
        const settings: Element | null =
          [...(header?.querySelectorAll('button') ?? [])].find(
            (b) => b.getAttribute('aria-label') === 'Open settings',
          ) ?? null;
        const menu: Element | null = header?.querySelector('button[aria-controls="al-mobile-nav"]') ?? null;
        return {
          navLinks: visible(header?.querySelector('nav[aria-label="Primary"]') ?? null),
          settings: visible(settings),
          menu: visible(menu),
        };
      });

      // The drawer and the inline controls are alternatives, never both.
      if (header.navLinks) {
        expect(header.menu, 'desktop nav should hide the menu button').toBe(false);
      } else {
        expect(header.menu, 'compact nav should show the menu button').toBe(true);
      }
      expect(header.settings, 'inline settings only appears with the desktop nav').toBe(header.navLinks);
    });
  });
}

function collectConsole(page: import('@playwright/test').Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
