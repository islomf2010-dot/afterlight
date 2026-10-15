import type { ReactNode } from 'react';

/**
 * A liquid-glass surface for the DOM layer.
 *
 * Adapted from `github.com/dashersw/liquid-glass-js` (MIT, © 2025 Armagan
 * Amcalar). The decision *not* to use upstream's runtime is recorded in
 * `studies/LiquidGlassSurface.tsx`; in short, it needs `html2canvas` to
 * rasterise the page and a second WebGL context, and it cannot see a WebGL
 * canvas — which is exactly what sits behind every one of these surfaces.
 *
 * What is carried across is its model rather than its pipeline: the same
 * rounded-rectangle geometry, the same edge / rim / base weighting with the
 * corner boosted over the straight sides, and the same cold silver tint.
 * Written in CSS it costs no context, composites on the GPU, and degrades to a
 * plain translucent panel where `backdrop-filter` is unsupported — which the
 * `@supports` guard below relies on.
 *
 * It deliberately does *not* wrap children in anything that would change
 * semantics: the element renders as a plain `div` unless told otherwise, so
 * callers keep their own `<button>`, `<a>` and focus behaviour and the glass is
 * purely visual.
 */
export type GlassTone = 'primary' | 'panel' | 'quiet';

export interface GlassSurfaceProps {
  children: ReactNode;
  tone?: GlassTone;
  className?: string;
  /** Corner radius token; defaults follow the tone. */
  radius?: string;
  /**
   * Rendered as this element. Defaults to `div`; pass `section` or `li` when
   * the surface is structural rather than decorative.
   */
  as?: 'div' | 'section' | 'li' | 'span';
}

export const GlassSurface = ({
  children,
  tone = 'panel',
  className,
  radius,
  as: Tag = 'div',
}: GlassSurfaceProps) => (
  <Tag
    data-glass={tone}
    className={['glass-surface', className].filter(Boolean).join(' ')}
    style={radius ? ({ '--al-glass-radius': radius } as React.CSSProperties) : undefined}
  >
    {children}
  </Tag>
);

export default GlassSurface;