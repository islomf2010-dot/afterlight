import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TechLabel } from '@/components/ui/TechLabel';
import { useLoadingSnapshot } from '@/app/loadingRegistry';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { setSoundEnabled } from '@/audio/useAudio';
import { pointerField } from '@/animation/progressRegistry';
import { formatClock, formatCoordinate } from '@/utils/format';
import { damp } from '@/utils/math';

/**
 * THE AWAKENING — the cold open and the entry gate.
 *
 * Everything here is real: the coordinate readout is a live UTC clock, the
 * progress bars come from the loading registry (which reports actual font
 * decoding, context creation and shader compilation), and the point of light is
 * driven by the same pointer field the 3D scenes use.
 *
 * Audio is unlocked *here*, on this click — the only gesture in the flow that
 * is unambiguous. Nothing is audible before it.
 */
export const Awakening = () => {
  const loading = useLoadingSnapshot();
  const enter = useJourneyStore((s) => s.enter);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const reducedMotion = useSettingsStore((s) => s.motion === 'reduced');

  const [clock, setClock] = useState(() => Date.now());
  const [acknowledgedAudio, setAcknowledgedAudio] = useState(soundEnabled);
  const lightRef = useRef<HTMLDivElement | null>(null);

  // Real time, updated once a second — this is the film's timecode, not a fake
  // ticking animation.
  useEffect(() => {
    const id = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // The light drifts toward the pointer. Written straight to the element's
  // transform: no React state, no re-render.
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const x = { current: 0 };
    const y = { current: 0 };
    const loop = (): void => {
      raf = requestAnimationFrame(loop);
      x.current = damp(x.current, pointerField.targetX, 3, 1 / 60);
      y.current = damp(y.current, pointerField.targetY, 3, 1 / 60);
      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${x.current * 18}px, ${y.current * 12}px, 0)`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const coordinates = useMemo(() => {
    // Slow, deterministic drift derived from the clock — reads like a survey
    // instrument locking onto a fixed point in a place that is not a place.
    const seconds = Math.floor(clock / 1000);
    const lat = 12 + Math.sin(seconds / 37) * 0.614;
    const lon = -48 + Math.cos(seconds / 53) * 0.614;
    const alt = 4180 + Math.sin(seconds / 29) * 12.5;
    return { lat, lon, alt };
  }, [clock]);

  // ENTER unlocks once every loading task has settled (done or failed) — a
  // failed task must not trap the visitor outside the film.
  const settled = loading.tasks.every((task) => task.state === 'done' || task.state === 'error');
  const ready = loading.done || settled;
  const percent = Math.round(loading.overall * 100);

  const handleEnter = (): void => {
    if (!ready) return;
    // Explicit gesture → this is the only place the AudioContext may start, and
    // it must start synchronously, before the user-activation window closes.
    if (!acknowledgedAudio && !soundEnabled) {
      setSoundEnabled(true);
      setAcknowledgedAudio(true);
    }
    enter();
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-obsidian px-[var(--al-gutter)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(20,22,26,0.55) 0%, rgba(5,5,5,0) 70%), radial-gradient(120% 100% at 50% 120%, rgba(12,14,17,0.9), rgba(5,5,5,1) 60%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-[min(44rem,100%)] flex-col items-center gap-10 text-center">
        {/* --- The point of light ------------------------------------------- */}
        <div className="relative grid h-32 w-32 place-items-center">
          <div ref={lightRef} className="relative grid h-32 w-32 place-items-center">
            <span
              aria-hidden="true"
              className="absolute h-24 w-24 rounded-full border border-[color:rgba(191,197,202,0.12)]"
              style={{ animation: reducedMotion ? undefined : 'al-pulse-dot 6s var(--al-ease-in-out) infinite' }}
            />
            <span
              aria-hidden="true"
              className="absolute h-14 w-14 rounded-full border border-[color:rgba(191,197,202,0.2)]"
              style={{ animation: reducedMotion ? undefined : 'al-pulse-dot 6s var(--al-ease-in-out) infinite 0.4s' }}
            />
            <span
              aria-hidden="true"
              className="block h-[3px] w-[3px] rounded-full bg-ivory shadow-[0_0_22px_6px_rgba(243,242,238,0.45)]"
            />
          </div>
        </div>

        {/* --- Title --------------------------------------------------------- */}
        <div className="flex flex-col items-center gap-4">
          <TechLabel tone="muted">A film that renders itself</TechLabel>
          <h1 className="display-title text-2xl sm:text-3xl">
            AFTERLIGHT
            <span className="mt-4 block text-[0.32em] font-normal tracking-[0.42em] text-[color:var(--al-text-muted)]">
              THE WORLD BETWEEN FRAMES
            </span>
          </h1>
        </div>

        {/* --- Telemetry ------------------------------------------------------ */}
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-2xs text-[color:var(--al-text-faint)] sm:grid-cols-4">
          <Readout label="LAT" value={formatCoordinate(coordinates.lat)} />
          <Readout label="LON" value={formatCoordinate(coordinates.lon)} />
          <Readout label="ALT" value={`${coordinates.alt.toFixed(1)} M`} />
          <Readout label="T+00:00" value={formatClock(clock)} />
        </dl>

        {/* --- Loading -------------------------------------------------------- */}
        <div className="w-full max-w-[30rem]">
          <div className="flex items-baseline justify-between pb-3">
            <TechLabel tone={ready ? 'live' : 'muted'} dot>
              {ready ? 'Systems nominal' : `Loading · ${percent}%`}
            </TechLabel>
            <span className="font-mono text-2xs tabular-nums text-[color:var(--al-text-ghost)]">
              {percent.toString().padStart(3, ' ')}%
            </span>
          </div>

          <div className="h-px w-full bg-[color:var(--al-line)]">
            <div
              className="h-px bg-ivory transition-[width] duration-500 ease-[var(--al-ease-out)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          <ul className="mt-4 flex flex-col gap-1 text-left">
            {loading.tasks.map((task) => (
              <li key={task.id} className="flex items-baseline justify-between gap-4 font-mono text-2xs">
                <span
                  className={[
                    'uppercase tracking-[0.24em]',
                    task.state === 'done'
                      ? 'text-[color:var(--al-text-faint)]'
                      : task.state === 'error'
                        ? 'text-[color:var(--al-danger)]'
                        : 'text-[color:var(--al-text-muted)]',
                  ].join(' ')}
                >
                  {task.label}
                </span>
                <span className="flex-1 truncate text-right text-[color:var(--al-text-ghost)]">
                  {task.state === 'error' ? task.detail : task.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Entry ---------------------------------------------------------- */}
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleEnter}
            disabled={!ready}
            aria-describedby="awakening-audio-hint"
          >
            Enter
          </Button>
          <p id="awakening-audio-hint" className="max-w-[34ch] text-2xs leading-relaxed text-[color:var(--al-text-ghost)]">
            {soundEnabled || acknowledgedAudio
              ? 'Sound starts with the film. Use the toggle at any time.'
              : 'Pressing Enter also starts the ambient sound. You can mute it at any time.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button variant="ghost" size="sm" to="/archive">
              Read the log instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Readout = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center gap-1 sm:items-start">
    <dt className="label-mono opacity-50">{label}</dt>
    <dd className="tabular-nums text-[color:var(--al-text-muted)]">{value}</dd>
  </div>
);
