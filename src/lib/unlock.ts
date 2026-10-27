/**
 * Birthday gate: 28 October 2026, 00:00:00 Asia/Kolkata (IST, UTC+5:30).
 * Stored as a UTC instant so every visitor unlocks at the same absolute moment.
 */
export const BIRTHDAY_UNLOCK_MS = Date.parse("2026-10-27T18:30:00.000Z");

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  unlocked: boolean;
};

export function remainingUntil(deadlineMs: number, nowMs: number): Remaining {
  const totalMs = Math.max(0, deadlineMs - nowMs);
  const unlocked = nowMs >= deadlineMs;
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalMs, unlocked };
}

/** Optional preview clock via ?preview=locked|unlocked or ?now=ISO-8601 */
export function readPreviewNow(search: string): number | null {
  const params = new URLSearchParams(search);
  const preview = params.get("preview");
  if (preview === "unlocked") return BIRTHDAY_UNLOCK_MS;
  if (preview === "locked") return BIRTHDAY_UNLOCK_MS - 90_000;
  const raw = params.get("now");
  if (!raw) return null;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function createClock(search = typeof window === "undefined" ? "" : window.location.search) {
  const pinned = readPreviewNow(search);
  return () => (pinned === null ? Date.now() : pinned);
}
