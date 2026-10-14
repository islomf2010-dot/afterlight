import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { JourneyCanvas, useScenePreload } from '@/scenes/JourneyCanvas';
import { Awakening } from '@/scenes/Awakening/Awakening';
import { SceneProgress, goToScene } from '@/components/progress/SceneProgress';
import { StaticBackdrop, WebGLFallbackNotice } from '@/components/fallback/WebGLFallback';
import { TechLabel } from '@/components/ui/TechLabel';
import { useSceneScroll } from '@/animation/useSceneScroll';
import { useJourneyStore } from '@/store/useJourneyStore';
import { capabilities } from '@/graphics/capabilitiesContext';
import { scrollToTop, scrollToTarget } from '@/animation/smoothScroll';
import { cue } from '@/audio/engine';
import { SCENES, type SceneDefinition, type SceneId } from '@/scenes/sceneManifest';

import {
  VoidOverlay,
  FractureOverlay,
  ThresholdOverlay,
  EchoesOverlay,
  AfterlightOverlay,
} from '@/components/scenes/SceneOverlays';

/**
 * THE FILM.
 *
 * The canvas is a fixed layer behind a normal, natively-scrolling document.
 * Nothing is hijacked: the wheel, the scrollbar, Page Down, the space bar and
 * find-in-page all behave exactly as the visitor expects, and the 3D layer is
 * driven by whatever the document is already doing.
 *
 * Every scene's text lives in the DOM, which is also why the narrative survives
 * a missing or lost WebGL context — the fallback is not a degraded copy of the
 * page, it is the page.
 */
export const Home = () => {
  useScenePreload();
  const entered = useJourneyStore((s) => s.entered);
  const webgl = capabilities.webgl;
  const scrolled = useJourneyStore((s) => s.hasScrolled);

  useEffect(() => {
    // Deep link support: `/#fracture` jumps straight into the film.
    const hash = window.location.hash.replace('#', '');
    if (!entered || !hash) return;
    const match = SCENES.find((scene) => scene.id === hash);
    if (!match) return;
    const raf = requestAnimationFrame(() => {
      scrollToTarget(`[data-scene="${match.id}"]`, { offset: -2 });
    });
    return () => cancelAnimationFrame(raf);
  }, [entered]);

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0">
        {webgl ? <JourneyCanvas className="h-full w-full" /> : <StaticBackdrop />}
      </div>

      {!webgl ? <WebGLFallbackNotice /> : null}

      {!entered ? <Awakening /> : null}

      <div className="relative z-10">
        {SCENES.filter((scene) => !scene.gated).map((scene) => (
          <SceneSection key={scene.id} scene={scene} />
        ))}
      </div>

      {/* Announces scene changes to assistive technology without moving focus. */}
      <SceneAnnouncer />

      <SceneProgress />

      {/* A single, quiet affordance: the first scroll unlocks the narrative. */}
      {!entered ? null : scrolled ? null : <ScrollHint />}
    </div>
  );
};

/** One 300vh scroll section with a sticky 100vh stage. */
const SceneSection = ({ scene }: { scene: SceneDefinition }) => {
  const ref = useRef<HTMLElement>(null);
  useSceneScroll(ref, scene.id);

  return (
    <section
      ref={ref}
      data-scene={scene.id}
      id={scene.id}
      aria-labelledby={`${scene.id}-heading`}
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 flex h-dvh items-end overflow-hidden">
        {/*
          A scrim under the caption block. The film behind it ranges from pure
          black to a bright specular highlight on water; without this the text
          is legible on some frames and not others.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46vh] sm:h-[52vh]"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.28) 46%, rgba(5,5,5,0.58) 80%, rgba(5,5,5,0.78) 100%)',
          }}
        />
        <SceneStage scene={scene} />
      </div>
    </section>
  );
};

/**
 * The DOM layer for a scene: its title, its log entry and its controls.
 * Placement varies per scene so the composition changes as you travel —
 * a film that puts every caption in the same corner is a website, not a film.
 */
const SceneStage = ({ scene }: { scene: SceneDefinition }) => {
  const alignment =
    scene.id === 'fracture'
      ? 'items-end text-right'
      : scene.id === 'afterlight'
        ? 'items-center text-center'
        : 'items-start';

  const width = scene.id === 'threshold' ? 'max-w-[38rem]' : 'max-w-[34rem]';

  return (
    <div className={`flex w-full flex-col gap-6 px-[var(--al-gutter)] pb-[max(5rem,calc(var(--al-space-8)+env(safe-area-inset-bottom)))] ${alignment}`}>
      <div className={`flex flex-col gap-4 ${width} ${scene.id === 'afterlight' ? 'mx-auto items-center' : ''}`}>
        <div className={`flex items-baseline gap-4 ${scene.id === 'afterlight' ? 'justify-center' : ''}`}>
          <TechLabel tone="muted">{scene.numeral}</TechLabel>
          <span aria-hidden="true" className="h-px w-10 bg-[color:var(--al-line-strong)]" />
          <TechLabel tone="muted">{scene.subtitle}</TechLabel>
        </div>

        <h2 id={`${scene.id}-heading`} className="display-title text-lg">
          {scene.title}
        </h2>

        <p className="max-w-[var(--al-measure)] text-base leading-relaxed text-[color:var(--al-text-muted)]">
          {scene.log}
        </p>

        <SceneControls sceneId={scene.id} align={scene.id === 'afterlight' ? 'center' : 'start'} />
      </div>
    </div>
  );
};

const SceneControls = ({ sceneId, align }: { sceneId: SceneId; align: 'start' | 'center' }) => {
  switch (sceneId) {
    case 'void':
      return <VoidOverlay />;
    case 'fracture':
      return <FractureOverlay align={align} />;
    case 'threshold':
      return <ThresholdOverlay />;
    case 'echoes':
      return <EchoesOverlay />;
    case 'afterlight':
      return <AfterlightOverlay />;
    default:
      return null;
  }
};

/**
 * Live region for scene changes. `aria-live="polite"` so it never interrupts;
 * visually hidden so it never appears on screen.
 */
const SceneAnnouncer = () => {
  const activeScene = useJourneyStore((s) => s.activeScene);
  const scene = SCENES.find((s) => s.id === activeScene);
  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {scene ? `Scene ${scene.numeral} of 6 — ${scene.title}.` : ''}
    </p>
  );
};

/** "Scroll to begin" affordance, dismissed the moment the visitor does. */
const ScrollHint = () => {
  const setHasScrolled = useJourneyStore((s) => s.setHasScrolled);

  useEffect(() => {
    const onScroll = (): void => {
      if (window.scrollY > 24) setHasScrolled(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setHasScrolled]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[95] flex justify-center">
      <button
        type="button"
        onClick={() => {
          cue('click');
          goToScene('void');
        }}
        className="label-mono pointer-events-auto flex items-center gap-3 border border-[color:var(--al-line)] bg-[color:rgba(5,5,5,0.5)] px-4 py-3 text-[color:var(--al-text-muted)] backdrop-blur-sm transition-colors hover:border-[color:var(--al-line-strong)] hover:text-ivory"
      >
        Begin
        <span aria-hidden="true" className="inline-block h-3 w-px bg-current" />
      </button>
    </div>
  );
};

/** Used by the archive to deep-link into the film. */
export const jumpToScene = (id: SceneId, navigate: (path: string) => void): void => {
  navigate('/');
  window.setTimeout(() => {
    if (id === 'awakening') scrollToTop(true);
    else scrollToTarget(`[data-scene="${id}"]`, { offset: -2 });
  }, 240);
};

export const useJumpToScene = () => {
  const navigate = useNavigate();
  return (id: SceneId) => jumpToScene(id, navigate);
};

export default Home;
