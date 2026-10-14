import { useEffect, useRef } from 'react';
import type { LabNotice } from '@/store/useLabStore';

export interface NoticeProps {
  notice: LabNotice | null;
  onDismiss: () => void;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. */
  timeout?: number;
}

/**
 * Transient status line for lab + settings feedback (import repairs, export
 * results, capture errors).
 *
 * Uses `role="status"` for success/info and `role="alert"` for errors, so
 * failures are announced immediately and confirmations politely.
 */
export const Notice = ({ notice, onDismiss, timeout = 6000 }: NoticeProps) => {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!notice || timeout <= 0) return;
    timer.current = window.setTimeout(onDismiss, timeout);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [notice, onDismiss, timeout]);

  if (!notice) return null;

  const isError = notice.kind === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={[
        'hairline flex items-start gap-3 bg-[color:var(--al-surface-raised)] p-3 text-2xs leading-relaxed',
        isError ? 'text-[color:var(--al-danger)]' : 'text-[color:var(--al-text-muted)]',
      ].join(' ')}
    >
      <span aria-hidden="true" className="label-mono mt-px shrink-0 opacity-70">
        {isError ? 'ERR' : notice.kind === 'success' ? 'OK' : '···'}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-mono normal-case tracking-normal text-[color:var(--al-text)]">{notice.message}</span>
        {notice.details?.length ? (
          <ul className="flex list-disc flex-col gap-0.5 pl-4 text-[color:var(--al-text-faint)]">
            {notice.details.slice(0, 5).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="label-mono shrink-0 px-1 text-[color:var(--al-text-faint)] transition-colors hover:text-ivory"
      >
        ✕
      </button>
    </div>
  );
};
