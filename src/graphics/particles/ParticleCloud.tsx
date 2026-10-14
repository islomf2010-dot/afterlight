import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial, Vector3 } from 'three';

import { createParticleField, type ParticleDistribution } from '@/graphics/particles/particleField';
import {
  DUST_FRAGMENT,
  DUST_VERTEX,
  FIELD_FRAGMENT,
  FIELD_VERTEX,
  createParticleUniforms,
  type ParticleUniforms,
} from '@/graphics/shaders/particles';
import { clockField, pointerField } from '@/animation/progressRegistry';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';

export interface ParticleCloudProps {
  count: number;
  extent: [number, number, number];
  distribution: ParticleDistribution;
  seed: number;
  variant?: 'dust' | 'field';
  color?: string;
  accent?: string;
  size?: number;
  opacity?: number;
  /** Soft containment half-extent; 0 disables wrapping. */
  bounds?: number;
  /** Radius of the pointer's influence sphere, in world units. */
  pointerRadius?: number;
  /** Mirrors the lab's distortion / pointer-influence / speed controls. */
  liveControls?: boolean;
  /** Explicit world-space influence centre (laboratory exhibits). */
  pointerTarget?: Vector3;
  /** Distance from the camera at which the implied pointer point is placed. */
  pointerDistance?: number;
  /** Freezes animation (reduced motion) without hiding the field. */
  still?: boolean;
}

/**
 * GPU-animated point cloud.
 *
 * Positions are generated once per (count, extent, distribution, seed) tuple and
 * uploaded as static attributes; everything after that happens in the vertex
 * shader. Regenerating the buffers on every render is the classic
 * particle-system memory leak, so the field is memoised and explicitly disposed
 * when its structure changes.
 */
export const ParticleCloud = ({
  count,
  extent,
  distribution,
  seed,
  variant = 'dust',
  color = '#c8d0d8',
  accent = '#ffffff',
  size = 2.2,
  opacity = 0.9,
  bounds = 0,
  pointerRadius = 3.2,
  liveControls = false,
  pointerTarget,
  pointerDistance = 8,
  still = false,
}: ParticleCloudProps) => {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => {
    const data = createParticleField({
      count: Math.max(1, Math.floor(count)),
      extent,
      seed,
      distribution,
    });
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(data.positions, 3));
    geo.setAttribute('aScale', new BufferAttribute(data.scales, 1));
    geo.setAttribute('aPhase', new BufferAttribute(data.phases, 1));
    // Authored positions never move on the CPU, so the bounds are exact and
    // three does not need to recompute them from animated vertex positions.
    geo.computeBoundingSphere();
    return geo;
  }, [count, extent, distribution, seed]);

  const uniforms = useMemo<ParticleUniforms>(() => createParticleUniforms(color, accent), []);

  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      uniforms: uniforms as unknown as Record<string, { value: unknown }>,
      vertexShader: variant === 'dust' ? DUST_VERTEX : FIELD_VERTEX,
      fragmentShader: variant === 'dust' ? DUST_FRAGMENT : FIELD_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: AdditiveBlending,
    });
    return mat;
    // `uniforms` is a stable reference; colour and size are pushed imperatively.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniforms, variant]);

  // Imperative prop sync: no re-render, no material rebuild, no allocation.
  const applied = useRef({ color: '', accent: '', size: -1, opacity: -1, bounds: -1, radius: -1 });
  useFrame(() => {
    const u = uniforms;
    const a = applied.current;
    if (a.color !== color) {
      u.uColor.value.set(color);
      a.color = color;
    }
    if (a.accent !== accent) {
      u.uAccent.value.set(accent);
      a.accent = accent;
    }
    if (a.size !== size) {
      u.uSize.value = size;
      a.size = size;
    }
    if (a.opacity !== opacity) {
      u.uOpacity.value = opacity;
      a.opacity = opacity;
    }
    if (a.bounds !== bounds) {
      u.uBounds.value = bounds;
      a.bounds = bounds;
    }
    if (a.radius !== pointerRadius) {
      u.uPointerRadius.value = pointerRadius;
      a.radius = pointerRadius;
    }

    u.uTime.value = clockField.elapsed;
    u.uPixelRatio.value = gl.getPixelRatio();

    // Film exposure: the whole field fades up after ENTER.
    u.uOpacity.value = opacity * runtimeFlags.exposure;

    if (liveControls) {
      u.uDistortion.value = labParams.distortion;
      u.uPointerInfluence.value = labParams.pointerInfluence;
      u.uSpeed.value = still ? 0 : labParams.speed * clockField.running;
    } else {
      u.uSpeed.value = still || runtimeFlags.reducedMotion ? 0 : clockField.speed * clockField.running;
    }

    if (pointerTarget) {
      u.uPointer.value.copy(pointerTarget);
    } else if (pointerField.present) {
      // Place the influence sphere on the plane in front of the camera, in the
      // direction the pointer is pointing on screen.
      scratch
        .set(pointerField.x, pointerField.y, -1)
        .applyQuaternion(camera.quaternion)
        .normalize()
        .multiplyScalar(pointerDistance)
        .add(camera.position);
      u.uPointer.value.lerp(scratch, 0.3);
    } else {
      u.uPointer.value.set(0, 0, -9999); // park it far away when idle
    }
  });

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
};

/** Pre-allocated scratch vector: the frame loop must not allocate. */
const scratch = new Vector3();
