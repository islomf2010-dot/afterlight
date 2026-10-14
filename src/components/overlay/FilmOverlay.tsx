import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * Film grain + vignette + letterbox.
 *
 * The grain is a procedurally generated data-URI noise tile (no external
 * asset, ~1.4KB inline) animated by stepping `background-position` on a
 * compositor-friendly transform. It is `aria-hidden`, non-interactive, and
 * disabled entirely under reduced motion — where a static grain is used
 * instead of an animated one.
 */
export const FilmOverlay = () => {
  const grain = useSettingsStore((s) => s.grain);
  const reduced = useSettingsStore((s) => s.motion === 'reduced');
  const frame = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    // 8 discrete offsets is indistinguishable from continuous noise at this
    // opacity and avoids a repaint every frame.
    const offsets = [
      [0, 0],
      [-3, 2],
      [2, -3],
      [-2, -2],
      [3, 3],
      [-3, -1],
      [1, 3],
      [-1, -3],
    ];
    let index = 0;
    const id = window.setInterval(() => {
      index = (index + 1) % offsets.length;
      const [x, y] = offsets[index];
      if (frame.current) frame.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, 90);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.82) 100%)',
        }}
      />
      {grain ? (
        <div
          ref={frame}
          aria-hidden="true"
          data-grain={reduced ? 'static' : 'animated'}
          className="pointer-events-none fixed inset-[-12%] z-[81] opacity-[var(--al-grain-opacity)] mix-blend-screen"
          style={{
            backgroundImage: `url("${NOISE_DATA_URI}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            willChange: 'transform',
          }}
        />
      ) : null}
    </>
  );
};

/**
 * 180×180 tile of monochrome noise, generated once at module load. Encoding it
 * by hand avoids shipping a binary asset and keeps the offline build identical
 * to the online one.
 */
const buildNoiseTile = (size = 180): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const image = ctx.createImageData(size, size);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    // Triangular distribution reads more like film grain than uniform noise.
    const v = (Math.random() + Math.random() + Math.random()) / 3;
    const level = Math.round(v * 255);
    data[i] = level;
    data[i + 1] = level;
    data[i + 2] = level;
    data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

let cachedTile = '';
const NOISE_DATA_URI = (() => {
  if (typeof document === 'undefined') return '';
  cachedTile = buildNoiseTile();
  return cachedTile;
})();
