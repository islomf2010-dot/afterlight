/**
 * Portal surface — used for the aperture at the end of the Threshold corridor
 * and for the "portal" study in the laboratory.
 *
 * Rather than a render-target refraction (expensive, and visually noisy at
 * this scale) the aperture refracts a *procedurally generated* field: polar
 * interference rings, a domain-warped core, and a chromatic edge. It reads as
 * a refractive lens, costs one fullscreen quad, and — crucially — still looks
 * deliberate when the aperture is closed to nothing.
 */

import { Color, Vector2, type IUniform } from 'three';
import { COMMON_GLSL, SIMPLEX_3D } from './common';
import { FOG_PARS_GLSL, createFogUniforms, type FogUniforms } from './fog';

export interface PortalUniforms extends FogUniforms {
  uTime: IUniform<number>;
  uOpen: IUniform<number>;
  uDistortion: IUniform<number>;
  uPointer: IUniform<Vector2>;
  uPointerInfluence: IUniform<number>;
  uSpeed: IUniform<number>;
  uCore: IUniform<Color>;
  uRim: IUniform<Color>;
  uAspect: IUniform<number>;
  uSeed: IUniform<number>;
}

export const createPortalUniforms = (core = '#e8eef4', rim = '#8ea3b5'): PortalUniforms => ({
  ...createFogUniforms(new Color('#05070a'), 0.02),
  uTime: { value: 0 },
  uOpen: { value: 1 },
  uDistortion: { value: 0.5 },
  uPointer: { value: new Vector2(0, 0) },
  uPointerInfluence: { value: 1 },
  uSpeed: { value: 1 },
  uCore: { value: new Color(core) },
  uRim: { value: new Color(rim) },
  uAspect: { value: 1 },
  uSeed: { value: 3.7 },
});

export const PORTAL_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PORTAL_FRAGMENT = /* glsl */ `
  ${COMMON_GLSL}
  ${SIMPLEX_3D}
  ${FOG_PARS_GLSL}

  uniform float uTime;
  uniform float uOpen;
  uniform float uDistortion;
  uniform vec2 uPointer;
  uniform float uPointerInfluence;
  uniform float uSpeed;
  uniform vec3 uCore;
  uniform vec3 uRim;
  uniform float uAspect;
  uniform float uSeed;

  varying vec2 vUv;

  void main() {
    float t = uTime * uSpeed;

    // Aspect-corrected centred coordinates → a circular aperture on any screen.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    // The pointer drags the aperture centre; this is the interaction that makes
    // the portal feel like an object rather than a decal.
    vec2 pointerOffset = uPointer * uPointerInfluence * 0.18;
    p -= pointerOffset;

    float r = length(p);
    float angle = atan(p.y, p.x);

    // Aperture radius: closed state is a hairline, open state is a disc that
    // nearly fills the quad. The rim is the visible "glass" edge.
    float aperture = mix(0.04, 0.46, uOpen);
    float rimWidth = mix(0.02, 0.055, uOpen);
    float disc = smoothstep(aperture, aperture - rimWidth, r);

    // --- Refracted interior -------------------------------------------------
    // Domain-warped polar coordinates. warping is what sells "looking through
    // something" instead of "looking at a disc".
    float warp = uDistortion;
    vec2 q = vec2(angle / 3.14159265 + 0.5, r / max(aperture, 0.001));
    q += vec2(snoise(vec3(q * 3.0, t * 0.35 + uSeed)), snoise(vec3(q * 3.0 + 19.0, t * 0.28))) * warp * 0.35;

    float rings = sin(q.y * 26.0 - t * 1.6 + snoise(vec3(q * 2.0, t * 0.2)) * 4.0) * 0.5 + 0.5;
    rings = pow(rings, mix(6.0, 1.6, warp));

    float swirl = snoise(vec3(q * 4.5, t * 0.45)) * 0.5 + 0.5;

    // Chromatic separation grows toward the rim — the lens edge bends light most.
    float chroma = smoothstep(0.0, aperture, r) * 0.08 * (0.3 + warp);
    float bandR = sin((q.y + chroma) * 26.0 - t * 1.6) * 0.5 + 0.5;
    float bandB = sin((q.y - chroma) * 26.0 - t * 1.6) * 0.5 + 0.5;

    vec3 interior = vec3(rings * 0.55 + swirl * 0.35);
    interior.r *= mix(1.0, bandR, chroma * 6.0);
    interior.b *= mix(1.0, bandB, chroma * 6.0);
    interior *= mix(0.35, 1.0, smoothstep(aperture, 0.0, r));

    // Core: a soft white-hot centre with a hard falloff, only present when open.
    float core = pow(clamp(1.0 - r / max(aperture, 0.001), 0.0, 1.0), 3.4);
    vec3 colour = uCore * interior * 0.9 + uCore * core * (0.55 + uOpen * 0.5);

    // --- Rim ----------------------------------------------------------------
    float rim = smoothstep(aperture - rimWidth * 1.6, aperture, r) * (1.0 - smoothstep(aperture, aperture + rimWidth * 0.8, r));
    colour += uRim * rim * (0.9 + 0.6 * sin(t * 1.1 + angle * 3.0));

    // Outer bloom halo so the aperture glows into the fog around it.
    float halo = exp(-pow(max(r - aperture, 0.0) * 9.0, 1.4)) * 0.35;
    colour += uRim * halo * uOpen;

    float alpha = clamp(disc * (0.55 + core * 0.45) + rim + halo * 0.6, 0.0, 1.0);
    colour = tonemap(colour * 1.1);
    colour = applyFog(colour, 12.0);

    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`;

/** The distortion study (`/lab/shaders`) — a warped projection of the film. */
export const DISTORTION_FRAGMENT = /* glsl */ `
  ${COMMON_GLSL}
  ${SIMPLEX_3D}
  ${FOG_PARS_GLSL}

  uniform float uTime;
  uniform float uDistortion;
  uniform float uSpeed;
  uniform vec2 uPointer;
  uniform float uPointerInfluence;
  uniform float uAspect;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  /** 0 disables the triple-sample chromatic pass on weak devices. */
  uniform float uAberration;

  varying vec2 vUv;

  // The "source image" is generated, not sampled: a horizon, a monolith
  // silhouette and a star field, i.e. the film's own vocabulary.
  vec3 sourceImage(vec2 uv, float t) {
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
    vec3 col = mix(uPaper * 0.55, uInk, smoothstep(0.42, -0.3, p.y));

    // Monolith: a slab standing on the horizon line.
    vec2 mono = vec2(p.x - 0.06 * sin(t * 0.2), p.y + 0.06);
    float slab = (1.0 - smoothstep(0.055, 0.075, abs(mono.x))) * step(-0.32, mono.y) * step(mono.y, 0.06);
    col = mix(col, uInk * 0.35, slab);

    // Horizon line + its reflection.
    float horizon = exp(-pow(abs(p.y + 0.06) * 42.0, 1.3));
    col += uPaper * horizon * 0.16;
    float mirror = step(p.y, -0.06) * exp(-pow(abs(p.y + 0.06) * 18.0, 1.2)) * 0.05;
    col += uPaper * mirror;

    // Sparse star field, deterministic per cell.
    vec2 cell = floor(p * 42.0);
    float star = step(0.995, hash21(cell)) * (0.5 + 0.5 * sin(t * 2.0 + hash21(cell + 3.7) * 30.0));
    col += uPaper * star * 0.28 * smoothstep(0.0, 0.4, p.y);

    return col;
  }

  void main() {
    float t = uTime * uSpeed;
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    // Two-stage domain warp: the classic IQ "water ripple" formulation. Each
    // stage feeds the next, which is what produces the folded, glassy look.
    float k = 0.55 + uDistortion * 5.5;
    vec2 q = vec2(
      snoise(vec3(p * 1.4, t * 0.3)),
      snoise(vec3(p * 1.4 + 5.2, t * 0.26))
    );
    vec2 r2 = vec2(
      snoise(vec3(p * 1.9 + q * k + 1.7, t * 0.34)),
      snoise(vec3(p * 1.9 + q * k + 9.2, t * 0.28))
    );

    // Pointer applies a local lens: a radial pull toward the cursor.
    vec2 toPointer = p - uPointer * vec2(uAspect, 1.0) * 0.5;
    float pd = length(toPointer);
    vec2 pull = (pd > 0.0001 ? toPointer / pd : vec2(0.0)) *
                (1.0 - smoothstep(0.0, 0.45, pd)) * uPointerInfluence * uDistortion * 0.32;

    vec2 warped = p + (r2 * k * 0.16 + pull);

    // Chromatic aberration scales with warp strength and radial distance.
    // On the low tier uAberration is 0 and the single-sample path is taken —
    // a uniform branch, so the whole warp stays coherent.
    float ab = (0.004 + uDistortion * 0.03) * smoothstep(0.0, 0.7, length(p));
    vec3 col;
    if (uAberration > 0.0005) {
      col = vec3(
        sourceImage(warped + ab, t).r,
        sourceImage(warped, t).g,
        sourceImage(warped - ab, t).b
      );
    } else {
      vec3 single = sourceImage(warped, t);
      col = single;
    }

    // Scanline + vignette keeps it inside the film's visual language.
    col *= 0.92 + 0.08 * sin(vUv.y * 900.0);
    float vignette = 1.0 - smoothstep(0.35, 1.05, length(p) * 1.25);
    col *= mix(0.25, 1.0, vignette);

    col = tonemap(col);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export const DISTORTION_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
