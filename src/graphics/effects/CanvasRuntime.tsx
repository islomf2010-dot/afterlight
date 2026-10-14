import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { EffectComposer as EffectComposerImpl } from 'postprocessing';
import { advanceClock, pointerField } from '@/animation/progressRegistry';
import { labRuntime, useLabStore } from '@/store/useLabStore';
import { downloadBlob } from '@/utils/download';
import { runtimeFlags } from '@/store/useSettingsStore';
import { damp } from '@/utils/math';
import { loadingRegistry } from '@/app/loadingRegistry';

/**
 * In-canvas runtime services.
 *
 * Everything here lives outside React's render path by design: these callbacks
 * run every frame, so they touch only refs and the non-reactive mirrors.
 * `useFrame` subscriptions are torn down automatically by R3F on unmount.
 */

/**
 * The live post-processing composer, shared between PostFX (which creates it)
 * and the capture bridge (which must re-render through it). A module-level
 * ref is the smallest thing that avoids prop-drilling through the Canvas.
 */
export const activeComposer: { current: EffectComposerImpl | null } = { current: null };

/** Smooths the pointer field and advances the shared, pausable clock. */
export const ClockDriver = ({ running }: { running: boolean }) => {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    pointerField.x = damp(pointerField.x, pointerField.targetX, 3.2, dt);
    pointerField.y = damp(pointerField.y, pointerField.targetY, 3.2, dt);
    // Velocity decays toward zero; the raw values are replaced on the next move.
    pointerField.vx = damp(pointerField.vx, 0, 4, dt);
    pointerField.vy = damp(pointerField.vy, 0, 4, dt);
    pointerField.activity = damp(pointerField.activity, pointerField.lastMoveAt ? 0 : 1, 1.2, dt);
    advanceClock(running ? dt : 0);
  });
  return null;
};

/**
 * Global film exposure.
 *
 * Ramps 0 → 1 after ENTER and back to 0 on REPLAY. Scenes multiply their
 * presence by this, which is what makes entering the story read as a projector
 * fade-up rather than a component mounting.
 */
export const ExposureDriver = ({ target }: { target: number }) => {
  const value = useRef(0);
  useFrame((_, delta) => {
    value.current = damp(value.current, target, 2.2, Math.min(delta, 0.05));
    runtimeFlags.exposure = value.current;
  });
  return null;
};

/**
 * CAPTURE implementation.
 *
 * Re-renders the current frame on demand — through the post-processing
 * composer when one is mounted, otherwise straight to the renderer — and hands
 * the canvas to `toBlob` in the same task, so the drawing buffer is still
 * valid without paying for `preserveDrawingBuffer` on every frame of playback.
 *
 * Failures (zero-size canvas, a browser without `toBlob`, a blocked download)
 * surface as a real error message in the laboratory, never as a silent no-op.
 */
export const CaptureBridge = () => {
  // Selectors, not the whole store: `useThree()` without one subscribes to every
  // frame's state update and re-renders this component 60 times a second.
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const lastToken = useRef(labRuntime.captureToken);

  useFrame(() => {
    if (labRuntime.captureToken === lastToken.current) return;
    lastToken.current = labRuntime.captureToken;

    const canvas = gl.domElement;

    /** Publishes the outcome and advances the sequence exactly once. */
    const publish = (error: string | null): void => {
      labRuntime.captureError = error;
      labRuntime.captureSeq += 1;
    };

    const finish = (blob: Blob | null): void => {
      if (!blob || blob.size === 0) {
        publish('The frame could not be encoded — the canvas produced no data.');
        return;
      }
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const ok = downloadBlob(blob, `afterlight-frame-${stamp}.png`);
      publish(
        ok ? null : 'The browser blocked the download. Check this site’s download permissions.',
      );
    };

    try {
      if (canvas.width < 2 || canvas.height < 2) {
        publish('The frame is too small to capture. Resize the window and try again.');
        return;
      }
      if (typeof canvas.toBlob !== 'function') {
        publish('This browser does not support canvas capture (toBlob).');
        return;
      }
      if (activeComposer.current) activeComposer.current.render(1 / 60);
      else gl.render(scene, camera);
      canvas.toBlob(finish, 'image/png');
    } catch (error) {
      publish(error instanceof Error ? error.message : 'Capture failed for an unknown reason.');
    }
  });

  return null;
};

/**
 * Pushes the capture result from the canvas mirror into the store.
 *
 * Driven by `captureSeq` rather than the error string: the error is `null` on
 * every success, so a value comparison would emit once at startup (before any
 * capture was ever requested) and then never again.
 */
export const CaptureReporter = () => {
  const seen = useRef(labRuntime.captureSeq);
  useFrame(() => {
    if (labRuntime.captureSeq === seen.current) return;
    seen.current = labRuntime.captureSeq;
    const error = labRuntime.captureError;
    if (error) useLabStore.getState().resolveCapture('error', error);
    else useLabStore.getState().resolveCapture('success', 'Frame captured and downloaded.');
  });
  return null;
};

/** Keeps `runtimeFlags.fps` and the lifetime frame counter fresh for diagnostics. */
export const FpsSampler = () => {
  const acc = useRef({ frames: 0, elapsed: 0 });
  useFrame((_, delta) => {
    const s = acc.current;
    s.frames += 1;
    s.elapsed += delta;
    runtimeFlags.frames += 1;
    if (s.elapsed >= 0.5) {
      runtimeFlags.fps = s.frames / s.elapsed;
      s.frames = 0;
      s.elapsed = 0;
    }
  });
  return null;
};

/**
 * Frames to let the driver compile, link and *draw with* its first program
 * before we report the shader task as done.
 */
const WARMUP_FRAMES = 3;

/**
 * Completes the "shader programs" loading task once the driver has actually
 * linked programs. Three frames is the point at which a first material has been
 * compiled, linked and drawn with — the count is read from the renderer's real
 * program cache, not estimated.
 */
export const ShaderWarmup = () => {
  // Selector, not the whole store — see the note in CaptureBridge.
  const gl = useThree((s) => s.gl);
  // A ref, not useMemo: this counter must survive re-renders, and a fresh
  // object identity here would restart the warm-up on every render.
  const frameCount = useRef(0);

  useFrame(() => {
    // Bounded at WARMUP_FRAMES, not "stop after the first frame": the first
    // frame only compiles, the second links, the third draws with it.
    if (frameCount.current >= WARMUP_FRAMES) return;
    frameCount.current += 1;
    if (frameCount.current < WARMUP_FRAMES) return;
    const programs = gl.info.programs?.length ?? 0;
    loadingRegistry.complete('shaders', `${programs} GLSL program${programs === 1 ? '' : 's'} linked`);
  });

  return null;
}
