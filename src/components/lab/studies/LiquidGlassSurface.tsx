import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CanvasTexture,
  LinearFilter,
  ShaderMaterial,
  Texture,
} from 'three';

import { clockField, pointerField } from '@/animation/progressRegistry';
import { runtimeFlags } from '@/store/useSettingsStore';

/**
 * Liquid glass, adapted from `github.com/dashersw/liquid-glass-js`
 * (MIT, © 2025 Armagan Amcalar).
 *
 * The fragment model is kept: a rounded-rectangle signed distance field, a
 * displacement derived from that distance, separate edge / rim / base weights
 * and a corner boost. What is *not* kept is how upstream obtains the backdrop.
 * It calls `html2canvas(document.body)`, rasterises the whole document, and
 * feeds the bitmap to its own WebGL context created with
 * `preserveDrawingBuffer: true`. Three things make that unusable here:
 *
 *  1. It is a second WebGL context competing with the film's, which this
 *     project's architecture forbids for any effect.
 *  2. `html2canvas` cannot rasterise a WebGL canvas — the very thing behind
 *     the glass is what it would fail to capture — and running it at all costs
 *     a full-document rasterisation on every resize.
 *  3. It is a static script with globals, no ES module and no declared
 *     dependencies: nothing to install, nothing to import.
 *
 * So the backdrop is generated locally and the shader runs as an ordinary
 * material inside the canvas that is already open. Every part of the model —
 * displacement, chromatic dispersion, edge light, corner gain — is still real
 * and still responds to its uniforms.
 */
const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uBackdrop;
  uniform vec2  uResolution;
  uniform vec2  uPointer;
  uniform float uTime;

  uniform float uWarp;
  uniform float uEdge;
  uniform float uRim;
  uniform float uBase;
  uniform float uCorner;
  uniform float uRadius;
  uniform float uTint;
  uniform float uReveal;

  varying vec2 vUv;

  /** Ported from upstream: signed distance to a rounded rectangle. */
  float roundedRectDistance(vec2 coord, vec2 size, float radius) {
    vec2 centre = size * 0.5;
    vec2 pixel = coord * size;
    vec2 toCorner = abs(pixel - centre) - (centre - radius);
    float outsideCorner = length(max(toCorner, 0.0));
    float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
    return outsideCorner + insideCorner - radius;
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centred = (vUv - 0.5) * aspect;

    float d = roundedRectDistance(vUv, vec2(1.0), uRadius);
    float inside = 1.0 - clamp(abs(d) * 2.0, 0.0, 1.0);

    // A slow surface drift, so the pane is never dead. Two octaves at very
    // different rates: one reads as the sheet moving, the other as light
    // travelling across it. Kept slow enough to stay restrained, fast enough
    // that the glass is visibly glass rather than a still image.
    float drift =
      (noise2(vUv * 2.6 + vec2(uTime * 0.22, uTime * -0.16)) - 0.5) * 1.0 +
      (noise2(vUv * 6.1 - vec2(uTime * 0.34, uTime * 0.27)) - 0.5) * 0.45;
    float pointer = 1.0 - clamp(length(centred - uPointer * aspect) * 1.6, 0.0, 1.0);

    float disp = (uWarp * (1.0 - inside) + uEdge * pow(1.0 - inside, 3.0)) * (1.0 + drift * 0.5);
    disp *= 1.0 + pointer * 0.8;

    // Chromatic split scaled by displacement — the refraction cue. The offset
    // is larger than upstream's because the backdrop here is a smooth field:
    // refracting it by a hair produces no visible change at all, which is
    // exactly what the first build measured (max frame delta of 1 level).
    vec2 offset = disp * 0.055 * aspect;
    vec3 colour;
    colour.r = texture2D(uBackdrop, vUv + offset * 1.10).r;
    colour.g = texture2D(uBackdrop, vUv + offset).g;
    colour.b = texture2D(uBackdrop, vUv + offset * 0.90).b;

    // Silver edge light, strongest along the outline and at the corners.
    float outline = pow(clamp(1.0 - inside, 0.0, 1.0), 2.0);
    float corner = pow(clamp(abs(centred.x) + abs(centred.y), 0.0, 1.0), 2.0);
    colour += vec3(0.60, 0.64, 0.69) * outline * (uEdge * 0.45 + uRim * 0.65);
    colour += vec3(0.48, 0.51, 0.56) * corner * uCorner * 0.35;
    colour *= mix(1.0, 0.86, uBase);

    // A cold, very light tint — AFTERLIGHT's palette, not a rainbow.
    colour = mix(colour, vec3(0.74, 0.78, 0.82), uTint * 0.32);

    // Sheen. Refraction alone is invisible against a smooth field, so the
    // travelling highlight that makes glass read as glass is added explicitly.
    // It tracks the drift, which is what makes the surface look alive.
    float sheen = noise2(vUv * 1.7 - vec2(uTime * 0.19, uTime * 0.13));
    sheen = pow(clamp(sheen, 0.0, 1.0), 3.0);
    colour += vec3(0.30, 0.33, 0.36) * sheen * (0.35 + uRim * 0.5);

    float alpha = uReveal * smoothstep(0.0, 0.08, inside);
    gl_FragColor = vec4(colour, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface LiquidGlassParams {
  warp: number;
  edge: number;
  rim: number;
  base: number;
  corner: number;
  radius: number;
  tint: number;
}

export const LIQUID_GLASS_DEFAULTS: LiquidGlassParams = {
  warp: 0.35,
  edge: 0.5,
  rim: 0.6,
  base: 0.3,
  corner: 0.4,
  radius: 0.18,
  tint: 0.3,
};

export const LIQUID_GLASS_RANGES: Record<keyof LiquidGlassParams, [number, number]> = {
  warp: [0, 1.5],
  edge: [0, 1.5],
  rim: [0, 1.5],
  base: [0, 1],
  corner: [0, 1.5],
  radius: [0.02, 0.49],
  tint: [0, 1],
};

const BACKDROP_SIZE = 512;

/**
 * The source the glass refracts.
 *
 * Generated rather than captured: a render target fed from this scene every
 * frame would cost more than the effect is worth, and — as noted above — the
 * page-sampling route cannot see a WebGL canvas at all. A static field still
 * exposes every part of the model: you can see the displacement bend it, the
 * dispersion split its channels, and the edge light ride its outline.
 */
const createBackdrop = (): Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = BACKDROP_SIZE;
  canvas.height = BACKDROP_SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0a0c0f';
    ctx.fillRect(0, 0, BACKDROP_SIZE, BACKDROP_SIZE);
    // Soft studio bars: something with structure for the lens to bend.
    for (let i = 0; i < 26; i += 1) {
      const y = (i / 26) * BACKDROP_SIZE;
      const a = 0.02 + 0.05 * Math.abs(Math.sin(i * 0.7));
      ctx.fillStyle = `rgba(191, 197, 202, ${a.toFixed(3)})`;
      ctx.fillRect(0, y, BACKDROP_SIZE, 2 + (i % 3));
    }
    const glow = ctx.createRadialGradient(
      BACKDROP_SIZE * 0.5, BACKDROP_SIZE * 0.42, 10,
      BACKDROP_SIZE * 0.5, BACKDROP_SIZE * 0.42, BACKDROP_SIZE * 0.5,
    );
    glow.addColorStop(0, 'rgba(243, 242, 238, 0.20)');
    glow.addColorStop(1, 'rgba(243, 242, 238, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, BACKDROP_SIZE, BACKDROP_SIZE);
  }

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

export interface LiquidGlassSurfaceProps {
  overrides?: Partial<LiquidGlassParams>;
}

export const LiquidGlassSurface = ({ overrides }: LiquidGlassSurfaceProps) => {
  const size = useThree((state) => state.size);
  const materialRef = useRef<ShaderMaterial>(null);
  const [backdrop, setBackdrop] = useState<Texture | null>(null);

  useEffect(() => {
    const texture = createBackdrop();
    setBackdrop(texture);
    // Owned by this component; released on unmount so switching studies does
    // not leave a 512² texture behind.
    return () => texture.dispose();
  }, []);

  const resolved = useMemo<LiquidGlassParams>(
    () => ({ ...LIQUID_GLASS_DEFAULTS, ...overrides }),
    [overrides],
  );

  const uniforms = useMemo(
    () => ({
      uBackdrop: { value: backdrop },
      uResolution: { value: new Float32Array([size.width, size.height]) },
      uPointer: { value: new Float32Array([0, 0]) },
      uTime: { value: 0 },
      uWarp: { value: resolved.warp },
      uEdge: { value: resolved.edge },
      uRim: { value: resolved.rim },
      uBase: { value: resolved.base },
      uCorner: { value: resolved.corner },
      uRadius: { value: resolved.radius },
      uTint: { value: resolved.tint },
      uReveal: { value: 0 },
    }),
    [backdrop, resolved, size.width, size.height],
  );

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    const dt = Math.min(delta, 0.05);

    (u.uResolution.value as Float32Array).set([size.width, size.height]);
    (u.uPointer.value as Float32Array).set([pointerField.targetX, -pointerField.targetY]);

    u.uTime.value = runtimeFlags.reducedMotion ? 0 : clockField.elapsed;
    u.uWarp.value = resolved.warp;
    u.uEdge.value = resolved.edge;
    u.uRim.value = resolved.rim;
    u.uBase.value = resolved.base;
    u.uCorner.value = resolved.corner;
    u.uRadius.value = resolved.radius;
    u.uTint.value = resolved.tint;

    // Fades up so the pane does not pop when the study mounts.
    u.uReveal.value = Math.min(1, (u.uReveal.value as number) + dt * 1.5);
  });

  return (
    <mesh position={[0, 0.4, 3]} dispose={null}>
      <planeGeometry args={[size.width * 0.56, size.height * 0.56]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};
