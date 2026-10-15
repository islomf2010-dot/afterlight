/**
 * Renders the README banner from real frames of the film.
 *
 * Composed in the browser rather than in an image editor so the banner uses the
 * project's actual typefaces — the same Space Grotesk and IBM Plex Mono files
 * the app ships — instead of whatever font happens to be installed.
 *
 * Layout: the title sits in a darkened left column, and three scenes run as
 * vertical strips on the right. The frames are cropped to exclude their own
 * caption text, which is part of the screenshot rather than part of the image.
 *
 *   node scripts/banner.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1600;
const H = 520;

/*
  Scene name → the vertical slice of its frame to use.

  These are screenshots of the running app, so they carry its DOM: the site
  navigation occupies roughly the top 7% and the scene captions the lower
  third on the left. Every crop below stays inside the band between them —
  y 0.10–0.60 — so the banner shows the rendered scene and not the interface.
*/
const STRIPS = [
  { name: 'void', crop: [0.36, 0.1, 0.72, 0.6] },
  { name: 'threshold', crop: [0.34, 0.1, 0.7, 0.6] },
  { name: 'afterlight', crop: [0.4, 0.1, 0.8, 0.6] },
];

const dataUrl = (p) => `data:image/png;base64,${readFileSync(join(ROOT, p)).toString('base64')}`;

const grotesk = dataUrl('dist/assets/space-grotesk-latin-wght-normal-BhU9QXUp.woff2');
const plex = dataUrl('dist/assets/ibm-plex-mono-latin-400-normal-DMJ8VG8y.woff2');

const stripMarkup = STRIPS.map((s, i) => {
  const [x0, y0, x1, y1] = s.crop;
  return `<figure class="strip" style="--x0:${x0};--y0:${y0};--w:${x1 - x0};--h:${y1 - y0};--i:${i}">
      <img src="${dataUrl(`.shots/${s.name}.png`)}">
    </figure>`;
}).join('');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Space Grotesk'; src: url(${grotesk}) format('woff2'); font-weight: 300 700; }
  @font-face { font-family: 'IBM Plex Mono'; src: url(${plex}) format('woff2'); font-weight: 400; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${W}px; height: ${H}px; overflow: hidden; background: #050505; display: flex; position: relative; }

  /* --- left: the title column ------------------------------------------ */
  .title { width: 690px; padding: 0 64px 0 76px; display: flex; flex-direction: column; justify-content: center;
           background: linear-gradient(90deg, #050505 62%, rgba(5,5,5,0.86) 88%, rgba(5,5,5,0.55) 100%); z-index: 2; }
  .kicker { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.32em;
            text-transform: uppercase; color: rgba(191,197,202,0.6); display: flex; align-items: center; gap: 11px; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: #7fe0b0; flex: none; }
  h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 88px; line-height: 0.92;
       letter-spacing: -0.035em; color: #F3F2EE; margin-top: 20px; }
  .tag { font-family: 'Space Grotesk', sans-serif; font-weight: 300; font-size: 22px; line-height: 1.4;
         color: rgba(191,197,202,0.76); margin-top: 20px; max-width: 430px; }
  .tags { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(191,197,202,0.44); margin-top: 30px; display: flex; flex-wrap: wrap; gap: 8px 14px; }
  .tags span { border: 1px solid rgba(191,197,202,0.2); padding: 4px 9px; }

  /* --- right: the scene strips ----------------------------------------- */
  .frames { position: absolute; inset: 0 0 0 690px; display: flex; z-index: 1; }
  .strip { position: relative; flex: 1; overflow: hidden; }
  .strip + .strip { border-left: 1px solid rgba(5,5,5,0.9); }
  .strip img {
    position: absolute; width: 100%; height: 100%; object-fit: cover;
    /* Show only the chosen slice of the source frame. */
    transform-origin: 0 0;
  }
  /* Each strip crops a different region; the multipliers invert the object-fit
     scale so every image is magnified identically and the crop lands where the
     composition wants it. */
  .strip img { width: calc(100% / var(--w)); height: calc(100% / var(--h));
               margin-left: calc(var(--x0) * 100% / var(--w) * -1);
               margin-top: calc(var(--y0) * 100% / var(--h) * -1);
               max-width: none; }
  .frames::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(0deg, rgba(5,5,5,0.62) 0%, rgba(5,5,5,0) 42%),
                linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0) 16%);
  }
  .caption { position: absolute; right: 22px; bottom: 18px; z-index: 3; text-align: right;
             font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.24em;
             text-transform: uppercase; color: rgba(191,197,202,0.4); }
</style></head>
<body>
  <div class="frames">${stripMarkup}</div>
  <div class="title">
    <div class="kicker"><span class="dot"></span> Interactive WebGL</div>
    <h1>AFTERLIGHT</h1>
    <div class="tag">The world between frames — six scenes, one canvas, nothing downloaded.</div>
    <div class="tags"><span>React Three Fiber</span><span>GLSL</span><span>GSAP</span><span>TypeScript</span></div>
  </div>
  <div class="caption">II The Void · IV The Threshold · VI Afterlight</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
const buffer = await page.screenshot();
writeFileSync(join(ROOT, 'docs/banner.png'), buffer);
console.log('docs/banner.png', buffer.length, 'bytes');
await browser.close();