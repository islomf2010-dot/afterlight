import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, ShaderMaterial } from 'three';

import { useCameraRig, type CameraKeyframe } from '@/animation/useCameraRig';
import { progressRegistry } from '@/animation/progressRegistry';
import { travel } from '@/utils/math';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { runtimeFlags } from '@/store/useSettingsStore';
import { labRuntime, type ExhibitId } from '@/store/useLabStore';

import { ParticleExhibit } from './exhibits/ParticleExhibit';
import { DistortionExhibit } from './exhibits/DistortionExhibit';
import { PortalExhibit } from './exhibits/PortalExhibit';
import { ExhibitBackdrop } from './exhibits/ExhibitBackdrop';
import type { SceneId } from '@/scenes/sceneManifest';

const SCENE: SceneId = 'echoes';

const SPACING = 34;

const STOPS: readonly { id: ExhibitId; x: number }[] = [
  { id: 'particles', x: 0 },
  { id: 'shaders', x: SPACING },
  { id: 'portal', x: SPACING * 2 },
];

/**
 * The camera tracks along X and settles square-on at each exhibit.
 *
 * Framed to hold the exhibit *and* its armature inside the frame with air
 * around it — these are mounted studies in a room, not full-bleed wallpaper.
 */
const CAMERA_FRAMES: CameraKeyframe[] = STOPS.map((stop) => ({
  position: [stop.x, 3.4, 28],
  lookAt: [stop.x, 0.8, 0],
  fov: 40,
}));

/**
 * ECHOES — three studies mounted in one room.
 *
 * All three exhibits live in a single WebGL pass laid out along X, and the
 * scroll moves the camera laterally between them. Three separate canvases would
 * mean three render loops, three contexts and three copies of the same
 * backdrop; this way the whole gallery costs one scene graph and the camera
 * move itself becomes the transition.
 */
const EchoesScene = () => {
  const budget = useQualityBudget();

  useCameraRig({
    frames: CAMERA_FRAMES,
    getProgress: () => travel(progressRegistry.value(SCENE)),
    parallax: 0.9,
    parallaxLook: 0.35,
    damping: 3.2,
  });

  return (
    <group>
      <FocusReporter />

      <group position={[0, 0, 0]}>
        <ExhibitBackdrop radius={20} intensity={0.32} />
        <ParticleExhibit density={budget.density} pointerDistance={11} />
      </group>

      <group position={[SPACING, 0, 0]}>
        <ExhibitBackdrop radius={20} intensity={0.28} />
        <DistortionExhibit size={17} highDetail={budget.highPost} />
      </group>

      <group position={[SPACING * 2, 0, 0]}>
        <ExhibitBackdrop radius={20} intensity={0.3} />
        <PortalExhibit size={17} mode="proximity" />
      </group>

      <GalleryFloor width={SPACING * 2 + 48} />
    </group>
  );
};

/**
 * Publishes which exhibit is currently centred, so the DOM overlay can mark the
 * active study and the laboratory routes can deep-link to it. Sampled every few
 * frames; it only ever writes when the value actually changes.
 */
const FocusReporter = () => {
  const ticks = useRef(0);
  useFrame(({ camera }) => {
    ticks.current += 1;
    if (ticks.current % 6 !== 0) return;
    let closest: ExhibitId = 'particles';
    let best = Infinity;
    for (const stop of STOPS) {
      const distance = Math.abs(camera.position.x - stop.x);
      if (distance < best) {
        best = distance;
        closest = stop.id;
      }
    }
    if (labRuntime.focus !== closest) labRuntime.focus = closest;
  });
  return null;
};

/**
 * The gallery floor.
 *
 * A single plane with an analytically derived grid: distance-aware line width
 * so the grid stays one pixel wide instead of aliasing into moiré at grazing
 * angles, and a radial fade so it dissolves into the fog rather than ending at
 * a hard edge.
 */
const GalleryFloor = ({ width }: { width: number }) => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uExposure: { value: 0 },
          uColor: { value: new Color('#525d68') },
        },
        vertexShader: /* glsl */ `
          varying vec2 vXZ;
          void main() {
            vXZ = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uExposure;
          uniform vec3 uColor;
          varying vec2 vXZ;

          // Screen-space-derivative line mask: constant apparent thickness at
          // any distance, which a plain fract() grid cannot do.
          float gridLine(vec2 p, float scale) {
            vec2 coord = p * scale;
            vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), 1e-5);
            return 1.0 - min(min(grid.x, grid.y), 1.0);
          }

          void main() {
            float minor = gridLine(vXZ, 0.25);
            float major = gridLine(vXZ, 0.0625);
            float d = length(vXZ - vec2(34.0, -8.0));
            float fade = exp(-d * 0.022);
            float a = (minor * 0.18 + major * 0.5) * fade * uExposure;
            if (a < 0.002) discard;
            gl_FragColor = vec4(uColor, a);
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
    material.uniforms.uExposure.value = runtimeFlags.exposure;
  });

  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[SPACING, -9.5, 0]} renderOrder={1}>
      <planeGeometry args={[width, 90]} />
    </mesh>
  );
};

export default EchoesScene;
