import { ShaderChunk } from 'three';

/**
 * Compatibility shim for `@shadergradient/react` on three r152+.
 *
 * The package's shipped shaders reference six chunks that three r152 removed
 * or renamed, so every one of its materials fails to link on a modern three:
 *
 *   uv2_pars_vertex, uv2_vertex, uv2_pars_fragment
 *       second-UV set renamed from `uv2` to `uv1`.
 *   encodings_fragment
 *       renamed verbatim to `colorspace_fragment`.
 *   transmissionmap_pars_fragment, transmissionmap_fragment
 *       removed when transmission became a built-in material property.
 *
 * Each is restored with the content it had before the change, so the shaders
 * compile and behave exactly as they did against the three they were written
 * for. The UV and transmission chunks are `USE_*`-guarded and the package never
 * defines those, so they expand to nothing.
 *
 * Deliberately *not* aliased onto the current equivalents: that would declare
 * `varying vec2 vUv` a second time and collide with the shaders' own varying.
 *
 * Idempotent, and a no-op on a three old enough to still carry the chunks.
 */
let applied = false;

export const applyShaderGradientThreeCompat = (): void => {
  if (applied) return;
  applied = true;

  const chunks = ShaderChunk as unknown as Record<string, string>;
  const add = (name: string, source: string): void => {
    if (typeof chunks[name] !== 'string') chunks[name] = source;
  };

  add('uv2_pars_vertex', /* glsl */ `
#ifdef USE_UV2
	varying vec2 vUv2;
#endif
`);
  add('uv2_vertex', /* glsl */ `
#if defined( USE_UV2 )
	vUv2 = uv2;
#endif
`);
  add('uv2_pars_fragment', /* glsl */ `
#ifdef USE_UV2
	varying vec2 vUv2;
#endif
`);

  // The rename was a pure rename: this is the current chunk, verbatim.
  add('encodings_fragment', /* glsl */ `
#include <colorspace_fragment>
`);

  // Transmission left the chunk system entirely; these expand to nothing unless
  // the material asks for transmission, which this package never does.
  add('transmissionmap_pars_fragment', /* glsl */ `
#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
#endif
`);
  add('transmissionmap_fragment', /* glsl */ `
#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
#endif
`);
};