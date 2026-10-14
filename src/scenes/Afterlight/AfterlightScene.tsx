import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, type Group } from 'three';
import { HASH_NOISE, VALUE_NOISE } from '@/graphics/shaders/common';

import { useCameraRig, type CameraKeyframe } from '@/animation/useCameraRig';
import { clockField, progressRegistry } from '@/animation/progressRegistry';
import { saturate, smoothstep, travel, window01 } from '@/utils/math';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { ParticleCloud } from '@/graphics/particles/ParticleCloud';
import { cue } from '@/audio/engine';
import type { SceneId } from '@/scenes/sceneManifest';

const SCENE: SceneId = 'afterlight';

/**
 * AFTERLIGHT — the coda.
 *
 * The camera withdraws from the last structure we built until there is nothing
 * left to withdraw from. What remains is the afterlight: a single residual
 * glow, the dust it lights, and then black. Everything the scene owns fades
 * with `dissolve`, which is driven by the scroll position — so the ending is
 * genuinely driven by the visitor's hand, not by a timer.
 */

/** Withdraw → rise → turn → hold → dissolve. */
const CAMERA_FRAMES: CameraKeyframe[] = [
  { position: [6, 10, 60], lookAt: [0, 14, 0], fov: 40 },
  { position: [14, 22, 104], lookAt: [0, 16, 0], fov: 38 },
  { position: [-10, 40, 168], lookAt: [0, 18, 0], fov: 34 },
  { position: [0, 62, 236], lookAt: [0, 18, 0], fov: 30 },
  { position: [0, 96, 320], lookAt: [0, 18, 0], fov: 26 },
];

/** Imperative state the DOM ending overlay reads. */
export const afterlightRuntime = {
  /** 0 → fully present, 1 → fully dissolved into black. */
  dissolve: 0,
  /** Residual glow left after the dissolve begins. */
  afterglow: 0,
};

/** Fires the cue that accompanies the REPLAY control. */
export const cueReplay = (): void => cue('fracture');

const AfterlightScene = () => {
  const budget = useQualityBudget();

  useCameraRig({
    frames: CAMERA_FRAMES,
    getProgress: () => travel(progressRegistry.value(SCENE)),
    parallax: 0.7,
    parallaxLook: 0.25,
    // The withdrawal is slow and deliberate — a low damping rate is what makes
    // it feel like a pullback rather than a scroll-linked pan.
    damping: 1.8,
  });

  return (
    <group>
      <ResidualStructure />
      <AfterglowShell />
      <ParticleCloud
        count={Math.round(2600 * budget.dust)}
        extent={[90, 70, 90]}
        distribution="shell"
        seed={0xa17e0f}
        variant="dust"
        color="#a9b8c6"
        accent="#ffffff"
        size={1.2}
        opacity={0.4}
        bounds={70}
        pointerRadius={22}
        pointerDistance={44}
      />
      <DissolveDriver />
    </group>
  );
};

/** Keeps the DOM ending overlay and the shaders on the same dissolve value. */
const DissolveDriver = () => {
  useFrame((_, delta) => {
    const p = travel(progressRegistry.value(SCENE));
    // The dissolve occupies the last third of the pinned window, so the visitor
    // always gets the full pullback before anything starts leaving.
    const dissolve = smoothstep(saturate((p - 0.62) / 0.38));
    afterlightRuntime.dissolve = dissolve;
    afterlightRuntime.afterglow = window01(p, 0.08, 0.14) * (1 - dissolve * 0.85);
    void delta;
  });
  return null;
};

/**
 * The last structure: three slabs, barely lit, receding into the fog. It is
 * never seen whole — by the time the camera has withdrawn far enough to frame
 * it, the dissolve has already begun. That is the point.
 */
const ResidualStructure = () => {
  const groupRef = useRef<Group>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color('#1b2128') },
          uEdge: { value: new Color('#8fa3b4') },
          uDissolve: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vLocal;
          varying vec3 vNormalW;
          varying vec3 vViewDir;
          void main() {
            vLocal = position;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vNormalW = normalize(mat3(modelMatrix) * normal);
            vViewDir = normalize(cameraPosition - world.xyz);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: /* glsl */ `
          ${HASH_NOISE}
          ${VALUE_NOISE}

          uniform vec3 uColor;
          uniform vec3 uEdge;
          uniform float uDissolve;
          uniform float uTime;
          varying vec3 vLocal;
          varying vec3 vNormalW;
          varying vec3 vViewDir;

          void main() {
            // Rim term: the slabs read only by their silhouette.
            float rim = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.2);

            // Dissolve eats the structure from the top down with a noisy edge,
            // so it looks like the material is being unmade rather than faded.
            float noise = vnoise3(vLocal * 0.35 + uTime * 0.05);
            float threshold = vLocal.y * 0.06 + 8.0;
            float eaten = smoothstep(threshold - 1.6, threshold + 1.6, (1.0 - uDissolve) * 22.0 + noise * 2.4);

            float a = (0.18 + rim * 0.85) * eaten;
            if (a < 0.004) discard;
            gl_FragColor = vec4(mix(uColor, uEdge, rim), a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    material.uniforms.uDissolve.value = afterlightRuntime.dissolve;
    material.uniforms.uTime.value = clockField.elapsed;
    if (groupRef.current) {
      groupRef.current.rotation.y = clockField.elapsed * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={material} position={[0, 8, 0]}>
        <boxGeometry args={[14, 16, 14]} />
      </mesh>
      <mesh material={material} position={[26, 4, -18]} rotation={[0, 0.6, 0.08]}>
        <boxGeometry args={[7, 9, 7]} />
      </mesh>
      <mesh material={material} position={[-23, 5, -26]} rotation={[0.1, -0.5, -0.05]}>
        <boxGeometry args={[9, 11, 9]} />
      </mesh>
      <ambientLight intensity={0.1} color="#39454f" />
      <directionalLight intensity={1.1} color="#9fb2c2" position={[10, 18, 14]} />
    </group>
  );
};

/**
 * The afterlight itself.
 *
 * A camera-facing billboard rather than a sphere: a shell renders a hard
 * silhouette edge, which reads as a grey ball hanging in the frame. Light in
 * fog has no edge — it falls off. So this is a single quad with a radial
 * falloff, a faint anamorphic ring and a breathing noise, drawn additively and
 * turned to face the camera each frame.
 */
const AfterglowShell = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color('#cfdce8') },
          uIntensity: { value: 0 },
          uContract: { value: 0 },
          uTime: { value: 0 },
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
          uniform float uContract;
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float d = length(p);
            float angle = atan(p.y, p.x);

            // Inverse-square-ish core, contracting toward nothing as the film ends.
            float radius = mix(0.34, 0.05, uContract);
            float core = 1.0 / (1.0 + pow(d / max(radius, 0.02), 2.0));

            // A wide, very faint halo so the glow sits in the fog.
            float halo = exp(-d * 3.2) * 0.14;

            // Anamorphic ring: a single thin ellipse of light around the core.
            float ring = exp(-pow((d - radius * 1.4) * (22.0 + uContract * 50.0), 2.0)) * 0.3;
            ring *= 0.6 + 0.4 * sin(angle * 2.0 + uTime * 0.25);

            // Slow breathing, and a little noise so the edge is never a circle.
            float breathe = 0.9 + 0.1 * sin(uTime * 0.35);
            float wobble = 0.94 + 0.06 * sin(angle * 5.0 - uTime * 0.2);

            float a = (core * 0.42 * wobble + halo + ring) * uIntensity * breathe;

            // Force the quad's own edge to zero. Without this the billboard's
            // rectangular boundary is visible as a faint panel edge, which is
            // the one artefact that instantly reads as "a quad in a scene".
            a *= 1.0 - smoothstep(0.55, 1.0, d);
            if (a < 0.002) discard;
            gl_FragColor = vec4(uColor * (0.7 + core * 0.6), a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        // A billboard is a single quad: culling it as back-facing would make
        // it invisible from the only side that ever exists.
        side: DoubleSide,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  const meshRef = useRef<Group>(null);

  useFrame(({ camera, clock }) => {
    material.uniforms.uIntensity.value = afterlightRuntime.afterglow * 0.85;
    material.uniforms.uContract.value = afterlightRuntime.dissolve;
    material.uniforms.uTime.value = clock.elapsedTime;
    // Billboard: the glow has no orientation, so it always faces the eye.
    if (meshRef.current) meshRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={meshRef} position={[0, 14, 0]}>
      <mesh material={material} renderOrder={2}>
        <planeGeometry args={[150, 150]} />
      </mesh>
    </group>
  );
};

export default AfterlightScene;
