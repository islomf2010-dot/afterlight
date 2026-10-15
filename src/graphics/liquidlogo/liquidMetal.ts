/**
 * Liquid metal wordmark.
 *
 * Adapted from `github.com/collidingScopes/liquid-logo` (MIT, © 2025 Alan Ang).
 * The original is a standalone vanilla-WebGL demo that ships third-party
 * brand logos as its mask; none of those assets are used here. The mask is
 * generated from live text instead — see `createTextMask.ts` — so AFTERLIGHT
 * carries no third-party imagery and the wordmark stays editable.
 *
 * What was kept: the flow-field integration, the edge-detect deflection that
 * bends the flow around the mask's outline, and the iterative tanh-style tone
 * curve that produces the metal banding.
 *
 * What was changed, and why:
 * - Written for three's shader pipeline rather than raw WebGL1. The original
 *   assigns `gl_FragColor` directly, which three ignores under its colour
 *   management; this outputs `gl_FragColor` *and* lets three apply its own
 *   output encoding via the injected chunks.
 * - The original carried several debug multipliers that cancel themselves out
 *   (`sin(t * 0.0 + …)`, `sin(… + time) * 0.00`). They are removed rather than
 *   copied, since preserving them would be preserving dead arithmetic.
 * - Uniform defaults are tuned for AFTERLIGHT's near-black palette. The demo's
 *   defaults are chosen for a white page.
 */

/** Mask shape. The wordmark is the only mask AFTERLIGHT needs. */
export const LIQUID_METAL_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const LIQUID_METAL_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2  uResolution;
  uniform float uTime;

  uniform sampler2D uMask;

  uniform float uSpeed;
  uniform float uIterations;
  uniform float uScale;
  uniform float uDotFactor;
  uniform float uVOffset;
  uniform float uIntensity;
  uniform float uExpFactor;
  uniform vec3  uColorFactors;
  uniform float uColorShift;

  uniform float uMaskScale;
  uniform float uMaskOpacity;
  uniform float uEdgeStrength;
  uniform float uNoiseAmount;

  uniform vec3  uInk;
  uniform vec3  uHighlight;

  varying vec2 vUv;

  // Cheap value noise. The original used 3D simplex here purely to wobble the
  // flow field; at this amplitude a 2D value noise is indistinguishable and
  // costs a quarter of the arithmetic in a full-screen fragment loop.
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /** Sobel-ish edge magnitude over the mask, used to deflect the flow. */
  float maskEdge(vec2 uv) {
    vec2 px = 1.0 / uResolution;
    float c = texture2D(uMask, uv).a;
    float l = texture2D(uMask, uv - vec2(px.x, 0.0)).a;
    float r = texture2D(uMask, uv + vec2(px.x, 0.0)).a;
    float t = texture2D(uMask, uv - vec2(0.0, px.y)).a;
    float b = texture2D(uMask, uv + vec2(0.0, px.y)).a;
    return smoothstep(0.0, 0.25, abs(c - l) + abs(c - r) + abs(c - t) + abs(c - b));
  }

  void main() {
    vec2 frag = vUv * uResolution;
    float time = uTime * uSpeed;

    // Centre the mask and keep its edges crisp.
    vec2 maskUv = (vUv - 0.5) / max(uMaskScale, 0.0001) + 0.5;
    maskUv.y = 1.0 - maskUv.y;

    bool insideBounds = maskUv.x >= 0.0 && maskUv.x <= 1.0 && maskUv.y >= 0.0 && maskUv.y <= 1.0;
    if (!insideBounds) discard;

    float mask = texture2D(uMask, maskUv).a;
    if (mask < 0.08) discard;

    float edge = maskEdge(maskUv) * uEdgeStrength;

    // --- flow field ------------------------------------------------------
    vec2 p = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
    float dotP = dot(p, p);
    float lens = abs(uDotFactor - dotP) * 1.6;

    vec2 v = p * (1.0 - lens) / max(uScale, 0.0001);
    // Bend the flow around the outline rather than letting it shear the mask.
    v += vec2(sin(edge * 10.0), cos(edge * 8.0)) * edge * 1.2;
    v += vec2(vnoise(p * 2.4 + time * 0.15), vnoise(p * 2.4 + time * 0.11) * 0.7) * uNoiseAmount;

    vec4 acc = vec4(0.0);
    int steps = int(clamp(uIterations, 1.0, 24.0));
    for (int i = 0; i < 24; i++) {
      if (i >= steps) break;
      float idx = float(i) + 1.0;
      vec2 offset = cos(v.yx * idx + vec2(0.0, idx) + time) / idx + uVOffset;
      // Deflect harder where the outline is.
      offset *= 1.0 + edge * 1.4;
      v += offset;
      acc += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * uIntensity;
    }

    if (uColorShift > 0.0) {
      acc = acc.wxyz * uColorShift + acc * (1.0 - uColorShift);
    }

    // tanh, expressed the way the original does — as an exp2 ratio.
    vec4 expPy = exp(p.y * vec4(uColorFactors.x, uColorFactors.y, uColorFactors.z, 0.0));
    // vec4() is explicit: a bare scalar is not implicitly widened on every GLSL
    // target three compiles for, and this failed to build on WebGL2.
    vec4 expLx = vec4(exp(-uExpFactor * lens));
    vec4 ratio = expPy * expLx / max(acc, vec4(1e-4));
    vec4 exp2x = exp(2.0 * ratio);
    acc = (exp2x - 1.0) / (exp2x + 1.0);

    // --- tone -----------------------------------------------------------
    // AFTERLIGHT's palette: cold metal in near-darkness. The band is biased
    // low so the wordmark sits *in* the frame rather than punching a white
    // hole through it — at full range the first build washed out the entire
    // page behind it.
    float band = clamp(acc.x, 0.0, 1.0);
    band = pow(band, 1.7);
    vec3 colour = mix(uInk, uHighlight, band);

    // The outline catches the most light, as a bevel would — but bounded, so
    // the rim cannot outrun the body.
    float rim = pow(clamp(edge, 0.0, 1.0), 2.4);
    colour += rim * 0.22;

    float alpha = mask * uMaskOpacity;
    gl_FragColor = vec4(colour, alpha);

    // Let three encode the output for its configured colour space.
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Parameters AFTERLIGHT exposes. Values are tuned, not copied from the demo. */
export interface LiquidMetalParams {
  speed: number;
  iterations: number;
  scale: number;
  dotFactor: number;
  vOffset: number;
  intensity: number;
  expFactor: number;
  maskScale: number;
  maskOpacity: number;
  edgeStrength: number;
  noiseAmount: number;
}

export const LIQUID_METAL_DEFAULTS: LiquidMetalParams = {
  speed: 0.42,
  iterations: 12,
  scale: 2.1,
  dotFactor: 0.34,
  vOffset: 0.012,
  intensity: 0.028,
  expFactor: 0.36,
  maskScale: 0.86,
  maskOpacity: 1,
  edgeStrength: 0.85,
  noiseAmount: 0.05,
};

/** AFTERLIGHT palette, expressed in the 0–1 floats the shader wants. */
const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const LIQUID_METAL_COLOURS = {
  ink: hexToRgb('#050505'),
  highlight: hexToRgb('#BFC5CA'),
} as const;