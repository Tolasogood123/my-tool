/** Pure Unix timestamp conversion helpers (all calculations in the browser). */

export type TimestampUnit = "seconds" | "milliseconds";
export type TimestampMode = "to-date" | "to-timestamp";

export const MAX_ABSOLUTE_MS = 8.64e15;

export interface TimestampDetails {
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

function relativeTime(date: Date, now: number): string {
  const diff = date.getTime() - now;
  const absolute = Math.abs(diff);
  const units: [number, string][] = [
    [31_536_000_000, "year"],
    [2_592_000_000, "month"],
    [86_400_000, "day"],
    [3_600_000, "hour"],
    [60_000, "minute"],
    [1_000, "second"],
  ];

  for (const [size, label] of units) {
    if (absolute >= size) {
      const value = Math.floor(absolute / size);
      const plural = value === 1 ? label : `${label}s`;
      return diff >= 0 ? `in ${value} ${plural}` : `${value} ${plural} ago`;
    }
  }
  return "just now";
}

export function describeTimestamp(date: Date, now = Date.now()): TimestampDetails {
  const milliseconds = date.getTime();
  return {
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    relative: relativeTime(date, now),
  };
}

/** Converts a numeric timestamp string into a validated Date. */
export function timestampToDate(
  value: string,
  unit: TimestampUnit,
): { date: Date | null; error: string | null } {
  const trimmed = value.trim();
  if (!trimmed) return { date: null, error: "Enter a timestamp first." };
  if (!/^-?\d+(\.\d{1,3})?$/.test(trimmed)) {
    return { date: null, error: "Enter a valid number (up to 3 decimal places)." };
  }

  const numeric = Number(trimmed);
  const milliseconds = unit === "seconds" ? numeric * 1000 : numeric;
  if (!Number.isFinite(milliseconds) || Math.abs(milliseconds) > MAX_ABSOLUTE_MS) {
    return {
      date: null,
      error: "That timestamp is outside the supported date range (about ±275,760 years).",
    };
  }

  const date = new Date(Math.round(milliseconds));
  if (Number.isNaN(date.getTime())) {
    return { date: null, error: "That timestamp does not represent a valid date." };
  }
  return { date, error: null };
}

/** Converts a datetime-local value (or ISO string) into a timestamp. */
export function dateToTimestamp(
  value: string,
): { date: Date | null; error: string | null } {
  if (!value.trim()) return { date: null, error: "Choose a date and time first." };

  // datetime-local values have no timezone; the browser interprets them locally.
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: null, error: "That date is not valid. Try selecting it from the picker." };
  }
  if (Math.abs(date.getTime()) > MAX_ABSOLUTE_MS) {
    return { date: null, error: "That date is outside the supported timestamp range." };
  }
  return { date, error: null };
}

export function formatTimestampReport(details: TimestampDetails): string {
  return [
    `Unix seconds: ${details.seconds}`,
    `Unix milliseconds: ${details.milliseconds}`,
    `ISO 8601: ${details.iso}`,
    `UTC: ${details.utc}`,
    `Local: ${details.local}`,
    `Relative: ${details.relative}`,
  ].join("\n");
}
