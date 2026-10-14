import { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHasCoarsePointer } from '@/hooks/useMediaQuery';
import { damp } from '@/utils/math';

/**
 * Custom cursor — fine pointers only.
 *
 * A single rAF loop writes two `transform: translate3d()` values. We never call
 * setState per frame; the "hovering an interactive element" state is derived
 * from event targets, and only flips a class. The native cursor is hidden only
 * while this component is mounted and the pointer is fine, and is restored on
 * unmount — so a crash or a disabled setting can never leave an invisible cursor.
 */
export const CustomCursor = () => {
  const enabled = useSettingsStore((s) => s.customCursor);
  const style = useSettingsStore((s) => s.cursorStyle);
  const coarse = useHasCoarsePointer();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ x: -100, y: -100, rx: -100, ry: -100, raf: 0 });

  const activeTargets = 'a, button, [role="button"], input, select, textarea, [data-cursor]';

  useEffect(() => {
    if (!enabled || coarse) {
      setVisible(false);
      return;
    }

    document.documentElement.dataset.customCursor = 'on';
    const s = state.current;

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') return;
      s.x = event.clientX;
      s.y = event.clientY;
      if (!visible) setVisible(true);

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest?.(activeTargets);
      setActive(Boolean(interactive));
      setLabel(interactive instanceof HTMLElement ? (interactive.dataset.cursor ?? null) : null);
    };

    const onLeave = (): void => setVisible(false);

    const loop = (): void => {
      s.raf = requestAnimationFrame(loop);
      s.rx = damp(s.rx, s.x, 22, 1 / 60);
      s.ry = damp(s.ry, s.y, 22, 1 / 60);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%)`;
      }
    };
    s.raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      delete document.documentElement.dataset.customCursor;
      if (dotRef.current) dotRef.current.style.transform = '';
      if (ringRef.current) ringRef.current.style.transform = '';
    };
  }, [enabled, coarse, visible, activeTargets]);

  if (!enabled || coarse) return null;

  const ringSize = active ? 44 : 26;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] hidden md:block">
      <div
        ref={dotRef}
        className={[
          'absolute left-0 top-0 rounded-full bg-ivory transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
          style === 'dot' ? 'h-[3px] w-[3px]' : 'h-[4px] w-[4px]',
        ].join(' ')}
      />
      <div
        ref={ringRef}
        className={[
          'absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,opacity,border-color] duration-300 ease-[var(--al-ease-out)]',
          visible ? 'opacity-100' : 'opacity-0',
          active
            ? 'border-[color:var(--al-silver)] bg-[color:rgba(243,242,238,0.06)]'
            : 'border-[color:var(--al-line-strong)]',
          style === 'crosshair'
            ? 'after:absolute after:h-px after:w-3 after:bg-[color:var(--al-line-strong)]'
            : '',
        ].join(' ')}
        style={{ width: ringSize, height: ringSize }}
      >
        {label ? (
          <span className="label-mono absolute whitespace-nowrap text-[0.5rem] text-ivory">{label}</span>
        ) : null}
      </div>
    </div>
  );
};
