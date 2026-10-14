import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  Group,
  PlaneGeometry,
  ShaderMaterial,
  type DirectionalLight,
} from 'three';

import { OCEAN_FRAGMENT, OCEAN_VERTEX, createOceanUniforms } from '@/graphics/shaders/ocean';
import { createMonolithMaterial } from '@/graphics/materials/surfaceMaterials';
import { ParticleCloud } from '@/graphics/particles/ParticleCloud';
import { useCameraRig, type CameraKeyframe } from '@/animation/useCameraRig';
import { clockField, pointerField, progressRegistry } from '@/animation/progressRegistry';
import { damp, saturate, smoothstep, travel } from '@/utils/math';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';
import type { SceneId } from '@/scenes/sceneManifest';

/** Non-reactive state the DOM HUD reads for the focal-point readout. */
export const voidRuntime = {
  /** Damped 0→1 pointer proximity to the monolith. */
  focus: 0,
  hit: false,
};

const SCENE: SceneId = 'void';

/** Must match SceneAtmosphere so the custom water fogs exactly like the slab. */
const FOG_COLOR = '#080a0d';
const FOG_DENSITY = 0.0135;

const MONOLITH_POSITION: [number, number, number] = [0, 0, -52];
const MONOLITH_SIZE: [number, number, number] = [11, 54, 11];

/**
 * Establish → approach → pass → rise. The monolith never moves; we do.
 *
 * The first frame is deliberately far back and narrow: a 54m slab read from
 * 260m occupies a third of the frame height, which is what sells the scale.
 * Closing in too early turns a monument into a wall.
 */
const CAMERA_FRAMES: CameraKeyframe[] = [
  { position: [12, 13, 212], lookAt: [0, 24, -52], fov: 33 },
  { position: [-16, 16, 132], lookAt: [0, 25, -52], fov: 35 },
  { position: [9, 20, 62], lookAt: [0, 26, -52], fov: 39 },
  { position: [15, 31, 2], lookAt: [0, 30, -52], fov: 44 },
  { position: [0, 46, -32], lookAt: [0, 38, -52], fov: 50 },
];

/**
 * THE VOID — a monolith above an endless sea.
 *
 * Entirely procedural: the sea is a displaced plane with an analytically
 * reconstructed normal, the slab is a patched standard material, the dust is a
 * seeded point cloud, and the scene is lit by one dim key plus a single warm
 * point at the monolith's base.
 */
const VoidScene = () => {
  const budget = useQualityBudget();

  useCameraRig({
    frames: CAMERA_FRAMES,
    getProgress: () => travel(progressRegistry.value(SCENE)),
    parallax: 1.6,
    parallaxLook: 0.9,
    damping: 3.1,
  });

  const segments = budget.density > 0.85 ? 128 : budget.density > 0.55 ? 96 : 56;
  const dustCount = Math.round(1800 * budget.dust);

  return (
    <group>
      <VoidLights />
      <Monolith />
      <Ocean segments={segments} />
      <ParticleCloud
        count={dustCount}
        extent={[150, 44, 170]}
        distribution="column"
        seed={0x5eed10}
        variant="dust"
        color="#9fb0bd"
        accent="#ffffff"
        size={1.1}
        opacity={0.34}
        bounds={100}
        pointerRadius={16}
        pointerDistance={38}
      />
      <FocalPointTracker />
    </group>
  );
};

/** Two lights, no more. The scene is defined mostly by what is *not* lit. */
const VoidLights = () => {
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);

  useFrame(() => {
    // A very slow key drift keeps the specular on the water from being static.
    const t = clockField.elapsed;
    if (key.current) key.current.position.set(-40 + Math.sin(t * 0.05) * 6, 46, 30);
    if (rim.current) rim.current.position.set(38, 18, -80 + Math.cos(t * 0.037) * 8);
  });

  return (
    <>
      <ambientLight intensity={0.1} color="#2c3944" />
      <directionalLight ref={key} intensity={0.85} color="#8fa8bd" position={[-40, 46, 30]} />
      <directionalLight ref={rim} intensity={0.34} color="#43586b" position={[38, 18, -80]} />
      <pointLight position={[0, 3, -46]} intensity={42} distance={76} decay={2} color="#c8d6e2" />
    </>
  );
};

/**
 * The monolith.
 *
 * The pointer acts as a searchlight: a ray cast against the slab raises the rim
 * emission and releases a slow pulse that travels up the structure. That is the
 * scene's single interactive focal point.
 */
const Monolith = () => {
  const groupRef = useRef<Group>(null);
  const patched = useMemo(() => createMonolithMaterial(), []);
  useEffect(() => patched.dispose, [patched]);

  useFrame(() => {
    const p = travel(progressRegistry.value(SCENE));
    // Resolves out of the dark as the film opens.
    const reveal = smoothstep(saturate(p * 6)) * runtimeFlags.exposure;
    const proximity = voidRuntime.focus;

    patched.uniforms.uTime.value = clockField.elapsed;
    // The rim is the only thing separating a black slab from a black sky.
    // Kept very low. A strong rim on a box draws a hard neon outline along
    // every edge — the exact "sci-fi UI" look the art direction avoids. The
    // slab should be described by its lit faces and the glow, not its outline.
    patched.uniforms.uRimStrength.value = (0.12 + proximity * 0.85) * reveal;
    patched.uniforms.uDetail.value = 0.85 + p * 0.35;

    if (groupRef.current) {
      // A 0.4% breathing scale: enough to feel alive, small enough to read as
      // atmosphere rather than animation.
      const breath = 1 + Math.sin(clockField.elapsed * 0.22) * 0.004;
      groupRef.current.scale.set(breath, breath, breath);
      groupRef.current.position.y = Math.sin(clockField.elapsed * 0.09) * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={MONOLITH_POSITION}>
      <mesh material={patched.material} position={[0, MONOLITH_SIZE[1] / 2 - 4, 0]}>
        <boxGeometry args={MONOLITH_SIZE} />
      </mesh>
      <MonolithGlow />
    </group>
  );
};

/**
 * A back-facing shell around the slab carrying an additive vertical gradient.
 * Cheap volumetrics: it reads as light bleeding off the edges into the fog,
 * which is what stops a dark box from looking like a dark box.
 */
const MonolithGlow = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color('#8ea7bd') },
          uIntensity: { value: 0.5 },
          uPulse: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vLocal;
          varying float vViewDepth;
          void main() {
            vLocal = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vViewDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uPulse;
          varying vec3 vLocal;
          varying float vViewDepth;
          void main() {
            // Fade toward the top of the slab; a soft band travels up it.
            float up = 1.0 - smoothstep(-4.0, 52.0, vLocal.y + 4.0);
            float band = exp(-pow((vLocal.y - uPulse * 56.0) * 0.14, 2.0));
            float body = up * (0.35 + band * 0.8);
            // Kept very low: this is light bleeding off an edge, not a lamp.
            float a = body * uIntensity * 0.115;
            a *= 1.0 - smoothstep(70.0, 220.0, vViewDepth);
            gl_FragColor = vec4(uColor * (1.0 + band), a);
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
    material.uniforms.uTime.value = clockField.elapsed;
    material.uniforms.uIntensity.value = runtimeFlags.exposure * (0.5 + voidRuntime.focus * 1.2);
    material.uniforms.uPulse.value = (clockField.elapsed * 0.08) % 1;
  });

  return (
    <mesh material={material} position={[0, MONOLITH_SIZE[1] / 2 - 4, 0]} scale={[1.3, 1.1, 1.3]}>
      <boxGeometry args={MONOLITH_SIZE} />
    </mesh>
  );
};

/** The sea. Pre-rotated into XZ so the shader works in three's Y-up space. */
const Ocean = ({ segments }: { segments: number }) => {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(1800, 1800, segments, segments);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [segments]);

  const uniforms = useMemo(() => {
    const u = createOceanUniforms();
    u.uFogColor.value = new Color(FOG_COLOR);
    u.uFogDensity.value = FOG_DENSITY;
    u.uMonolith.value.set(MONOLITH_POSITION[0], MONOLITH_POSITION[2]);
    u.uMonolithSize.value.set(MONOLITH_SIZE[0], MONOLITH_SIZE[1]);
    return u;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: uniforms as unknown as Record<string, { value: unknown }>,
        vertexShader: OCEAN_VERTEX,
        fragmentShader: OCEAN_FRAGMENT,
        side: DoubleSide,
      }),
    [uniforms],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    uniforms.uTime.value = clockField.elapsed;
    uniforms.uSpeed.value = runtimeFlags.reducedMotion ? 0 : labParams.speed * clockField.running;
    uniforms.uPointer.value.set(pointerField.x, pointerField.y);
    // Wave energy tracks the lab's distortion control, so the laboratory and
    // the film share one parameter.
    uniforms.uWaveEnergy.value = 0.85 + labParams.distortion * 0.6;
  });

  return <mesh geometry={geometry} material={material} position={[0, -0.15, -60]} renderOrder={0} />;
};

/**
 * Ray-casts the pointer against the monolith at ~12Hz rather than every frame:
 * the result feeds a damped value, so a higher rate buys nothing.
 */
const FocalPointTracker = () => {
  // Selectors only: subscribing to the whole R3F store would re-render this
  // component on every frame.
  const camera = useThree((s) => s.camera);
  const raycaster = useThree((s) => s.raycaster);
  const pointer = useThree((s) => s.pointer);
  const tick = useRef(0);
  const target = useRef(0);
  const value = useRef(0);

  useFrame((_, delta) => {
    tick.current += 1;
    if (tick.current % 5 === 0) {
      raycaster.setFromCamera(pointer, camera);
      target.current = raySlab(raycaster.ray.origin, raycaster.ray.direction) ? 1 : 0;
      voidRuntime.hit = target.current === 1;
    }
    value.current = damp(value.current, target.current, 6, delta);
    voidRuntime.focus = saturate(value.current);
  });

  return null;
};

interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

/**
 * Ray vs. axis-aligned slab in the monolith's local space.
 * Analytic (six plane tests) — no BVH, no scene traversal, no mesh reference.
 */
const raySlab = (origin: Vec3Like, direction: Vec3Like): boolean => {
  const min: Vec3Like = { x: -MONOLITH_SIZE[0] / 2, y: -4, z: -MONOLITH_SIZE[2] / 2 };
  const max: Vec3Like = { x: MONOLITH_SIZE[0] / 2, y: MONOLITH_SIZE[1] - 4, z: MONOLITH_SIZE[2] / 2 };
  const o: Vec3Like = {
    x: origin.x - MONOLITH_POSITION[0],
    y: origin.y - MONOLITH_POSITION[1],
    z: origin.z - MONOLITH_POSITION[2],
  };
  const axes: Array<[number, number, number, number]> = [
    [o.x, direction.x, min.x, max.x],
    [o.y, direction.y, min.y, max.y],
    [o.z, direction.z, min.z, max.z],
  ];

  let tMin = 0;
  let tMax = Infinity;
  for (const [originValue, dirValue, lo, hi] of axes) {
    if (Math.abs(dirValue) < 1e-6) {
      if (originValue < lo || originValue > hi) return false;
      continue;
    }
    let t1 = (lo - originValue) / dirValue;
    let t2 = (hi - originValue) / dirValue;
    if (t1 > t2) {
      const swap = t1;
      t1 = t2;
      t2 = swap;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return false;
  }
  return tMax > 0;
};

export default VoidScene;
