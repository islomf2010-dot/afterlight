import { SCENES, sceneById, type SceneId } from '@/scenes/sceneManifest';
import { useJourneyStore } from '@/store/useJourneyStore';
import { scrollToTarget, scrollToTop } from '@/animation/smoothScroll';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { TechLabel } from '@/components/ui/TechLabel';

/** The Awakening is a gate, not a scroll section — it lives at the top. */
export const goToScene = (id: SceneId): void => {
  if (id === 'awakening') {
    scrollToTop();
    return;
  }
  scrollToTarget(`[data-scene="${id}"]`, { offset: -2 });
};

/**
 * Scene rail — the film's chapter indicator.
 *
 * Clicking a marker scrolls to that scene through the same path the wheel uses,
 * so keyboard and pointer navigation share one mechanism. The markers are real
 * buttons in a labelled nav: they are the fastest keyboard route through the
 * narrative and are reachable without ever touching the canvas.
 */
export const SceneProgress = () => {
  const activeScene = useJourneyStore((s) => s.activeScene);
  const entered = useJourneyStore((s) => s.entered);
  const transition = useJourneyStore((s) => s.transition);
  const isMobile = useIsMobile();
  const active = sceneById(activeScene);

  const visible = entered && transition === 'idle';

  if (isMobile) {
    return (
      <nav
        aria-label="Scene navigation"
        className={[
          'fixed inset-x-0 bottom-0 z-[90] flex items-center justify-between gap-1 border-t border-[color:var(--al-line)] bg-[color:rgba(5,5,5,0.7)] px-[var(--al-gutter)] py-2 backdrop-blur-sm',
          'transition-transform duration-700 ease-[var(--al-ease-out)]',
          visible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        {/* The label yields space first; the rail is the navigation, so it
            keeps its full touch targets and the title truncates instead. */}
        <TechLabel tone="muted" className="min-w-0 shrink truncate">
          {active.numeral} · {active.title}
        </TechLabel>
        <ul className="flex min-w-0 flex-1 items-center justify-end gap-0.5">
          {SCENES.map((scene) => (
            <li key={scene.id}>
              <button
                type="button"
                onClick={() => goToScene(scene.id)}
                aria-label={`Go to scene ${scene.numeral}: ${scene.title}`}
                aria-current={scene.id === activeScene ? 'true' : undefined}
                className={[
                  // The marker is a hairline, but the hit area is not: on touch
                  // it has to clear 44px or the rail is unusable.
                  'grid h-[var(--al-control-track)] min-w-[var(--al-control-tap)] max-w-[var(--al-control-tap)] flex-1 place-items-center transition-colors duration-300',
                  scene.id === activeScene ? 'text-ivory' : 'text-[color:var(--al-text-quiet)] hover:text-[color:var(--al-text-muted)]',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'block h-px w-full transition-all duration-300',
                    scene.id === activeScene ? 'h-[2px] bg-ivory' : 'bg-current',
                  ].join(' ')}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Scene navigation"
      className={[
        // Right edge: the scene captions live bottom-left on most scenes, and a
        // rail down the same edge would collide with them.
        'fixed bottom-[var(--al-space-6)] right-[var(--al-gutter)] z-[90] flex flex-col items-end gap-4',
        'transition-[opacity,transform] duration-700 ease-[var(--al-ease-out)]',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      ].join(' ')}
    >
      <ol className="flex flex-col items-end gap-0">
        {SCENES.map((scene) => {
          const isActive = scene.id === activeScene;
          return (
            <li key={scene.id}>
              <button
                type="button"
                onClick={() => goToScene(scene.id)}
                aria-label={`Scene ${scene.numeral}: ${scene.title}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex min-h-[var(--al-control-tap)] min-w-[var(--al-control-tap)] items-center gap-3 py-1.5 text-right"
              >
                <span
                  className={[
                    'label-mono transition-colors duration-300',
                    isActive
                      ? 'text-ivory'
                      : 'text-[color:var(--al-text-quiet)] group-hover:text-[color:var(--al-text-muted)]',
                  ].join(' ')}
                >
                  {scene.numeral}
                </span>
                <span
                  aria-hidden="true"
                  className={[
                    'block h-px transition-all duration-500 ease-[var(--al-ease-out)]',
                    isActive ? 'w-8 bg-ivory' : 'w-4 bg-[color:var(--al-line-strong)] group-hover:w-6 group-hover:bg-[color:var(--al-silver)]',
                  ].join(' ')}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col items-end gap-1 border-r border-[color:var(--al-line)] pr-3">
        <TechLabel tone="muted" live>
          {active.telemetry}
        </TechLabel>
      </div>
    </nav>
  );
};
