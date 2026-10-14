/**
 * Particle shaders.
 *
 * Both materials render a `THREE.Points` cloud whose positions are generated
 * once on the CPU from a fixed seed (see `particles/particleField.ts`) and
 * animated entirely on the GPU. Per-frame CPU work is therefore zero, which
 * matters because these clouds run next to an instanced fracture field.
 *
 * Point sprites are square in GL, so the fragment shader does the disc
 * approximation analytically — cheaper and softer than a texture fetch, and it
 * keeps the "no external assets" rule intact.
 */

import { Color, Vector3, type IUniform } from 'three';
import { COMMON_GLSL } from './common';
import { FOG_PARS_GLSL, createFogUniforms, type FogUniforms } from './fog';

export interface ParticleUniforms extends FogUniforms {
  uTime: IUniform<number>;
  uSize: IUniform<number>;
  uColor: IUniform<Color>;
  uAccent: IUniform<Color>;
  uOpacity: IUniform<number>;
  uPixelRatio: IUniform<number>;
  uPointer: IUniform<Vector3>;
  uPointerInfluence: IUniform<number>;
  uPointerRadius: IUniform<number>;
  uDistortion: IUniform<number>;
  uSpeed: IUniform<number>;
  uDrift: IUniform<number>;
  uBounds: IUniform<number>;
}

export const createParticleUniforms = (color = '#cfd6dc', accent = '#ffffff'): ParticleUniforms => ({
  ...createFogUniforms(new Color('#05070a'), 0.018),
  uTime: { value: 0 },
  uSize: { value: 2.2 },
  uColor: { value: new Color(color) },
  uAccent: { value: new Color(accent) },
  uOpacity: { value: 0.9 },
  uPixelRatio: { value: 1 },
  uPointer: { value: new Vector3(0, 0, 0) },
  uPointerInfluence: { value: 1 },
  uPointerRadius: { value: 3.2 },
  uDistortion: { value: 0.4 },
  uSpeed: { value: 1 },
  uDrift: { value: 0.35 },
  uBounds: { value: 40 },
});

/** The vertex stage shared by the ambient dust and the interactive field. */
const PARTICLE_VERTEX_BODY = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;

  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerInfluence;
  uniform float uPointerRadius;
  uniform float uDistortion;
  uniform float uSpeed;
  uniform float uDrift;
  uniform float uBounds;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  // Pointer proximity measured at the *displaced* position, so a particle
  // lights up as it is pushed rather than before. Clamped to 0..1 so the
  // fragment stage can use it as a mix factor.
  float falloffProxy(vec3 pointer, vec3 pos, float radius, float influence) {
    if (influence <= 0.001) return 0.0;
    float d = distance(pos, pointer);
    float falloff = 1.0 - smoothstep(0.0, max(radius, 0.001), d);
    return clamp(falloff * influence * 0.6, 0.0, 1.0);
  }

  void main() {
    float t = uTime * uSpeed;
    vec3 pos = position;

    // Seeded drift: each particle owns a phase, so the cloud never pulses
    // in unison and no two particles share a trajectory.
    float s = aPhase;
    pos.x += sin(t * 0.21 + s * 6.283) * uDrift;
    pos.y += cos(t * 0.17 + s * 4.712) * uDrift * 0.72;
    pos.z += sin(t * 0.13 + s * 3.141) * uDrift * 0.9;

    // Curl-ish warp driven by value noise. This is the "distortion" control:
    // at 0 the field is a clean volume, at 1 it churns.
    if (uDistortion > 0.001) {
      vec3 np = pos * 0.12 + vec3(0.0, t * 0.06, 0.0);
      float n1 = vnoise3(np);
      float n2 = vnoise3(np * 2.7 + 17.3);
      vec3 warp = vec3(n1 - 0.5, n2 - 0.5, vnoise3(np.zxy + 5.1) - 0.5);
      pos += warp * uDistortion * 2.4;
    }

    // Pointer field: particles are pushed radially away from the pointer and
    // swirled slightly, with a smooth falloff so there is no hard boundary.
    if (uPointerInfluence > 0.001) {
      vec3 toPointer = pos - uPointer;
      float dist = length(toPointer);
      float falloff = 1.0 - smoothstep(0.0, uPointerRadius, dist);
      if (falloff > 0.001) {
        vec3 dir = dist > 0.0001 ? toPointer / dist : vec3(0.0, 1.0, 0.0);
        pos += dir * falloff * falloff * uPointerInfluence * 1.5;
        // Tangential component gives the field a swirl rather than a bulge.
        pos += cross(dir, vec3(0.0, 1.0, 0.0)) * falloff * uPointerInfluence * 0.45;
      }
    }

    // Soft containment: wrap the field inside its bounds instead of letting
    // particles drift out of frame when drift is dialled up.
    if (uBounds > 0.001) {
      pos = mod(pos + uBounds, uBounds * 2.0) - uBounds;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewDepth = -mv.z;
    gl_Position = projectionMatrix * mv;

    // Perspective-correct point size. The clamp is deliberately low: a large
    // point sprite is a large quad, and a cloud of them turns into bokeh blobs
    // rather than dust while also destroying fill rate on mobile GPUs.
    float size = uSize * aScale * uPixelRatio * (180.0 / max(vViewDepth, 0.6));
    gl_PointSize = clamp(size, 0.7, 7.5 * uPixelRatio);

    // Fade in the distance and very close to the camera; keeps the field from
    // popping when the scroll-linked camera passes through it.
    vFade = smoothstep(0.4, 2.4, vViewDepth) * (1.0 - smoothstep(38.0, 74.0, vViewDepth));
    vEnergy = falloffProxy(uPointer, pos, uPointerRadius, uPointerInfluence);
    vSeed = aPhase;
  }
`;

/**
 * GLSL cannot share local variables between the displacement branch and the
 * fragment stage, so the "energy" (pointer proximity) term is recomputed from
 * the *displaced* position here instead of threaded through as a varying.
 */
const PARTICLE_VERTEX = /* glsl */ `
  ${COMMON_GLSL}
  ${PARTICLE_VERTEX_BODY}
`;

export const DUST_VERTEX = PARTICLE_VERTEX;
export const FIELD_VERTEX = PARTICLE_VERTEX;

export const DUST_FRAGMENT = /* glsl */ `
  ${COMMON_GLSL}
  ${FOG_PARS_GLSL}

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  void main() {
    // Analytic disc: gl_PointCoord is centred on the sprite.
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float soft = 1.0 - smoothstep(0.04, 0.25, d);

    vec3 tint = mix(uColor, uAccent, vEnergy * 0.7 + vSeed * 0.18);
    float alpha = soft * vFade * uOpacity * (0.35 + vSeed * 0.5);
    vec3 colour = applyFog(tint, vViewDepth);
    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`;

export const FIELD_FRAGMENT = /* glsl */ `
  ${COMMON_GLSL}
  ${FOG_PARS_GLSL}

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;

    float soft = pow(1.0 - smoothstep(0.0, 0.25, d), 1.6);
    // A thin bright ring reads as a lens artefact and gives the field depth.
    float ring = smoothstep(0.16, 0.22, d) * (1.0 - smoothstep(0.22, 0.25, d));

    float energy = clamp(vEnergy, 0.0, 1.0);
    vec3 tint = mix(uColor, uAccent, energy * 0.85);
    float alpha = soft * vFade * uOpacity * (0.28 + vSeed * 0.42) + ring * vFade * energy * 0.55;

    vec3 colour = applyFog(tint * (1.0 + energy * 0.8), vViewDepth);
    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`;
