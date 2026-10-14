import { Link, useNavigate } from 'react-router-dom';

import { SCENES, type SceneId } from '@/scenes/sceneManifest';
import { Button } from '@/components/ui/Button';
import { TechLabel, SectionHeading } from '@/components/ui/TechLabel';
import { useJourneyStore } from '@/store/useJourneyStore';
import { scrollToTarget, scrollToTop } from '@/animation/smoothScroll';
import { cue } from '@/audio/engine';
import { formatDateStamp } from '@/utils/format';

/**
 * THE ARCHIVE.
 *
 * The written log of the film: every scene, its text, the technical state it
 * was left in, and a direct route back into that moment of the journey. This
 * page is also the canonical no-WebGL reading of the film, so it carries the
 * full narrative rather than a summary.
 */
export const Archive = () => {
  const visited = useJourneyStore((s) => s.visited);
  const navigate = useNavigate();

  const replayScene = (id: SceneId): void => {
    cue('click');
    navigate('/');
    // The film mounts asynchronously; wait for the section to exist.
    window.setTimeout(() => {
      if (id === 'awakening') scrollToTop(true);
      else scrollToTarget(`[data-scene="${id}"]`, { offset: -2 });
    }, 320);
  };

  return (
    <div className="relative mx-auto w-full max-w-[84rem] px-[var(--al-gutter)] pb-24 pt-[calc(var(--al-nav-h)+4rem)]">
      <SectionHeading
        numeral="03 / Archive"
        title="The log"
        lede="Six scenes, written down. This is the film without the film — everything the camera does, said in words."
      />

      <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-[color:var(--al-line)] py-4">
        <TechLabel tone="muted">Compiled {formatDateStamp(new Date())}</TechLabel>
        <TechLabel tone="live" dot>
          {visited.length} of {SCENES.length} scenes reached
        </TechLabel>
        <div className="ml-auto flex gap-2">
          <Button variant="technical" size="sm" onClick={() => replayScene('awakening')}>
            Replay from the beginning
          </Button>
          <Button variant="ghost" size="sm" to="/credits">
            Credits
          </Button>
        </div>
      </div>

      <ol className="mt-12 flex flex-col gap-px">
        {SCENES.map((scene) => (
          <li key={scene.id} className="border-b border-[color:var(--al-line)]">
            <article className="group grid gap-6 py-8 md:grid-cols-[10rem_minmax(0,1fr)_12rem]">
              <div className="flex flex-col gap-3">
                <TechLabel tone="muted">{scene.numeral}</TechLabel>
                <span aria-hidden="true" className="block h-px w-full bg-[color:var(--al-line)] md:w-16" />
                <ScenePlate id={scene.id} />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="display-title text-lg">{scene.title}</h2>
                  <TechLabel tone="muted">{scene.subtitle}</TechLabel>
                  {visited.includes(scene.id) ? (
                    <TechLabel tone="live" dot>
                      reached
                    </TechLabel>
                  ) : null}
                </div>
                <p className="max-w-[var(--al-measure)] text-base leading-relaxed text-[color:var(--al-text-muted)]">
                  {scene.log}
                </p>
                <TechLabel tone="muted">{scene.telemetry}</TechLabel>
              </div>

              <div className="flex flex-row items-start gap-2 md:flex-col">
                <Button variant="outline" size="sm" onClick={() => replayScene(scene.id)}>
                  Enter scene
                </Button>
                {scene.labRoute ? (
                  <Button variant="ghost" size="sm" to={scene.labRoute}>
                    Open in lab
                  </Button>
                ) : null}
                <Link
                  to={`/#${scene.id}`}
                  className="label-mono px-1 py-2 text-[color:var(--al-text-ghost)] underline decoration-dotted underline-offset-4 transition-colors hover:text-[color:var(--al-text-muted)]"
                >
                  permalink
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="panel-surface flex flex-col gap-3 p-6">
          <TechLabel tone="muted">Index</TechLabel>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-2xs text-[color:var(--al-text-muted)]">
            <Row label="Scenes" value="6" />
            <Row label="Render passes" value="1 per scene" />
            <Row label="External assets" value="none" />
            <Row label="Audio files" value="none (synthesised)" />
            <Row label="Typefaces" value="Space Grotesk · IBM Plex Mono" />
            <Row label="Licences" value="OFL 1.1" />
          </dl>
        </div>
        <div className="panel-surface flex flex-col gap-3 p-6">
          <TechLabel tone="muted">Navigation</TechLabel>
          <p className="text-sm leading-relaxed text-[color:var(--al-text-muted)]">
            The film keeps native scrolling. The scene rail in the lower left jumps between moments, and
            every scene above has a permalink you can send to someone.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="technical" size="sm" to="/lab">
              Laboratory
            </Button>
            <Button variant="technical" size="sm" to="/credits">
              Credits
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <>
    <dt className="label-mono text-[color:var(--al-text-faint)]">{label}</dt>
    <dd className="text-right text-[color:var(--al-text-muted)]">{value}</dd>
  </>
);

/**
 * A procedural "contact print" for each scene — a CSS-only composition in the
 * scene's own palette. It is not a screenshot (there is nothing to screenshot
 * before you have seen the scene) and it is not decoration: it gives each entry
 * a distinct visual anchor in a list.
 */
const ScenePlate = ({ id }: { id: SceneId }) => {
  const composition: Record<SceneId, string> = {
    awakening: 'radial-gradient(circle at 50% 50%, rgba(243,242,238,0.9) 0%, rgba(243,242,238,0) 4%), radial-gradient(circle at 50% 50%, rgba(191,197,202,0.18) 0%, rgba(191,197,202,0) 38%)',
    void: 'linear-gradient(180deg, #05070a 0%, #0d1218 62%, #05070a 100%), linear-gradient(90deg, transparent 46%, rgba(191,197,202,0.42) 46%, rgba(191,197,202,0.42) 54%, transparent 54%)',
    fracture: 'repeating-linear-gradient(74deg, rgba(191,197,202,0.16) 0 1px, transparent 1px 7px), radial-gradient(circle at 46% 52%, rgba(191,197,202,0.24) 0%, transparent 46%)',
    threshold: 'repeating-linear-gradient(90deg, rgba(191,197,202,0.2) 0 1px, transparent 1px 13px), radial-gradient(circle at 50% 50%, rgba(223,230,236,0.5) 0%, transparent 18%)',
    echoes: 'radial-gradient(circle at 28% 50%, rgba(191,197,202,0.2) 0 12%, transparent 13%), radial-gradient(circle at 62% 42%, rgba(191,197,202,0.16) 0 16%, transparent 17%), radial-gradient(circle at 84% 58%, rgba(223,230,236,0.24) 0 9%, transparent 10%)',
    afterlight: 'radial-gradient(circle at 50% 62%, rgba(223,230,236,0.32) 0%, rgba(223,230,236,0) 42%), radial-gradient(ellipse at 50% 100%, rgba(20,24,29,0.9), transparent 70%)',
  };

  return (
    <span
      aria-hidden="true"
      className="block aspect-[16/10] w-full max-w-[10rem] border border-[color:var(--al-line)] transition-transform duration-500 ease-[var(--al-ease-out)] group-hover:scale-[1.03]"
      style={{ background: composition[id], backgroundColor: '#050505' }}
    />
  );
};

export default Archive;
