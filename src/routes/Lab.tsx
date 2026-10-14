import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { LabCanvas } from '@/components/lab/LabCanvas';
import { EffectControls } from '@/components/lab/EffectControls';
import { Button } from '@/components/ui/Button';
import { TechLabel, SectionHeading } from '@/components/ui/TechLabel';
import { StaticBackdrop } from '@/components/fallback/WebGLFallback';
import { useLabStore, type ExhibitId } from '@/store/useLabStore';
import { capabilities } from '@/graphics/capabilitiesContext';
import { SCENE_IDS } from '@/scenes/sceneManifest';

interface StudyMeta {
  id: ExhibitId;
  numeral: string;
  title: string;
  summary: string;
  /** Which controls actually affect this study, stated plainly. */
  affects: string;
}

export const STUDIES: readonly StudyMeta[] = [
  {
    id: 'particles',
    numeral: 'I',
    title: 'Particle field',
    summary:
      'A seeded point cloud with a pointer displacement field. Positions are generated once on the CPU and animated entirely in the vertex shader, so the field costs one draw call at any count.',
    affects: 'Count, distortion, pointer influence and speed all act directly on the field.',
  },
  {
    id: 'shaders',
    numeral: 'II',
    title: 'Domain warp',
    summary:
      'A two-stage simplex domain warp over a generated source image — horizon, monolith, star field. Chromatic separation scales with the warp, and the pointer applies a local lens rather than a translation.',
    affects: 'Distortion drives the warp amplitude and the aberration; pointer influence sets the lens.',
  },
  {
    id: 'portal',
    numeral: 'III',
    title: 'Refractive aperture',
    summary:
      'A lens that refracts a procedurally generated field: polar interference rings, a domain-warped core, and a rim whose edge bends light most. It reads as glass without a render target.',
    affects: 'Pointer influence opens the aperture and drags the lens; distortion and speed drive the interior.',
  },
] as const;

const isExhibit = (value: string | undefined): value is ExhibitId =>
  value === 'particles' || value === 'shaders' || value === 'portal';

/**
 * THE LABORATORY — `/lab` and `/lab/:study`.
 *
 * One route with a parameter rather than three near-identical pages: the
 * viewport, the control surface and the transport are identical, so duplicating
 * them would guarantee drift.
 */
export const Lab = () => {
  const params = useParams<{ study?: string }>();
  const setFocus = useLabStore((s) => s.setFocus);

  const raw = params.study;
  const exhibit: ExhibitId = isExhibit(raw) ? raw : 'particles';

  // Keep the shared focus mirror in sync so the film and the lab agree.
  useEffect(() => {
    setFocus(exhibit);
  }, [exhibit, setFocus]);

  // An unknown study name is a genuine 404, not a silent redirect to the hub.
  if (raw !== undefined && !isExhibit(raw)) {
    return <Navigate to="/404" replace />;
  }

  const study = STUDIES.find((s) => s.id === exhibit) ?? STUDIES[0];
  const webgl = capabilities.webgl;

  return (
    <div className="relative min-h-dvh">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-x-0 bottom-0 top-[var(--al-nav-h)]">
          {webgl ? (
            <LabCanvas exhibit={exhibit} />
          ) : (
            <StaticBackdrop />
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[92rem] px-[var(--al-gutter)] pb-16 pt-[calc(var(--al-nav-h)+3rem)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* --- Left column: heading, study switcher, notes ------------------ */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              numeral="02 / Laboratory"
              title="Studies"
              lede="Three effects taken from the film and left running. Every parameter is exposed, validated and saved; nothing here is decorative."
            />

            <nav aria-label="Studies" className="flex flex-wrap gap-2">
              {STUDIES.map((entry) => (
                <Button
                  key={entry.id}
                  variant={entry.id === exhibit ? 'outline' : 'ghost'}
                  size="md"
                  to={`/lab/${entry.id}`}
                  aria-current={entry.id === exhibit ? 'page' : undefined}
                >
                  {entry.numeral} · {entry.title}
                </Button>
              ))}
            </nav>

            <article className="panel-surface flex max-w-[42rem] flex-col gap-4 p-6">
              <div className="flex items-baseline gap-4">
                <TechLabel tone="muted">Study {study.numeral}</TechLabel>
                <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--al-line)]" />
              </div>
              <h2 className="display-title text-lg">{study.title}</h2>
              <p className="text-base leading-relaxed text-[color:var(--al-text-muted)]">{study.summary}</p>
              <p className="text-sm leading-relaxed text-[color:var(--al-text-faint)]">{study.affects}</p>
            </article>

            <section className="flex max-w-[42rem] flex-col gap-3">
              <TechLabel tone="muted">Also in the film</TechLabel>
              <ul className="flex flex-wrap gap-2">
                {SCENE_IDS.filter((id) => id !== 'awakening').map((id) => (
                  <li key={id}>
                    <Link
                      to={`/#${id}`}
                      className="label-mono inline-flex h-[var(--al-control-sm)] items-center border border-[color:var(--al-line)] px-3 text-[color:var(--al-text-faint)] transition-colors hover:border-[color:var(--al-line-strong)] hover:text-ivory"
                    >
                      {id}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-2xs leading-relaxed text-[color:var(--al-text-quiet)]">
                Particle count, distortion, pointer influence, fog and bloom are shared between the film
                and the laboratory — change one here and the film changes too.
              </p>
            </section>
          </div>

          {/* --- Right column: the control surface ---------------------------- */}
          <aside className="lg:sticky lg:top-[calc(var(--al-nav-h)+1.5rem)] lg:self-start">
            <EffectControls />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Lab;
