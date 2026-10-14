import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, DoubleSide, ShaderMaterial } from 'three';

import { PORTAL_FRAGMENT, PORTAL_VERTEX, createPortalUniforms } from '@/graphics/shaders/portal';
import { clockField, pointerField } from '@/animation/progressRegistry';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';
import { damp, saturate } from '@/utils/math';

export interface PortalExhibitProps {
  size?: number;
  /** Wire the aperture to the shared laboratory parameters. */
  live?: boolean;
  /** Interaction mode: `proximity` opens with the pointer, `pulse` cycles. */
  mode?: 'proximity' | 'pulse';
}

/**
 * STUDY III — REFRACTIVE APERTURE.
 *
 * A lens that refracts a procedurally generated field: polar interference
 * rings, a domain-warped core and a chromatic rim. It is deliberately *not* a
 * render-target refraction — this reads as glass at a fraction of the cost and
 * still looks composed when fully closed, which a screen-space refraction does
 * not.
 *
 * Interaction: the pointer drags the aperture off-axis and opens it; the
 * `pulse` mode opens and closes on its own for visitors who never move a
 * pointer (touch, keyboard-only).
 */
export const PortalExhibit = ({
  size = 17,
  live = true,
  mode = 'proximity',
}: PortalExhibitProps) => {
  const viewport = useThree((s) => s.size);
  const aspect = viewport.width / Math.max(1, viewport.height);
  const openness = useRef(0.6);

  const uniforms = useMemo(() => {
    const u = createPortalUniforms('#eef4f9', '#7f95a8');
    u.uAspect.value = aspect;
    return u;
  }, [aspect]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: uniforms as unknown as Record<string, { value: unknown }>,
        vertexShader: PORTAL_VERTEX,
        fragmentShader: PORTAL_FRAGMENT,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
      }),
    [uniforms],
  );

  const halo = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uColor: { value: new Color('#7f95a8') }, uIntensity: { value: 0.4 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            gl_FragColor = vec4(uColor, pow(clamp(1.0 - d, 0.0, 1.0), 2.8) * uIntensity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: BackSide,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => halo.dispose(), [halo]);

  useFrame((_, delta) => {
    const pointerActive = pointerField.present;
    const influence = live ? labParams.pointerInfluence : 1;
    const pointerStrength = pointerActive
      ? saturate(1 - Math.hypot(pointerField.x, pointerField.y) / 1.5) * influence
      : 0;

    const pulseTarget =
      mode === 'pulse' ? 0.5 + Math.sin(clockField.elapsed * 0.42) * 0.42 : pointerStrength;

    openness.current = damp(openness.current, pulseTarget, 2.4, delta);
    uniforms.uOpen.value = saturate(openness.current) * runtimeFlags.exposure;
    uniforms.uTime.value = clockField.elapsed;
    uniforms.uSpeed.value = runtimeFlags.reducedMotion ? 0 : labParams.speed * clockField.running;
    uniforms.uDistortion.value = 0.3 + (live ? labParams.distortion : 0.5) * 0.9;
    uniforms.uPointer.value.set(pointerActive ? pointerField.x : 0, pointerActive ? pointerField.y : 0);
    uniforms.uPointerInfluence.value = influence;
    uniforms.uAspect.value = aspect;
    halo.uniforms.uIntensity.value = 0.5 * uniforms.uOpen.value;
  });

  return (
    <group>
      <mesh material={material} renderOrder={3}>
        <planeGeometry args={[size, size]} />
      </mesh>
      <mesh material={halo} scale={1.7} renderOrder={2}>
        <planeGeometry args={[size, size]} />
      </mesh>
      <ambientLight intensity={0.09} color="#414e5a" />
      <pointLight position={[0, 0, 3]} intensity={9} distance={18} decay={2} color="#d9e4ed" />
    </group>
  );
};
