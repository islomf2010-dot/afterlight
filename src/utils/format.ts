/** Formatting helpers for technical readouts and metadata. */

export const pad = (value: number, length = 2): string =>
  Math.abs(Math.floor(value)).toString().padStart(length, '0');

export const formatInt = (value: number): string => Math.round(value).toLocaleString('en-US');

export const formatFixed = (value: number, decimals = 2): string =>
  Number.isFinite(value) ? value.toFixed(decimals) : '—';
/** Astronomical-ish coordinate readout: -00.0000 / +12.3456 */
export const formatCoordinate = (value: number, decimals = 4): string =>
  `${value < 0 ? '-' : '+'}${Math.abs(value).toFixed(decimals)}`;

export const formatClock = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${pad(total / 60)}:${pad(total % 60)}`;
};

export const formatDateStamp = (date: Date): string =>
  `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())} · ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())} UTC`;
