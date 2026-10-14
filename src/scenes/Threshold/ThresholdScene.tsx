import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';

import { PORTAL_FRAGMENT, PORTAL_VERTEX, createPortalUniforms } from '@/graphics/shaders/portal';
import { createCorridorMaterial } from '@/graphics/materials/surfaceMaterials';
import { ParticleCloud } from '@/graphics/particles/ParticleCloud';
import { useCameraRig, type CameraKeyframe } from '@/animation/useCameraRig';
import { clockField, pointerField, progressRegistry } from '@/animation/progressRegistry';
import { damp, saturate, smoothstep, travel, window01 } from '@/utils/math';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';
import type { SceneId } from '@/scenes/sceneManifest';

const SCENE: SceneId = 'threshold';

const FOG_COLOR = '#070809';
const FOG_DENSITY = 0.029;

const RING_SPACING = 13;
const RING_HALF_WIDTH = 9;
const RING_HEIGHT = 26;

/** A straight passage, entered low and left high. The portal is the destination. */
const CAMERA_FRAMES: CameraKeyframe[] = [
  { position: [0, 2.4, 46], lookAt: [0, 3.4, -20], fov: 46 },
  { position: [1.6, 3.2, 12], lookAt: [0, 4.2, -60], fov: 44 },
  { position: [-1.8, 4.6, -28], lookAt: [0, 5.4, -120], fov: 42 },
  { position: [1.2, 6.4, -72], lookAt: [0, 6.8, -190], fov: 38 },
  { position: [0, 7.2, -112], lookAt: [0, 7.2, -260], fov: 34 },
];

/** Imperative state read by the DOM overlay. */
export const thresholdRuntime = {
  /** Distance travelled down the corridor, in metres. */
  depth: 0,
  /** 0→1 portal aperture. */
  aperture: 0,
  /** Damped pointer proximity to the portal, used for the readout. */
  proximity: 0,
};

/**
 * THE THRESHOLD — an impossible corridor.
 *
 * The architecture is one InstancedMesh of repeated frames plus two wall planes,
 * so the entire passage is two draw calls. Depth comes from three sources that
 * reinforce each other: linear perspective, exponential fog, and a per-frame
 * shader that pulls light toward the portal at the far end.
 */
const ThresholdScene = () => {
  const budget = useQualityBudget();

  useCameraRig({
    frames: CAMERA_FRAMES,
    getProgress: () => travel(progressRegistry.value(SCENE)),
    parallax: 1.1,
    parallaxLook: 0.5,
    damping: 3.6,
  });

  return (
    <group>
      <ThresholdLights />
      <CorridorFrames count={budget.rings} />
      <CorridorWalls />
      <Portal distance={-268} />
      <ParticleCloud
        count={Math.round(1500 * budget.dust)}
        extent={[24, 18, 120]}
        distribution="volume"
        seed={0x7a11e5}
        variant="dust"
        color="#8e9aa8"
        accent="#e6edf3"
        size={1.5}
        opacity={0.5}
        bounds={80}
        pointerRadius={12}
        pointerDistance={22}
      />
      <ApertureTracker />
    </group>
  );
};

/**
 * A dim ambient, one key, and two point lights that carry the passage: one at
 * the far end (the destination) and one mid-corridor so the camera never flies
 * through a completely black stretch.
 */
const ThresholdLights = () => (
  <>
    <ambientLight intensity={0.05} color="#39434d" />
    <directionalLight intensity={0.4} color="#93a6b6" position={[6, 18, 20]} />
    <pointLight position={[0, 7, -250]} intensity={1400} distance={260} decay={2} color="#dbe6ef" />
    <pointLight position={[0, 6, -60]} intensity={200} distance={110} decay={2} color="#6f8496" />
  </>
);

/**
 * Repeated architectural frames.
 *
 * Each frame is four boxes merged into one instance (two jambs, a lintel, a
 * sill), so 64 frames cost 64 instances in a single draw call. The frames are
 * recycled along Z as the camera advances: when one passes behind the camera it
 * is moved to the far end, which is why the corridor is effectively infinite
 * without allocating any more geometry.
 */
const CorridorFrames = ({ count }: { count: number }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const patched = useMemo(() => createCorridorMaterial(), []);
  useEffect(() => patched.dispose, [patched]);

  const scratch = useMemo(() => new Object3D(), []);
  const total = Math.max(12, count);
  const positions = useMemo(
    () => Array.from({ length: total }, (_, i) => 30 - i * RING_SPACING),
    [total],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    writeFrame(scratch, mesh, positions, 0);
    mesh.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, total]);

  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Recycle frames that fall behind the camera to the far end of the run.
    let furthest = -Infinity;
    for (let i = 0; i < total; i += 1) {
      const z = positions[i];
      if (z - camera.position.z > 46) {
        positions[i] = furthest - RING_SPACING;
      }
      furthest = Math.max(furthest, positions[i]);
    }

    const p = travel(progressRegistry.value(SCENE));
    const pulse = 0.9 + Math.sin(p * Math.PI) * 0.14;

    for (let i = 0; i < total; i += 1) {
      writeFrame(scratch, mesh, positions, i, pulse);
    }
    mesh.instanceMatrix.needsUpdate = true;

    patched.uniforms.uTime.value = clockField.elapsed;
    patched.uniforms.uRimStrength.value = runtimeFlags.exposure * (0.22 + thresholdRuntime.aperture * 0.4);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, patched.material, total * 4]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
};

/** Writes one architectural frame (4 boxes) starting at instance `base`. */
const writeFrame = (
  scratch: Object3D,
  mesh: InstancedMesh,
  positions: number[],
  index: number,
  scale = 1,
): void => {
  const z = positions[index];
  const w = RING_HALF_WIDTH * scale;
  const h = RING_HEIGHT * scale;
  const thickness = 1.5;

  const put = (slot: number, x: number, y: number, dz: number, sx: number, sy: number, sz: number): void => {
    scratch.position.set(x, y, z + dz);
    scratch.rotation.set(0, 0, 0);
    scratch.scale.set(sx, sy, sz);
    scratch.updateMatrix();
    mesh.setMatrixAt(slot, scratch.matrix);
  };

  const base = index * 4;
  put(base + 0, -w, h * 0.5 - 1, 0, thickness, h, thickness * 1.6); // left jamb
  put(base + 1, w, h * 0.5 - 1, 0, thickness, h, thickness * 1.6); // right jamb
  put(base + 2, 0, h - 1, 0, w * 2 + thickness, thickness, thickness * 1.6); // lintel
  put(base + 3, 0, -1, 0, w * 2 + thickness, thickness * 0.8, thickness * 1.6); // sill
};

/**
 * Two long wall planes. Their material is patched rather than bespoke so they
 * fog exactly like the frames and pick up the same lighting.
 */
const CorridorWalls = () => {
  const patched = useMemo(() => createCorridorMaterial(), []);
  useEffect(() => patched.dispose, [patched]);

  const geometry = useMemo(() => new PlaneGeometry(340, 320, 1, 1), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    patched.uniforms.uTime.value = clockField.elapsed;
    patched.uniforms.uRimStrength.value = runtimeFlags.exposure * 0.16;
  });

  return (
    <group>
      <mesh geometry={geometry} material={patched.material} position={[-RING_HALF_WIDTH - 0.9, 12, -80]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={patched.material} position={[RING_HALF_WIDTH + 0.9, 12, -80]} rotation={[0, -Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={patched.material} position={[0, 24.4, -80]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

/**
 * The aperture at the end of the corridor.
 *
 * Interaction is the point here: the portal opens when the pointer is near it
 * and closes when it is not, and the pointer also drags the lens off-axis. On
 * touch, the same response is driven by the scroll position instead — the
 * corridor "breathes" open as you approach.
 */
const Portal = ({ distance }: { distance: number }) => {
  const uniforms = useMemo(() => {
    const u = createPortalUniforms('#eef4f9', '#7f95a8');
    u.uFogColor.value = new Color(FOG_COLOR);
    u.uFogDensity.value = FOG_DENSITY;
    return u;
  }, []);

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

  useEffect(() => () => material.dispose(), [material]);

  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);

  useFrame((_, delta) => {
    const p = travel(progressRegistry.value(SCENE));
    // Scroll opens the aperture as the camera nears the end of the passage.
    const scrollOpen = smoothstep(saturate((p - 0.55) / 0.45)) * 0.75;
    const pointerOpen = thresholdRuntime.proximity;
    const target = saturate(scrollOpen + pointerOpen * 0.6) * runtimeFlags.exposure;

    thresholdRuntime.aperture = damp(thresholdRuntime.aperture, target, 3, delta);
    uniforms.uOpen.value = thresholdRuntime.aperture;
    uniforms.uTime.value = clockField.elapsed;
    uniforms.uSpeed.value = runtimeFlags.reducedMotion ? 0 : labParams.speed * clockField.running;
    uniforms.uDistortion.value = 0.35 + labParams.distortion * 0.8;
    uniforms.uPointer.value.set(pointerField.x, pointerField.y);
    uniforms.uPointerInfluence.value = labParams.pointerInfluence;
    uniforms.uAspect.value = aspect;
    uniforms.uFogDensity.value = FOG_DENSITY;
  });

  return (
    <group position={[0, 7.4, distance]}>
      <mesh material={material} renderOrder={3}>
        <planeGeometry args={[72, 72]} />
      </mesh>
      <PortalHalo />
    </group>
  );
};

/** A soft additive disc behind the aperture so it glows into the fog. */
const PortalHalo = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uColor: { value: new Color('#8ea3b5') }, uIntensity: { value: 0.4 } },
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
            float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.0);
            gl_FragColor = vec4(uColor, a * uIntensity);
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

  useFrame(() => {
    const breathe = 0.72 + Math.sin(clockField.elapsed * 0.3) * 0.06;
    material.uniforms.uIntensity.value = runtimeFlags.exposure * thresholdRuntime.aperture * breathe;
  });

  return (
    <mesh material={material} scale={[1.6, 1.6, 1]} renderOrder={2}>
      <planeGeometry args={[72, 72]} />
    </mesh>
  );
};

/**
 * Measures how close the camera is to the portal and publishes a damped value.
 * Pointer proximity drives the aperture; camera distance drives the readout.
 */
const ApertureTracker = () => {
  const camera = useThree((s) => s.camera);
  const pointerWorld = useMemo(() => new Vector3(), []);
  const portalPosition = useMemo(() => new Vector3(0, 7.4, -268), []);
  const toPortal = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const p = travel(progressRegistry.value(SCENE));

    // Scroll proximity: the aperture glows up as the camera nears the end.
    const scrollProximity = window01(p, 0.1, 0.14);

    // Pointer proximity: aiming at the portal opens it, on top of the scroll.
    let pointerProximity = 0;
    if (pointerField.present) {
      pointerWorld
        .set(pointerField.x, pointerField.y, -1)
        .applyQuaternion(camera.quaternion)
        .normalize()
        .multiplyScalar(60)
        .add(camera.position);
      pointerProximity = saturate(1 - pointerWorld.distanceTo(portalPosition) / 90);
    }

    thresholdRuntime.proximity = damp(
      thresholdRuntime.proximity,
      Math.max(scrollProximity, pointerProximity),
      2.6,
      delta,
    );

    toPortal.copy(portalPosition).sub(camera.position);
    thresholdRuntime.depth = -toPortal.z;
  });

  return null;
};

export default ThresholdScene;
