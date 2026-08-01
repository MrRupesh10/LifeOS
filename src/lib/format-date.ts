/**
 * Date formatting utilities.
 *
 * Deterministic, server-safe helpers — input is parsed as a plain
 * string (no `new Date()`), so output is identical on server and
 * client and never drifts by locale or timezone. This prevents the
 * hydration mismatches that locale-aware Date formatters cause.
 *
 * Use these anywhere a short, readable date is needed. For rich
 * formatting (relative time, calendars) add dedicated helpers here
 * rather than reaching for `new Date()` at call sites.
 */

const MONTHS_SHORT: readonly string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Parse an ISO string into its numeric year, month and day segments.
 * Returns null for malformed input.
 */
function parseIsoDate(iso: string): { m: number; d: number } | null {
  const dateStr = iso.split("T")[0] ?? "";
  const segments = dateStr.split("-").map(Number);
  const m = segments[1];
  const d = segments[2];
  if (typeof m !== "number" || typeof d !== "number") return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { m, d };
}

/** Format an ISO date/timestamp as "Jul 31". */
export function formatShortDate(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return `${MONTHS_SHORT[parsed.m - 1] ?? ""} ${parsed.d}`;
}

/** Format an ISO timestamp as "Jul 31 · 14:30". */
export function formatShortDateTime(iso: string): string {
  const [datePart, rawTime = ""] = iso.split("T");
  const parsed = datePart ? parseIsoDate(datePart) : null;
  if (!parsed) return iso;
  const hhmm = rawTime.slice(0, 5);
  const date = `${MONTHS_SHORT[parsed.m - 1] ?? ""} ${parsed.d}`;
  return hhmm ? `${date} · ${hhmm}` : date;
}

/** Split an ISO date into its short month label and numeric day. */
export function splitDate(iso: string): { month: string; day: number } {
  const parsed = parseIsoDate(iso);
  if (!parsed) return { month: "", day: 0 };
  return { month: MONTHS_SHORT[parsed.m - 1] ?? "", day: parsed.d };
}
