import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TechLabel } from '@/components/ui/TechLabel';
import { useFocusTrap, useScrollLock } from '@/hooks/useFocusTrap';
import { useJourneyStore } from '@/store/useJourneyStore';

export interface NavItem {
  to: string;
  label: string;
  index: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Film', index: '01' },
  { to: '/lab', label: 'Laboratory', index: '02' },
  { to: '/archive', label: 'Archive', index: '03' },
  { to: '/credits', label: 'Credits', index: '04' },
] as const;

export const SkipLink = () => (
  <a
    href="#main"
    className={[
      'label-mono fixed left-4 top-4 z-[120] -translate-y-24 bg-ivory px-4 py-3 text-obsidian',
      'transition-transform duration-200 ease-[var(--al-ease-out)] focus:translate-y-0',
    ].join(' ')}
  >
    Skip to content
  </a>
);

export interface NavigationProps {
  /** Sound toggle is only meaningful where audio can exist. */
  onToggleSound: () => void;
  soundEnabled: boolean;
  onOpenSettings: () => void;
  /** Hidden entirely during the intro gate so the film opens on black. */
  visible: boolean;
}

export const Navigation = ({
  onToggleSound,
  soundEnabled,
  onOpenSettings,
  visible,
}: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const transition = useJourneyStore((s) => s.transition);

  useScrollLock(menuOpen);
  useFocusTrap(drawerRef, menuOpen);

  // Close the drawer on navigation — otherwise the overlay covers the new page.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    [
      'label-mono relative flex items-baseline gap-2 py-2 transition-colors duration-200',
      isActive ? 'text-ivory' : 'text-[color:var(--al-text-faint)] hover:text-ivory',
    ].join(' ');

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-[100] transition-opacity duration-700 ease-[var(--al-ease-out)]',
          visible && transition === 'idle' ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!visible || undefined}
      >
        <div className="flex h-[var(--al-nav-h)] items-center justify-between gap-6 px-[var(--al-gutter)]">
          <NavLink
            to="/"
            className="group flex items-baseline gap-3"
            aria-label="AFTERLIGHT — return to the beginning of the film"
          >
            <span className="display-title text-md transition-colors group-hover:text-silver">
              AFTERLIGHT
            </span>
            <span className="label-mono hidden text-[color:var(--al-text-ghost)] md:inline">
              The World Between Frames
            </span>
          </NavLink>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className="text-[0.5625rem] opacity-50">{item.index}</span>
                    <span>{item.label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-px left-0 h-px w-full bg-[color:var(--al-silver)]"
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <TechLabel dot tone={soundEnabled ? 'live' : 'muted'} className="hidden lg:inline-flex">
              {soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}
            </TechLabel>

            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundEnabled}
              className="label-mono hidden h-9 items-center gap-2 border border-[color:var(--al-line)] px-3 text-[color:var(--al-text-muted)] transition-colors hover:border-[color:var(--al-line-strong)] hover:text-ivory sm:inline-flex"
            >
              {soundEnabled ? 'SOUND ON' : 'SOUND OFF'}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              aria-label="Open settings"
              className="hidden sm:inline-flex"
            >
              Settings
            </Button>

            <button
              type="button"
              className="label-mono inline-flex h-9 items-center border border-[color:var(--al-line)] px-3 text-ivory md:hidden"
              aria-expanded={menuOpen}
              aria-controls="al-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="h-px w-full bg-[color:var(--al-line)]" />
      </header>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[110] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[color:rgba(5,5,5,0.86)] backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="al-mobile-nav"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-x-0 top-0 flex flex-col gap-2 border-b border-[color:var(--al-line)] bg-obsidian p-[var(--al-gutter)] pt-[calc(var(--al-gutter)+1rem)]"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className="text-[0.5625rem] opacity-50">{item.index}</span>
                    <span className="text-sm">{item.label}</span>
                    {isActive ? <span className="ml-auto text-2xs opacity-60">●</span> : null}
                  </>
                )}
              </NavLink>
            ))}
            <div className="mt-3 flex gap-2 border-t border-[color:var(--al-line)] pt-4">
              <Button variant="technical" size="sm" onClick={onToggleSound} aria-pressed={soundEnabled}>
                Sound {soundEnabled ? 'On' : 'Off'}
              </Button>
              <Button variant="technical" size="sm" onClick={onOpenSettings}>
                Settings
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
