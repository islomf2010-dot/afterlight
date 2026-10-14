/**
 * Surface materials built by patching three's standard material.
 *
 * Rather than hand-writing a full PBR shader (and losing shadows, fog, tone
 * mapping and the renderer's colour management for free), these inject a small
 * amount of procedural detail into `MeshStandardMaterial` via
 * `onBeforeCompile`. The patch points are chosen so the injected code runs
 * after three has set up its own varyings:
 *
 *   vertex   — after <begin_vertex>   (objectNormal already exists)
 *   fragment — after <map_fragment>    (diffuseColor exists)
 *            — after <emissivemap_fragment> (normal exists, vViewPosition exists)
 *
 * Only the hash + value-noise chunk is injected: the full common bundle carries
 * a `tonemap()` helper that would sit next to three's own tone-mapping include
 * and is not needed here.
 */

import { Color, MeshStandardMaterial, type IUniform } from 'three';
import { HASH_NOISE, VALUE_NOISE } from '@/graphics/shaders/common';

export interface PatchedMaterial {
  material: MeshStandardMaterial;
  uniforms: {
    uDetail: IUniform<number>;
    uRimColor: IUniform<Color>;
    uRimStrength: IUniform<number>;
    uTime: IUniform<number>;
  };
  dispose: () => void;
}

const VERTEX_PARS = /* glsl */ `
  varying vec3 vAlWorld;
  varying vec3 vAlObjectNormal;
`;

const VERTEX_MAIN = /* glsl */ `
  vAlWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vAlObjectNormal = normalize(objectNormal);
`;

const FRAGMENT_PARS = /* glsl */ `
  ${HASH_NOISE}
  ${VALUE_NOISE}

  uniform float uDetail;
  uniform vec3 uRimColor;
  uniform float uRimStrength;
  uniform float uTime;

  varying vec3 vAlWorld;
  varying vec3 vAlObjectNormal;
`;

const createPatched = (
  base: MeshStandardMaterial,
  cacheKey: string,
  diffuseBody: string,
  emissiveBody?: string,
): PatchedMaterial => {
  const uniforms = {
    uDetail: { value: 1 },
    uRimColor: { value: new Color('#cfd8e0') },
    uRimStrength: { value: 0.35 },
    uTime: { value: 0 },
  };

  base.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_PARS}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERTEX_MAIN}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_PARS}`)
      .replace('#include <map_fragment>', `#include <map_fragment>\n${diffuseBody}`);
    if (emissiveBody) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>\n${emissiveBody}`,
      );
    }
  };
  // Without a stable cache key three would reuse a program compiled for a
  // different patch when two patched materials share the same base type.
  base.customProgramCacheKey = () => cacheKey;

  return {
    material: base,
    uniforms,
    dispose: () => base.dispose(),
  };
};

/**
 * The monolith: near-black stone with vertical striations, a faint mineral
 * mottle, and a cold rim light. The striations follow the world Y axis so they
 * stay vertical no matter how the slab is oriented.
 */
export const createMonolithMaterial = (): PatchedMaterial => {
  // Not pure black: a black albedo can only ever be described by its
  // silhouette, which reads as an outline drawing. A dark grey albedo lets the
  // key light describe the faces, which is what makes it a solid.
  const base = new MeshStandardMaterial({
    color: new Color('#252c34'),
    roughness: 0.62,
    metalness: 0.18,
    emissive: new Color('#05070a'),
    emissiveIntensity: 1,
  });

  const diffuseBody = /* glsl */ `
    // Vertical striations: noise stretched 14× along Y reads as sediment layers.
    float strata = fbm3(vec3(vAlWorld.x * 0.42, vAlWorld.y * 0.035, vAlWorld.z * 0.42), 4);
    float fine = vnoise3(vAlWorld * 2.4);
    float band = smoothstep(0.34, 0.66, strata);
    diffuseColor.rgb *= mix(0.72, 1.24, band) * uDetail;
    diffuseColor.rgb += vec3(0.012, 0.014, 0.017) * fine * uDetail;

    // The slab is darker toward its base, as if wet.
    float heightFade = smoothstep(-2.0, 34.0, vAlWorld.y);
    diffuseColor.rgb *= mix(0.62, 1.0, heightFade);
  `;

  // A low exponent spreads the rim into a gradient. A high one collapses it
  // onto the exact silhouette, which draws a hard outline around a box and
  // makes it read as a wireframe rather than as a lit surface.
  const emissiveBody = /* glsl */ `
    float alFacing = abs(dot(normalize(normal), normalize(vViewPosition)));
    float alRim = pow(1.0 - alFacing, 1.9);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `;

  const patched = createPatched(base, 'afterlight-monolith-v1', diffuseBody, emissiveBody);
  patched.uniforms.uRimStrength.value = 0.5;
  return patched;
};

/**
 * Corridor walls: darker, colder, with a slow horizontal scan so the passage
 * feels powered rather than lit by accident.
 */
export const createCorridorMaterial = (): PatchedMaterial => {
  const base = new MeshStandardMaterial({
    color: new Color('#0a0c0f'),
    roughness: 0.74,
    metalness: 0.1,
  });

  const diffuseBody = /* glsl */ `
    float panel = smoothstep(0.02, 0.0, abs(fract(vAlWorld.z * 0.22) - 0.5) - 0.48);
    float grain = vnoise3(vAlWorld * 1.7);
    diffuseColor.rgb *= mix(0.78, 1.1, grain) * uDetail;
    diffuseColor.rgb *= 1.0 - panel * 0.35;

    // A single travelling band of extra light, very low contrast.
    float scan = exp(-pow((fract(uTime * 0.04) * 220.0 - vAlWorld.z) * 0.035, 2.0));
    diffuseColor.rgb += vec3(0.02, 0.024, 0.03) * scan;
  `;

  const emissiveBody = /* glsl */ `
    float alRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 4.2);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `;

  const patched = createPatched(base, 'afterlight-corridor-v1', diffuseBody, emissiveBody);
  patched.uniforms.uRimStrength.value = 0.28;
  return patched;
};

/**
 * Fracture fragments: light-catching slivers with a per-instance value shift so
 * the assembled structure has visible internal structure instead of reading as
 * one flat slab.
 */
export const createFragmentMaterial = (): PatchedMaterial => {
  const base = new MeshStandardMaterial({
    color: new Color('#5c6773'),
    roughness: 0.38,
    metalness: 0.46,
  });

  const diffuseBody = /* glsl */ `
    // Per-facet value shift: without it a thousand small boxes read as one flat
    // silhouette instead of a structure made of pieces.
    float facet = vnoise3(vAlObjectNormal * 6.0 + vAlWorld * 0.35);
    diffuseColor.rgb *= mix(0.52, 1.4, facet) * uDetail;
  `;

  const emissiveBody = /* glsl */ `
    float alRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.6);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `;

  const patched = createPatched(base, 'afterlight-fragment-v1', diffuseBody, emissiveBody);
  patched.uniforms.uRimStrength.value = 0.9;
  return patched;
};
