/**
 * Fog model shared by every custom material.
 *
 * `scene.fog` only reaches materials that opt into three's fog chunks, which
 * `ShaderMaterial` does not do by default. Rather than patch every shader with
 * `#include <fog_pars_fragment>`, we implement the same exponential-squared
 * falloff ourselves so custom and standard materials fog identically — the
 * corridor walls (MeshStandardMaterial) and the ocean (ShaderMaterial) must
 * dissolve into the same horizon.
 */

import { Color, type IUniform } from 'three';

export interface FogUniforms {
  uFogColor: IUniform<Color>;
  uFogDensity: IUniform<number>;
}

export const createFogUniforms = (color: Color, density: number): FogUniforms => ({
  uFogColor: { value: color.clone() },
  uFogDensity: { value: density },
});

export const FOG_PARS_GLSL = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;

  // viewDepth is the distance from the camera in metres, matching three's
  // FogExp2 convention of the negated view-space Z axis.
  float fogFactorExp2(float viewDepth) {
    float d = uFogDensity * viewDepth;
    return 1.0 - clamp(exp(-d * d), 0.0, 1.0);
  }

  vec3 applyFog(vec3 color, float viewDepth) {
    return mix(color, uFogColor, fogFactorExp2(viewDepth));
  }
`;
