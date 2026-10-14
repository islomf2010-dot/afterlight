import { TechLabel } from '@/components/ui/TechLabel';
import { Button } from '@/components/ui/Button';
import { capabilities } from '@/graphics/capabilitiesContext';

/**
 * CSS-only atmospheric backdrop.
 *
 * Used when WebGL is unavailable, when the context is lost, and underneath the
 * canvas while it warms up. Three slow radial gradients plus the shared grain
 * overlay are enough to keep the film legible and composed without a single
 * GPU draw call — the narrative is carried by type and negative space, so
 * losing the canvas costs atmosphere, not meaning.
 */
export const StaticBackdrop = ({ active = true }: { active?: boolean }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 108%, rgba(28,32,38,0.95) 0%, rgba(5,5,5,0) 62%), radial-gradient(70% 50% at 22% 18%, rgba(20,24,29,0.8) 0%, rgba(5,5,5,0) 70%), linear-gradient(180deg, #050505 0%, #08090b 55%, #050505 100%)',
      }}
    />
    {active ? (
      <div
        className="al-animated absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(40% 30% at 50% 46%, rgba(243,242,238,0.06) 0%, rgba(5,5,5,0) 65%)',
          animation: 'al-flicker 9s var(--al-ease-in-out) infinite',
        }}
      />
    ) : null}
    <div
      className="absolute inset-x-0 bottom-0 h-[38%] opacity-60"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.95) 92%)',
      }}
    />
  </div>
);

/**
 * Shown once when the film cannot use WebGL. Deliberately restrained: a single
 * line of explanation plus the two routes that still work. The film does not
 * apologise or block.
 */
export const WebGLFallbackNotice = () => (
  <div
    role="status"
    className="pointer-events-none absolute inset-x-0 top-[calc(var(--al-nav-h)+1.5rem)] z-20 mx-auto w-fit max-w-[min(34rem,92vw)]"
  >
    <div className="panel-surface flex flex-col items-start gap-3 p-4">
      <TechLabel tone="warn" dot>
        Static mode
      </TechLabel>
      <p className="text-sm leading-relaxed text-[color:var(--al-text-muted)]">
        This browser cannot open a WebGL context, so the film is playing as written frames. Every scene, the
        laboratory controls and the archive remain available.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="technical" size="sm" to="/archive">
          Read the log
        </Button>
        <Button variant="technical" size="sm" to="/lab">
          Laboratory
        </Button>
      </div>
      <p className="font-mono text-2xs text-[color:var(--al-text-ghost)]">
        renderer: {capabilities.renderer}
      </p>
    </div>
  </div>
);
