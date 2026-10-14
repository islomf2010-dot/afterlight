import { TechLabel } from '@/components/ui/TechLabel';

/**
 * Root `HydrateFallback`.
 *
 * React Router shows this while the first lazy route chunk is still streaming.
 * Without it the router logs a warning and paints an empty frame; with it, the
 * very first paint is a quiet, correct piece of the film's own visual language
 * rather than a white flash.
 */
export const RouteFallback = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-obsidian px-[var(--al-gutter)]">
    <span
      aria-hidden="true"
      className="block h-[3px] w-[3px] rounded-full bg-ivory shadow-[0_0_18px_4px_rgba(243,242,238,0.35)]"
    />
    <span className="display-title text-lg text-ivory">AFTERLIGHT</span>
    <TechLabel tone="muted">Loading</TechLabel>
  </div>
);

export default RouteFallback;
