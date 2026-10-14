/**
 * The Void — ocean surface.
 *
 * A single plane displaced by four summed Gerstner waves. The surface normal is
 * rebuilt analytically from the wave derivatives rather than sampled from a
 * normal map: no texture fetches, no tangents, and the specular highlight stays
 * exactly aligned with the geometry at any tessellation level.
 *
 * Reflection is a procedural approximation instead of a render target: the
 * reflected ray is intersected against an analytic sky dome and against the
 * plane the monolith stands on. At these distances that is visually
 * indistinguishable from a planar reflection and costs a fraction of a
 * millisecond.
 *
 * The plane geometry is pre-rotated into the XZ plane, so the shader works in
 * three's Y-up convention and no rotation is applied per vertex.
 */

import { Color, Vector2, Vector3, type IUniform } from 'three';
import { COMMON_GLSL } from './common';
import { FOG_PARS_GLSL, createFogUniforms, type FogUniforms } from './fog';

export interface OceanUniforms extends FogUniforms {
  uTime: IUniform<number>;
  uDeep: IUniform<Color>;
  uShallow: IUniform<Color>;
  uSkyTop: IUniform<Color>;
  uSkyHorizon: IUniform<Color>;
  uSunDir: IUniform<Vector3>;
  /** World XZ position of the monolith's base centre. */
  uMonolith: IUniform<Vector2>;
  /** Half-width and height of the monolith, in metres. */
  uMonolithSize: IUniform<Vector2>;
  uWaveEnergy: IUniform<number>;
  uSpeed: IUniform<number>;
  uPointer: IUniform<Vector2>;
}

export const createOceanUniforms = (): OceanUniforms => ({
  ...createFogUniforms(new Color('#0a0c10'), 0.0125),
  uTime: { value: 0 },
  uDeep: { value: new Color('#04060a') },
  uShallow: { value: new Color('#10151b') },
  uSkyTop: { value: new Color('#04060a') },
  uSkyHorizon: { value: new Color('#1d232b') },
  uSunDir: { value: new Vector3(-0.42, 0.16, -0.89).normalize() },
  uMonolith: { value: new Vector2(0, -52) },
  uMonolithSize: { value: new Vector2(11, 54) },
  uWaveEnergy: { value: 1 },
  uSpeed: { value: 1 },
  uPointer: { value: new Vector2(0, 0) },
});

export const OCEAN_VERTEX = /* glsl */ `
  ${COMMON_GLSL}

  uniform float uTime;
  uniform float uWaveEnergy;
  uniform float uSpeed;
  uniform vec2 uPointer;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vCrest;
  varying float vViewDepth;

  // dir.xy, steepness, speed multiplier — one entry per wave.
  // Wavelengths are deliberately incommensurate so the surface never tiles.
  const vec4 WAVE_A = vec4( 0.92,  0.39, 0.055, 1.00);
  const vec4 WAVE_B = vec4(-0.42,  0.91, 0.032, 1.31);
  const vec4 WAVE_C = vec4( 0.68, -0.73, 0.019, 1.79);
  const vec4 WAVE_D = vec4(-0.88, -0.47, 0.011, 2.43);

  // Accumulates displacement and the two height-derivative gradients used to
  // rebuild the normal. grad holds d(height)/d(x) and d(height)/d(z).
  vec3 gerstner(vec4 wave, float wavelength, vec2 p, float t, inout vec2 grad) {
    vec2 d = normalize(wave.xy);
    float k = 6.28318530718 / wavelength;
    // Deep-water phase speed: sqrt(g / k). Gives each wavelength its own speed.
    float c = sqrt(9.81 / k);
    float f = k * (dot(d, p) - c * wave.w * t);
    float a = wave.z / k;

    grad += d * (wave.z * cos(f));
    return vec3(d * (a * cos(f)), a * sin(f));
  }

  void main() {
    vec3 pos = position;

    // Radial LOD: displacement is faded out with distance so far vertices do
    // not alias into noise. Together with the exponential fog this keeps the
    // horizon clean at any tessellation level.
    float radial = length(pos.xz);
    float lodFade = 1.0 - smoothstep(110.0, 460.0, radial);

    float t = uTime * uSpeed;
    // The pointer drags a local swell through the surface.
    vec2 drag = uPointer * 2.2;
    vec2 p = pos.xz + drag * (1.0 - lodFade * 0.45);

    vec2 grad = vec2(0.0);
    vec3 disp = vec3(0.0);
    disp += gerstner(WAVE_A, 38.0, p, t, grad);
    disp += gerstner(WAVE_B, 19.0, p, t, grad);
    disp += gerstner(WAVE_C, 9.5,  p, t, grad);
    disp += gerstner(WAVE_D, 4.75, p, t, grad);

    float energy = uWaveEnergy * lodFade;
    pos += disp * energy;

    // Height-field normal: n = normalize(-dh/dx, 1, -dh/dz).
    vNormal = normalize(vec3(-grad.x * energy, 1.0, -grad.y * energy));

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = world.xyz;
    vCrest = clamp(disp.y * 2.2 + 0.5, 0.0, 1.0);

    vec4 mv = viewMatrix * world;
    vViewDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const OCEAN_FRAGMENT = /* glsl */ `
  ${COMMON_GLSL}
  ${FOG_PARS_GLSL}

  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uSunDir;
  uniform vec2 uMonolith;
  uniform vec2 uMonolithSize;
  uniform float uTime;
  uniform float uSpeed;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vCrest;
  varying float vViewDepth;

  // Analytic sky: a horizon glow biased toward the sun azimuth.
  vec3 skyColour(vec3 dir) {
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uSkyHorizon, uSkyTop, pow(h, 0.7));
    float sunAmount = pow(max(dot(normalize(dir), uSunDir), 0.0), 26.0);
    col += vec3(0.32, 0.34, 0.38) * sunAmount * 0.5;
    return col;
  }

  // Silhouette of the monolith, reflected. The monolith is treated as a
  // vertical slab standing on the plane z = uMonolith.y; we intersect the
  // reflected ray with that plane and test the horizontal extent.
  float monolithMask(vec3 origin, vec3 dir) {
    float dz = dir.z;
    if (abs(dz) < 1e-4) return 0.0;
    float t = (uMonolith.y - origin.z) / dz;
    if (t <= 0.0) return 0.0;
    float hitX = origin.x + dir.x * t;
    // Only draw the slab above the horizon: a ray reflected upward should not
    // pick up a "reflection" of something below the waterline.
    float hitY = origin.y + dir.y * t;
    if (hitY < 0.0) return 0.0;
    float d = abs(hitX - uMonolith.x) - uMonolithSize.x * 0.5;
    float vertical = smoothstep(0.0, 6.0, min(hitY, uMonolithSize.y));
    return (1.0 - smoothstep(0.0, 3.2, max(d, 0.0))) * vertical;
  }

  void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    vec3 n = normalize(vNormal);

    // Fine ripple detail layered over the geometric waves: two scrolling
    // noise fields at different scales break the "rubber sheet" look.
    float rippleA = fbm3(vec3(vWorldPosition.xz * 0.24, uTime * uSpeed * 0.13), 3);
    float rippleB = fbm3(vec3(vWorldPosition.zx * 0.21 + 4.7, uTime * uSpeed * 0.10), 3);
    float rippleStrength = 0.34 * (1.0 - smoothstep(60.0, 240.0, length(vWorldPosition.xz - cameraPosition.xz)));
    vec3 rippleNormal = normalize(vec3((rippleA - 0.5) * rippleStrength, 1.0, (rippleB - 0.5) * rippleStrength));
    n = normalize(mix(n, rippleNormal, 0.7));

    vec3 reflected = reflect(viewDir, n);
    reflected.y = abs(reflected.y) * 0.9 + 0.025;

    vec3 reflection = skyColour(reflected);
    float mask = monolithMask(vWorldPosition, reflected);
    reflection = mix(reflection, vec3(0.010, 0.012, 0.016), mask * 0.94);

    float fresnel = pow(clamp(1.0 - dot(-viewDir, n), 0.0, 1.0), 4.4);
    fresnel = mix(0.03, 1.0, fresnel);

    vec3 body = mix(uDeep, uShallow, vCrest * 0.65 + rippleA * 0.35);

    // Blinn-Phong glint, tightly exponentiated so it reads as a distant light
    // source rather than a hotspot on the water.
    vec3 halfVec = normalize(uSunDir - viewDir);
    float ndh = max(dot(n, halfVec), 0.0);
    // Tight glint plus a much fainter wide lobe. The wide lobe is what turns a
    // distant light source into a sheet of whitewash across the water.
    float spec = pow(ndh, 320.0) * 0.7 + pow(ndh, 60.0) * 0.012;

    vec3 colour = mix(body, reflection, fresnel) + vec3(spec);

    // Crest highlight: a thin silver line where the swell breaks.
    colour += vec3(0.055, 0.07, 0.085) * smoothstep(0.9, 1.0, vCrest) * 0.5;

    colour = tonemap(colour);
    colour = applyFog(colour, vViewDepth);

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`;
