/** Pure helpers for building cron expressions, explaining them, and computing future run times. No external library. */

/** The five classic cron fields, in canonical order. */
export interface CronBuilder {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export const CRON_FIELD_KEYS: (keyof CronBuilder)[] = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

/** Preset tokens offered in the builder. The sentinel "__custom__" reveals a free-text input. */
export const CRON_FIELD_OPTIONS: Record<keyof CronBuilder, { label: string; value: string }[]> = {
  minute: [
    { label: "Every minute (*)", value: "*" },
    { label: "Every 5 minutes (*/5)", value: "*/5" },
    { label: "Every 10 minutes (*/10)", value: "*/10" },
    { label: "Every 15 minutes (*/15)", value: "*/15" },
    { label: "Every 30 minutes (*/30)", value: "*/30" },
    { label: "Top of the hour (0)", value: "0" },
    { label: "Custom…", value: "__custom__" },
  ],
  hour: [
    { label: "Every hour (*)", value: "*" },
    { label: "Every 2 hours (*/2)", value: "*/2" },
    { label: "Every 6 hours (*/6)", value: "*/6" },
    { label: "Midnight (0)", value: "0" },
    { label: "9 AM (9)", value: "9" },
    { label: "Business hours (9-17)", value: "9-17" },
    { label: "Custom…", value: "__custom__" },
  ],
  dayOfMonth: [
    { label: "Every day (*)", value: "*" },
    { label: "First of the month (1)", value: "1" },
    { label: "15th of the month (15)", value: "15" },
    { label: "Every 2 days (*/2)", value: "*/2" },
    { label: "1st and 15th (1,15)", value: "1,15" },
    { label: "Custom…", value: "__custom__" },
  ],
  month: [
    { label: "Every month (*)", value: "*" },
    { label: "January (1)", value: "1" },
    { label: "June (6)", value: "6" },
    { label: "Every 3 months (*/3)", value: "*/3" },
    { label: "Jan–Jun (1-6)", value: "1-6" },
    { label: "Custom…", value: "__custom__" },
  ],
  dayOfWeek: [
    { label: "Every day (*)", value: "*" },
    { label: "Monday (1)", value: "1" },
    { label: "Weekdays (1-5)", value: "1-5" },
    { label: "Weekends (0,6)", value: "0,6" },
    { label: "Every 2 days (*/2)", value: "*/2" },
    { label: "Custom…", value: "__custom__" },
  ],
};

export const DEFAULT_CRON_BUILDER: CronBuilder = {
  minute: "*/5",
  hour: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Joins the five builder fields into a single cron expression. */
export function buildExpression(fields: CronBuilder): string {
  return CRON_FIELD_KEYS.map((key) => fields[key].trim() || "*").join(" ");
}

/** Parses one cron field into the set of numeric values it allows, or null if malformed. */
function parseField(raw: string, min: number, max: number): Set<number> | null {
  const result = new Set<number>();
  for (const part of raw.split(",")) {
    const token = part.trim();
    if (!token) return null;

    if (token === "*") {
      for (let i = min; i <= max; i += 1) result.add(i);
      continue;
    }
    const stepAll = token.match(/^\*\/(\d+)$/);
    if (stepAll) {
      const step = Number(stepAll[1]);
      if (step < 1) return null;
      for (let i = min; i <= max; i += step) result.add(i);
      continue;
    }
    const rangeStep = token.match(/^(\d+)-(\d+)\/(\d+)$/);
    if (rangeStep) {
      const start = Number(rangeStep[1]);
      const end = Number(rangeStep[2]);
      const step = Number(rangeStep[3]);
      if (step < 1 || start < min || end > max || start > end) return null;
      for (let i = start; i <= end; i += step) result.add(i);
      continue;
    }
    const range = token.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < min || end > max || start > end) return null;
      for (let i = start; i <= end; i += 1) result.add(i);
      continue;
    }
    const valueStep = token.match(/^(\d+)\/(\d+)$/);
    if (valueStep) {
      const start = Number(valueStep[1]);
      const step = Number(valueStep[2]);
      if (step < 1 || start < min || start > max) return null;
      for (let i = start; i <= max; i += step) result.add(i);
      continue;
    }
    if (/^\d+$/.test(token)) {
      const value = Number(token);
      if (value < min || value > max) return null;
      result.add(value);
      continue;
    }
    return null;
  }
  return result.size > 0 ? result : null;
}

/** Returns a human-readable error message for an invalid expression, or null when valid. */
export function validateCronExpression(expression: string): string | null {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) {
    return "A cron expression needs exactly 5 fields: minute, hour, day of month, month, and day of week.";
  }
  const bounds: [number, number][] = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]];
  const names = ["minute", "hour", "day of month", "month", "day of week"];
  for (let i = 0; i < 5; i += 1) {
    if (!parseField(fields[i], bounds[i][0], bounds[i][1])) {
      return `The ${names[i]} field "${fields[i]}" is not valid.`;
    }
  }
  return null;
}

function describePart(
  raw: string,
  unit: string,
  labelFor: (value: number) => string,
): string {
  if (raw === "*") return `every ${unit}`;
  if (raw.startsWith("*/")) return `every ${raw.slice(2)} ${unit}s`;

  return raw.split(",").map((segment) => {
    const rangeStep = segment.match(/^(\d+)-(\d+)\/(\d+)$/);
    if (rangeStep) {
      return `${labelFor(Number(rangeStep[1]))} through ${labelFor(Number(rangeStep[2]))}, every ${rangeStep[3]} ${unit}s`;
    }
    const range = segment.match(/^(\d+)-(\d+)$/);
    if (range) {
      return `${labelFor(Number(range[1]))} through ${labelFor(Number(range[2]))}`;
    }
    const valueStep = segment.match(/^(\d+)\/(\d+)$/);
    if (valueStep) {
      return `every ${valueStep[2]} ${unit}s starting at ${labelFor(Number(valueStep[1]))}`;
    }
    if (/^\d+$/.test(segment)) return labelFor(Number(segment));
    return segment;
  }).join(", ");
}

/** Produces a plain-English breakdown of a valid expression. */
export function describeCron(expression: string): string {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return "Enter a valid 5-field cron expression to see its meaning.";
  const minute = describePart(fields[0], "minute", (n) => String(n));
  const hour = describePart(fields[1], "hour", (n) => String(n).padStart(2, "0"));
  const dayOfMonth = describePart(fields[2], "day", (n) => `day ${n}`);
  const month = describePart(fields[3], "month", (n) => MONTH_NAMES[n - 1] ?? String(n));
  const dayOfWeek = describePart(fields[4], "day of the week", (n) => DAY_NAMES[n % 7] ?? String(n));

  const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  return cap(`runs ${minute}, ${hour}, on ${dayOfMonth} of ${month}, on ${dayOfWeek}.`);
}

/**
 * Computes the next `count` local run times after `from` by walking the calendar
 * and jumping past whole months/days/hours that cannot match. No library required.
 */
export function getNextRuns(expression: string, count = 5, from: Date = new Date()): Date[] {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return [];

  const minutes = parseField(fields[0], 0, 59);
  const hours = parseField(fields[1], 0, 23);
  const doms = parseField(fields[2], 1, 31);
  const months = parseField(fields[3], 1, 12);
  const dowRaw = parseField(fields[4], 0, 7);
  if (!minutes || !hours || !doms || !months || !dowRaw) return [];

  // In cron both 0 and 7 mean Sunday.
  const dows = new Set<number>();
  for (const day of dowRaw) dows.add(day % 7);

  const domRestricted = fields[2] !== "*";
  const dowRestricted = fields[4] !== "*";

  const results: Date[] = [];
  const cursor = new Date(from.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 4 * 366 * 24 * 60; // roughly four years of minutes
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations += 1;

    if (!months.has(cursor.getMonth() + 1)) {
      cursor.setMonth(cursor.getMonth() + 1, 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    const domMatch = doms.has(cursor.getDate());
    const dowMatch = dows.has(cursor.getDay());
    let dayMatch: boolean;
    if (domRestricted && dowRestricted) dayMatch = domMatch || dowMatch;
    else if (domRestricted) dayMatch = domMatch;
    else if (dowRestricted) dayMatch = dowMatch;
    else dayMatch = true;

    if (!dayMatch) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    if (!hours.has(cursor.getHours())) {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
      continue;
    }

    if (!minutes.has(cursor.getMinutes())) {
      cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
      continue;
    }

    results.push(new Date(cursor.getTime()));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

/** Formats a run date consistently for display. */
export function formatRunDate(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
