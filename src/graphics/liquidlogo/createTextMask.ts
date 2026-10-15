import { CanvasTexture, LinearFilter, SRGBColorSpace, Texture } from 'three';

/**
 * Generates the liquid-metal mask from live text.
 *
 * The original `liquid-logo` demo masks its effect with third-party brand
 * logos. Those are trademarks, not ours to ship, and AFTERLIGHT's own asset
 * policy is that nothing in the build is a downloaded image. Rendering the
 * wordmark to an offscreen canvas keeps the mask a first-class, editable
 * property of the project: change the string, the mask changes with it, and
 * there is still no binary asset in the repository.
 *
 * The typeface is the one already loaded by the app, so the mask matches the
 * DOM wordmark exactly.
 */
export interface TextMaskOptions {
  text: string;
  /** Aspect ratio (width / height) of the generated texture. */
  aspect?: number;
  /** Weight passed to the canvas font. */
  weight?: number;
  fontFamily?: string;
}

/**
 * The maximum texture dimension. The mask is only ever sampled through a
 * heavily-blended edge detect, so it does not need to be large; 2048 is well
 * past the point where the bevel stops looking smooth at the sizes used.
 */
const MAX_DIMENSION = 2048;

const waitForFont = async (): Promise<void> => {
  // document.fonts is absent in some non-browser DOM implementations.
  const fonts = (globalThis as { document?: { fonts?: { ready: Promise<unknown> } } }).document?.fonts;
  if (!fonts) return;
  await fonts.ready;
};

/**
 * Renders `options.text` to an alpha texture.
 *
 * Returns a disposed-on-nothing texture: the caller owns it and must dispose
 * it, which is why this deliberately does not cache. A cached mask would keep
 * a texture alive for the life of the module after the wordmark unmounts.
 */
export const createTextMask = async (options: TextMaskOptions): Promise<CanvasTexture> => {
  const { text, aspect = 6, weight = 700, fontFamily } = options;
  await waitForFont();

  const canvas = document.createElement('canvas');
  // Height is fixed and width derived from the requested aspect, so the glyphs
  // are never stretched regardless of what the caller asks for.
  const height = Math.min(MAX_DIMENSION, 512);
  const width = Math.min(MAX_DIMENSION, Math.round(height * aspect));
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('createTextMask: no 2d context');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${Math.round(height * 0.72)}px ${
    fontFamily ??
    "'Space Grotesk Variable', 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
  }`;

  // Shrink to fit rather than letting the mask clip: a wordmark cut off at the
  // texture edge produces an open bevel on the final letter.
  let metrics = ctx.measureText(text);
  const maxWidth = width * 0.92;
  if (metrics.width > maxWidth) {
    const size = Math.round((parseInt(ctx.font.match(/(\d+)px/)?.[1] ?? '360', 10) * maxWidth) / metrics.width);
    ctx.font = ctx.font.replace(/(\d+)px/, `${size}px`);
    metrics = ctx.measureText(text);
  }
  ctx.fillText(text, width / 2, height / 2, maxWidth);

  const texture = new CanvasTexture(canvas as unknown as HTMLCanvasElement);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  // The mask is data, not colour: leaving it in sRGB would gamma-decode the
  // alpha-derived coverage and soften every edge.
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

export type { Texture };