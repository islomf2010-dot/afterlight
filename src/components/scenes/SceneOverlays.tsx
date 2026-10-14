import { useEffect, useRef, useState } from 'react';
import { TechLabel } from '@/components/ui/TechLabel';
import { Button } from '@/components/ui/Button';
import { voidRuntime } from '@/scenes/Void/VoidScene';
import { thresholdRuntime } from '@/scenes/Threshold/ThresholdScene';
import {
  fractureRuntime,
  resetFracture,
  setFractureTarget,
  toggleFracturePointerMode,
} from '@/scenes/Fracture/FractureScene';
import { afterlightRuntime, cueReplay } from '@/scenes/Afterlight/AfterlightScene';
import { labRuntime, type ExhibitId } from '@/store/useLabStore';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useBucketedProgress } from '@/animation/useSceneScroll';
import { scrollToTop } from '@/animation/smoothScroll';
import { formatInt } from '@/utils/format';

/**
 * Scene overlays.
 *
 * Each one reads the same imperative runtime the shaders read. The pattern is
 * identical everywhere: poll on rAF, but only re-render when a *bucketed*
 * value changes. That keeps React out of the animation path while still giving
 * the visitor real, honest feedback.
 */
const useBucketedRuntime = <T,>(read: () => T, bucketOf: (value: T) => number, buckets = 12): T => {
  const [value, setValue] = useState<T>(read);
  const last = useRef(bucketOf(value));

  useEffect(() => {
    let frame = 0;
    const loop = (): void => {
      frame = requestAnimationFrame(loop);
      const next = read();
      const bucket = bucketOf(next);
      if (bucket === last.current) return;
      last.current = bucket;
      setValue(next);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets]);

  return value;
};

/* -------------------------------------------------------------------------
   II — THE VOID
   ---------------------------------------------------------------------- */

export const VoidOverlay = () => {
  const focus = useBucketedRuntime(
    () => voidRuntime.focus,
    (value) => Math.round(value * 6),
  );
  const locked = focus > 0.5;

  return (
    <div className="flex flex-col gap-3">
      <TechLabel tone={locked ? 'live' : 'muted'} dot live>
        Focal point · {locked ? 'locked' : 'seeking'}
      </TechLabel>
      <p className="max-w-[42ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
        {locked
          ? 'The slab is holding your attention. Its edges answer it.'
          : 'Move the pointer across the monolith. The edges answer.'}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------
   III — FRACTURE
   ---------------------------------------------------------------------- */

interface FractureSnapshot {
  progress: number;
  mode: 1 | -1;
  following: boolean;
  dispersed: number;
}

export const FractureOverlay = ({ align }: { align: 'start' | 'center' }) => {
  const snapshot = useBucketedRuntime<FractureSnapshot>(
    () => ({
      progress: fractureRuntime.progress,
      mode: fractureRuntime.pointerMode,
      following: fractureRuntime.followingScroll,
      dispersed: fractureRuntime.dispersed,
    }),
    (value) =>
      Math.round(value.progress * 24) +
      (value.mode === 1 ? 0 : 100) +
      (value.following ? 0 : 1000) +
      Math.round(value.dispersed / 40),
    12,
  );

  const cohesion = Math.round((1 - snapshot.progress) * 100);

  return (
    <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center' : ''}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="technical" size="sm" onClick={() => setFractureTarget(1)}>
          Disintegrate
        </Button>
        <Button variant="technical" size="sm" onClick={() => setFractureTarget(0)}>
          Reassemble
        </Button>
        <Button variant="technical" size="sm" onClick={toggleFracturePointerMode}>
          Pointer · {snapshot.mode === 1 ? 'repel' : 'attract'}
        </Button>
        <Button variant="ghost" size="sm" onClick={resetFracture}>
          Reset
        </Button>
        {snapshot.following ? (
          <TechLabel tone="live" dot>
            Following scroll
          </TechLabel>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setFractureTarget(fractureRuntime.progress, true)}>
            Follow scroll
          </Button>
        )}
      </div>

      <TechLabel tone="muted" live>
        Cohesion {cohesion.toString().padStart(3, '0')}% · {formatInt(snapshot.dispersed)} fragments in
        flight
      </TechLabel>

      <p className="max-w-[46ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
        Scroll drives the sequence by default. The controls take over when you use them — “Follow scroll”
        hands it back.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------
   IV — THE THRESHOLD
   ---------------------------------------------------------------------- */

export const ThresholdOverlay = () => {
  const progress = useBucketedProgress('threshold', 16).value;
  const aperture = useBucketedRuntime(
    () => ({ open: thresholdRuntime.aperture, depth: thresholdRuntime.depth }),
    (value) => Math.round(value.open * 8) + Math.round(value.depth / 25),
    12,
  );
  const open = aperture.open > 0.4;

  return (
    <div className="flex flex-col gap-3">
      <TechLabel tone={open ? 'live' : 'muted'} dot live>
        Aperture · {open ? 'open' : 'closed'} · {aperture.depth.toFixed(0)} m
      </TechLabel>
      <p className="max-w-[42ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
        Passage {Math.round(progress * 100).toString().padStart(3, '0')}% traversed. Aim the pointer at
        the far end to open it early.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------
   V — ECHOES
   ---------------------------------------------------------------------- */

const EXHIBIT_INDEX: Record<ExhibitId, number> = { particles: 0, shaders: 1, portal: 2 };
const EXHIBIT_NAMES = ['Particle field', 'Domain warp', 'Refractive aperture'] as const;

const EXHIBIT_ROUTES = [
  { id: 'particles' as ExhibitId, to: '/lab/particles', label: 'Study I' },
  { id: 'shaders' as ExhibitId, to: '/lab/shaders', label: 'Study II' },
  { id: 'portal' as ExhibitId, to: '/lab/portal', label: 'Study III' },
] as const;

export const EchoesOverlay = () => {
  const focus = useBucketedRuntime(
    () => EXHIBIT_INDEX[labRuntime.focus],
    (value) => value,
    3,
  );

  return (
    <div className="flex flex-col gap-3">
      <TechLabel tone="live" dot>
        Study {focus + 1} of 3 · {EXHIBIT_NAMES[focus]}
      </TechLabel>
      <div className="flex flex-wrap gap-3">
        {EXHIBIT_ROUTES.map((route) => (
          <Button
            key={route.to}
            variant={EXHIBIT_INDEX[route.id] === focus ? 'outline' : 'ghost'}
            size="sm"
            to={route.to}
          >
            {route.label}
          </Button>
        ))}
      </div>
      <p className="max-w-[46ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
        Every parameter these studies run on is exposed in the laboratory, and every one of them changes
        what you are looking at.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------
   VI — AFTERLIGHT
   ---------------------------------------------------------------------- */

export const AfterlightOverlay = () => {
  const dissolve = useBucketedRuntime(
    () => afterlightRuntime.dissolve,
    (value) => Math.round(value * 20),
    20,
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <TechLabel tone="muted" live>
        {dissolve > 0.98 ? 'Frame retained' : `Dissolving · ${Math.round(dissolve * 100)}%`}
      </TechLabel>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            cueReplay();
            scrollToTop();
            useJourneyStore.getState().replay();
          }}
        >
          Replay
        </Button>
        <Button variant="outline" size="md" to="/archive">
          Archive
        </Button>
        <Button variant="outline" size="md" to="/credits">
          Credits
        </Button>
      </div>
    </div>
  );
};
