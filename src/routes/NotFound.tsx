import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TechLabel } from '@/components/ui/TechLabel';
import { SCENES } from '@/scenes/sceneManifest';

/**
 * 404.
 *
 * Shown for any unknown path, including an unknown laboratory study. It offers
 * the real routes rather than a dead end, and it names the path that failed —
 * which is the single most useful piece of information when a deep link breaks.
 */
export const NotFound = () => {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-[80dvh] w-full max-w-[52rem] flex-col justify-center gap-8 px-[var(--al-gutter)] py-24">
      <div className="flex flex-col gap-3">
        <TechLabel tone="warn">404 · No such frame</TechLabel>
        <h1 className="display-title text-2xl">Nothing was shot here.</h1>
        <p className="max-w-[var(--al-measure)] text-base leading-relaxed text-[color:var(--al-text-muted)]">
          <code className="font-mono text-[color:var(--al-text-faint)]">{location.pathname}</code> is not
          part of this film. It may have been renamed, or the link that brought you here may have been
          mistyped.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="md" to="/">
          Return to the film
        </Button>
        <Button variant="outline" size="md" to="/archive">
          Read the log
        </Button>
        <Button variant="outline" size="md" to="/lab">
          Laboratory
        </Button>
      </div>

      <div className="flex flex-col gap-3 border-t border-[color:var(--al-line)] pt-6">
        <TechLabel tone="muted">Or jump straight to a scene</TechLabel>
        <ul className="flex flex-wrap gap-2">
          {SCENES.filter((scene) => !scene.gated).map((scene) => (
            <li key={scene.id}>
              <Button variant="ghost" size="sm" to={`/#${scene.id}`}>
                {scene.numeral} · {scene.title}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotFound;
