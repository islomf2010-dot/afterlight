import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { CameraKeyframe } from '@/animation/useCameraRig';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  InstancedMesh,
  Object3D,
  ShaderMaterial,
  Vector3,
} from 'three';

import { createFractureLayout } from '@/graphics/particles/particleField';
import { useCameraRig } from '@/animation/useCameraRig';
import { createFragmentMaterial } from '@/graphics/materials/surfaceMaterials';
import { ParticleCloud } from '@/graphics/particles/ParticleCloud';
import { clockField, pointerField, progressRegistry } from '@/animation/progressRegistry';
import { damp, saturate, smootherstep, travel } from '@/utils/math';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';
import { cue } from '@/audio/engine';
import type { SceneId } from '@/scenes/sceneManifest';

const SCENE: SceneId = 'fracture';

const STRUCTURE_SIZE: [number, number, number] = [2.6, 5.2, 2.6];
const SCATTER_RADIUS = 26;

/**
 * Imperative state for the Fracture scene.
 *
 * The DOM overlay (buttons, readouts) reads and writes this; the render loop
 * reads it every frame. Keeping it out of React is what allows the whole
 * disintegration to be scrubbed at 60Hz with a button press costing one object
 * mutation rather than a re-render of the canvas tree.
 */
export const fractureRuntime = {
  /** 0 = assembled, 1 = fully dispersed. Eased toward `target`. */
  progress: 0,
  /** Where `progress` is heading. */
  target: 0,
  /** While true, scroll drives the sequence; buttons take over when false. */
  followingScroll: true,
  /** +1 repels fragments, -1 attracts them. */
  pointerMode: 1 as 1 | -1,
  /** Live count of fragments in flight, for the telemetry readout. */
  dispersed: 0,
  /** Bumped on RESET so the scene can re-run its entrance. */
  resetToken: 0,
};

export const resetFracture = (): void => {
  fractureRuntime.target = 0;
  fractureRuntime.followingScroll = true;
  fractureRuntime.pointerMode = 1;
  fractureRuntime.resetToken += 1;
  cue('click');
};

export const setFractureTarget = (value: number, followScroll = false): void => {
  fractureRuntime.target = saturate(value);
  fractureRuntime.followingScroll = followScroll;
  cue(value > 0.5 ? 'fracture' : 'click');
};

export const toggleFracturePointerMode = (): void => {
  fractureRuntime.pointerMode = fractureRuntime.pointerMode === 1 ? -1 : 1;
  cue('click');
};

/**
 * Orbit → rise → withdraw. The structure is small and the fragments travel far,
 * so the camera has to keep widening as the scene disperses, or the moment of
 * maximum disintegration happens outside the frame.
 */
const CAMERA_FRAMES: CameraKeyframe[] = [
  { position: [1, 2.2, 23], lookAt: [0, 1.2, 0], fov: 40 },
  { position: [9, 4.5, 19], lookAt: [0, 1.8, 0], fov: 42 },
  { position: [-8, 7.5, 22], lookAt: [0, 2.6, 0], fov: 44 },
  { position: [2, 12, 30], lookAt: [0, 3.6, 0], fov: 46 },
  { position: [0, 17, 42], lookAt: [0, 4.5, 0], fov: 48 },
];

/**
 * FRACTURE — a structure that comes apart and goes back together.
 *
 * One InstancedMesh, N boxes. Every fragment's rest position, scatter target,
 * spin axis, scale and *breakup delay* are generated once from a fixed seed, so
 * the composition is identical on every load. The single `progress` parameter
 * drives the entire sequence: a fragment starts moving when progress passes its
 * own delay and has fully arrived when progress reaches 1, so the failure
 * visibly travels up the structure rather than firing everywhere at once.
 *
 * The frame loop allocates nothing: one Object3D scratch, one Matrix4, and
 * writes straight into the instance buffer.
 */
const FractureScene = () => {
  const budget = useQualityBudget();
  const count = Math.round(2400 * budget.density);

  useCameraRig({
    frames: CAMERA_FRAMES,
    getProgress: () => travel(progressRegistry.value(SCENE)),
    parallax: 1.4,
    parallaxLook: 0.6,
    damping: 2.8,
  });

  const layout = useMemo(
    () => createFractureLayout({ count, seed: 0x1f2a3b, size: STRUCTURE_SIZE, scatterRadius: SCATTER_RADIUS }),
    [count],
  );

  const patched = useMemo(() => createFragmentMaterial(), []);
  useEffect(() => patched.dispose, [patched]);

  const meshRef = useRef<InstancedMesh>(null);
  const scratchObject = useMemo(() => new Object3D(), []);
  const pointerWorld = useMemo(() => new Vector3(), []);
  const toFragment = useMemo(() => new Vector3(), []);
  const resetSeen = useRef(fractureRuntime.resetToken);

  // Seed the instance buffer before the first paint so the structure appears
  // assembled rather than exploding in from the origin.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i += 1) {
      scratchObject.position.set(
        layout.rest[i * 3],
        layout.rest[i * 3 + 1],
        layout.rest[i * 3 + 2],
      );
      scratchObject.scale.set(
        layout.scales[i * 3],
        layout.scales[i * 3 + 1],
        layout.scales[i * 3 + 2],
      );
      scratchObject.updateMatrix();
      mesh.setMatrixAt(i, scratchObject.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, layout]);

  useFrame(({ camera, pointer }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (fractureRuntime.resetToken !== resetSeen.current) {
      resetSeen.current = fractureRuntime.resetToken;
    }

    // --- Target ------------------------------------------------------------
    const scrollProgress = travel(progressRegistry.value(SCENE));
    const target = fractureRuntime.followingScroll ? scrollProgress : fractureRuntime.target;
    // Reveal: the structure assembles from nothing as the film opens, so the
    // RESET/ENTER sequences start from a recognisable whole.
    const reveal = saturate(runtimeFlags.exposure * 1.4 - 0.2);
    fractureRuntime.progress = damp(fractureRuntime.progress, saturate(target) * reveal, 3.4, delta);
    const p = fractureRuntime.progress;

    // --- Pointer world position -------------------------------------------
    pointerWorld
      .set(pointer.x, pointer.y, -1)
      .applyQuaternion(camera.quaternion)
      .normalize()
      .multiplyScalar(11)
      .add(camera.position);

    const influence = labParams.pointerInfluence * 3.4 * fractureRuntime.pointerMode;
    const radius = 7.5;
    const hasPointer = pointerField.present;

    let dispersed = 0;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const delay = layout.delays[i];

      // Per-fragment window: begins at its own delay and always *completes* at
      // p = 1, so no fragment is left stranded between states. The divisor
      // shrinks for late fragments, which is why the very top of the structure
      // goes all at once — the correct read for a propagating failure.
      const local = saturate((p - delay) / Math.max(1e-3, 1 - delay));
      const e = smootherstep(local);

      if (local > 0.02) dispersed += 1;

      let x = layout.rest[i3] + (layout.scatter[i3] - layout.rest[i3]) * e;
      let y = layout.rest[i3 + 1] + (layout.scatter[i3 + 1] - layout.rest[i3 + 1]) * e;
      let z = layout.rest[i3 + 2] + (layout.scatter[i3 + 2] - layout.rest[i3 + 2]) * e;

      if (hasPointer && influence !== 0) {
        toFragment.set(x - pointerWorld.x, y - pointerWorld.y, z - pointerWorld.z);
        const dist = toFragment.length();
        if (dist < radius) {
          // Quadratic falloff keeps the displacement continuous at the boundary.
          const f = 1 - dist / radius;
          const push = f * f * influence;
          if (dist > 0.0001) toFragment.multiplyScalar(push / dist);
          else toFragment.set(0, push, 0);
          x += toFragment.x;
          y += toFragment.y;
          z += toFragment.z;
        }
      }

      // Idle rotation while intact, then the scattered spin takes over.
      const idle = (1 - e) * 0.004;
      scratchObject.position.set(x, y, z);
      scratchObject.rotation.set(
        layout.spin[i3] * e * 3.4 + Math.sin(clockField.elapsed * 0.4 + layout.phases[i] * 6.28) * idle,
        layout.spin[i3 + 1] * e * 3.4 + Math.cos(clockField.elapsed * 0.33 + layout.phases[i] * 6.28) * idle,
        layout.spin[i3 + 2] * e * 3.4,
      );
      // Fragments shrink slightly as they travel: mass leaving the structure.
      const shrink = 1 - e * 0.42;
      scratchObject.scale.set(
        layout.scales[i3] * shrink,
        layout.scales[i3 + 1] * shrink,
        layout.scales[i3 + 2] * shrink,
      );
      scratchObject.updateMatrix();
      mesh.setMatrixAt(i, scratchObject.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    fractureRuntime.dispersed = dispersed;

    patched.uniforms.uTime.value = clockField.elapsed;
    patched.uniforms.uRimStrength.value = (0.35 + p * 0.9) * runtimeFlags.exposure;
    patched.uniforms.uDetail.value = 0.7 + p * 0.6;
  });

  return (
    <group>
      <FractureLights />
      <instancedMesh
        ref={meshRef}
        args={[undefined, patched.material, count]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <GroundGlow />
      <ParticleCloud
        count={Math.round(1400 * budget.dust)}
        extent={[40, 30, 40]}
        distribution="shell"
        seed={0x0f2ac3}
        variant="dust"
        color="#8fa2b2"
        accent="#dfe8f0"
        size={1.1}
        opacity={0.3}
        bounds={34}
        pointerRadius={9}
        pointerDistance={16}
      />
    </group>
  );
};

/**
 * Three sources, arranged so the fragments always have at least one lit edge:
 * a cold key from above-right, a dim fill from below-left, and a warm point at
 * the core that separates the front faces from the back ones.
 */
const FractureLights = () => (
  <>
    <ambientLight intensity={0.16} color="#3a4a58" />
    <directionalLight intensity={1.5} color="#b6c8d6" position={[14, 22, 18]} />
    <directionalLight intensity={0.6} color="#4f6678" position={[-18, -6, -14]} />
    <pointLight position={[0, 2, 6]} intensity={70} distance={40} decay={2} color="#cbd9e6" />
  </>
);

/**
 * A soft disc under the structure. It gives the fragments something to fall
 * away *from* and catches the bloom, which is what sells the vertical scale.
 */
const GroundGlow = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color('#7d93a6') },
          uIntensity: { value: 0.5 },
        },
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
            float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.6) * uIntensity;
            // A faint concentric ripple keeps the disc from looking like a decal.
            a += pow(clamp(1.0 - d, 0.0, 1.0), 8.0) * uIntensity * 0.35;
            gl_FragColor = vec4(uColor, a * 0.55);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    material.uniforms.uIntensity.value =
      runtimeFlags.exposure * (0.5 + fractureRuntime.progress * 0.55);
  });

  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, 0]} renderOrder={1}>
      <planeGeometry args={[52, 52]} />
    </mesh>
  );
};

export default FractureScene;
