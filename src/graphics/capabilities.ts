/**
 * Device capability probing.
 *
 * Runs once at boot. Everything is a heuristic — the point is not to be right,
 * it is to pick a safe starting budget and to never try to render on a device
 * that cannot. Any thrown error resolves to the low tier with WebGL disabled,
 * which routes the visitor to the written version of the film.
 */

import type { DeviceProfile } from '@/store/useSettingsStore';

export interface Capabilities extends DeviceProfile {
  /** Human-readable reason string, surfaced in the diagnostics panel. */
  summary: string;
  renderer: string;
  coarsePointer: boolean;
  cores: number;
  deviceMemory: number | null;
  viewport: { width: number; height: number };
}

const detectWebGL = (): { ok: boolean; renderer: string; version: 1 | 2 } => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { ok: false, renderer: 'no-dom', version: 1 };
  }
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    gl = (canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return { ok: false, renderer: 'unavailable', version: 1 };

  let renderer = 'unknown';
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const value = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      if (typeof value === 'string') renderer = value;
    }
    if (renderer === 'unknown') {
      const value = gl.getParameter(gl.RENDERER);
      if (typeof value === 'string') renderer = value;
    }
  } catch {
    /* extension blocked by privacy settings — 'unknown' is fine */
  }

  const version: 1 | 2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? 2 : 1;

  // Release the probe context immediately; browsers cap simultaneous contexts.
  const lose = gl.getExtension('WEBGL_lose_context');
  lose?.loseContext();
  return { ok: true, renderer, version };
};

/** Renderers that are known to behave poorly with heavy fragment work. */
const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|software|mesa offscreen|angle \(google, vulkan/i;

/**
 * Renderer override from the query string.
 *
 * The automatic probe treats software rasterisers (SwiftShader, llvmpipe) as
 * "no WebGL", which is the right call for a real visitor — software rendering
 * at 60fps is not achievable, and the written version of the film is better
 * than a slideshow. It also means headless CI, where everything is SwiftShader,
 * would never exercise the 3D path.
 *
 * `?renderer=force` opts back in (useful for testing and for unusual drivers),
 * `?renderer=off` forces the written version, `auto` is the default.
 */
const readRendererOverride = (): 'force' | 'off' | 'auto' => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const value = new URLSearchParams(window.location.search).get('renderer');
    return value === 'force' || value === 'off' ? value : 'auto';
  } catch {
    return 'auto';
  }
};

export const probeCapabilities = (): Capabilities => {
  const override = readRendererOverride();
  const { ok, renderer } = detectWebGL();
  const coarsePointer =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  const systemReducedMotion =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const cores =
    typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number'
      ? navigator.hardwareConcurrency
      : 4;

  const deviceMemory =
    typeof navigator !== 'undefined' &&
    typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number'
      ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory as number)
      : null;

  const viewport = {
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  };

  const software = SOFTWARE_RENDERERS.test(renderer);
  const memoryPressure = deviceMemory !== null && deviceMemory <= 4;
  const smallScreen = viewport.width < 820;
  const lowCores = cores <= 4;

  const webglAvailable =
    override === 'off' ? false : override === 'force' ? ok : ok && !software;

  let tier: 0 | 1 | 2 = 2;
  if (!webglAvailable || software) tier = 0;
  else if (memoryPressure || (coarsePointer && lowCores) || (smallScreen && lowCores)) tier = 0;
  else if (coarsePointer || smallScreen || lowCores || viewport.width * viewport.height > 4_200_000) tier = 1;

  const dprCap = tier === 2 ? 2 : tier === 1 ? 1.5 : 1;

  const summary = software
    ? `Software rasteriser (${renderer})`
    : `${renderer} · ${cores} cores${deviceMemory ? ` · ${deviceMemory}GB` : ''}`;

  return {
    tier,
    webgl: webglAvailable,
    systemReducedMotion,
    dprCap,
    summary,
    renderer,
    coarsePointer,
    cores,
    deviceMemory,
    viewport,
  };
};

/** Quality preset → concrete multipliers used by the scenes. */
export interface QualityBudget {
  /** Multiplier applied to every instance/particle count. */
  density: number;
  /** Device pixel ratio ceiling. */
  dpr: number;
  /** Whether the post-processing chain runs at all. */
  post: boolean;
  /** Whether the expensive refraction/bloom passes are enabled. */
  highPost: boolean;
  /** Shadow map size, 0 disables shadows. */
  shadowMap: number;
  /** Maximum corridor ring instances. */
  rings: number;
  /** Dust point budget multiplier. */
  dust: number;
}

const BUDGETS: Record<0 | 1 | 2, QualityBudget> = {
  0: { density: 0.4, dpr: 1, post: false, highPost: false, shadowMap: 0, rings: 26, dust: 0.45 },
  1: { density: 0.72, dpr: 1.5, post: true, highPost: false, shadowMap: 512, rings: 42, dust: 0.75 },
  2: { density: 1, dpr: 2, post: true, highPost: true, shadowMap: 1024, rings: 64, dust: 1 },
};

export const resolveBudget = (
  preset: 'auto' | 'low' | 'medium' | 'high',
  tier: 0 | 1 | 2,
): QualityBudget => {
  const resolved = preset === 'auto' ? tier : preset === 'low' ? 0 : preset === 'medium' ? 1 : 2;
  const budget = BUDGETS[resolved];
  return { ...budget, dpr: Math.min(budget.dpr, 3) };
};
