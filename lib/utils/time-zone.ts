/** Pure time-zone conversion helpers built entirely on Intl and IANA zone names.
 *  No offsets are hardcoded: every offset is derived from Intl.DateTimeFormat,
 *  which also keeps daylight-saving transitions correct. */

export interface ZonedTime {
  timeZone: string;
  label: string;
  abbreviation: string;
  dateTime: string;
  offset: string;
}

export interface TimeZoneConversion {
  instant: Date;
  iso: string;
  utc: string;
  sourceWallTime: string;
  zones: ZonedTime[];
  warning: string | null;
}

const FALLBACK_ZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

/** Returns all IANA zones the runtime knows about, with a safe fallback. */
export function getSupportedTimeZones(): string[] {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf;
  if (typeof supported === "function") {
    try {
      const zones = supported("timeZone");
      if (Array.isArray(zones) && zones.length > 0) return zones;
    } catch {
      /* fall through */
    }
  }
  return FALLBACK_ZONES;
}

/** Validates that a zone name is understood by this runtime. */
export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Human-readable label for an IANA zone id. */
export function zoneLabel(timeZone: string): string {
  if (timeZone === "UTC") return "UTC";
  const tail = timeZone.split("/").pop() ?? timeZone;
  return tail.replace(/_/g, " ");
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

interface WallParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function zonedParts(date: Date, timeZone: string): WallParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const values: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") values[part.type] = part.value;
  }
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour) % 24,
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

/** Offset of a zone at a given instant, in milliseconds, derived from Intl. */
export function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = zonedParts(date, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const wholeSecond = Math.floor(date.getTime() / 1000) * 1000;
  return asUtc - wholeSecond;
}

/** Formats a millisecond offset as UTC+05:30 style text. */
export function formatOffset(offsetMs: number): string {
  const sign = offsetMs < 0 ? "-" : "+";
  const absolute = Math.abs(offsetMs);
  const hours = Math.floor(absolute / 3_600_000);
  const minutes = Math.round((absolute % 3_600_000) / 60_000);
  return `UTC${sign}${pad(hours)}:${pad(minutes)}`;
}

/** Converts a wall-clock reading in one zone into the matching UTC instant.
 *  Iteration resolves the zone's offset, including DST, without hardcoded rules. */
function wallToInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = naive;
  for (let pass = 0; pass < 4; pass += 1) {
    const offset = getTimeZoneOffsetMs(new Date(candidate), timeZone);
    const next = naive - offset;
    if (next === candidate) break;
    candidate = next;
  }
  return new Date(candidate);
}

/** Parses a YYYY-MM-DD + HH:mm pair into validated numeric parts. */
export function parseWallTime(
  dateValue: string,
  timeValue: string,
): { parts: WallParts | null; error: string | null } {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue.trim());
  if (!dateMatch || !timeMatch) {
    return { parts: null, error: "Choose a valid date and 24-hour time (HH:mm)." };
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    return { parts: null, error: "That date or time is outside the supported range." };
  }

  const check = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return { parts: null, error: "That calendar date does not exist." };
  }
  return {
    parts: { year, month, day, hour, minute, second: 0 },
    error: null,
  };
}

function formatMoment(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function abbreviation(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? zoneLabel(timeZone);
}

/** Converts a wall time in a source zone to a set of target zones. */
export function convertTimeZone(
  dateValue: string,
  timeValue: string,
  sourceZone: string,
  targetZones: string[],
): { conversion: TimeZoneConversion | null; error: string | null } {
  if (!isValidTimeZone(sourceZone)) {
    return { conversion: null, error: "Choose a valid source time zone." };
  }
  const targets = Array.from(new Set(targetZones.filter(isValidTimeZone)));
  if (targets.length === 0) {
    return { conversion: null, error: "Add at least one target time zone." };
  }

  const { parts, error } = parseWallTime(dateValue, timeValue);
  if (!parts) return { conversion: null, error };

  const instant = wallToInstant(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    sourceZone,
  );

  const back = zonedParts(instant, sourceZone);
  const wallMatches =
    back.year === parts.year &&
    back.month === parts.month &&
    back.day === parts.day &&
    back.hour === parts.hour &&
    back.minute === parts.minute;

  const zones = targets.map<ZonedTime>((timeZone) => ({
    timeZone,
    label: zoneLabel(timeZone),
    abbreviation: abbreviation(instant, timeZone),
    dateTime: formatMoment(instant, timeZone),
    offset: formatOffset(getTimeZoneOffsetMs(instant, timeZone)),
  }));

  return {
    conversion: {
      instant,
      iso: instant.toISOString(),
      utc: formatMoment(instant, "UTC"),
      sourceWallTime: `${dateValue} ${timeValue} (${zoneLabel(sourceZone)})`,
      zones,
      warning: wallMatches
        ? null
        : "That wall clock time is ambiguous or does not exist on this date because of a daylight-saving change. It was interpreted with the offset in effect at the closest valid instant.",
    },
    error: null,
  };
}

/** Plain-text summary suitable for copying or downloading. */
export function formatTimeZoneReport(conversion: TimeZoneConversion): string {
  const lines = [
    `Source: ${conversion.sourceWallTime}`,
    `UTC instant: ${conversion.utc}`,
    `ISO 8601: ${conversion.iso}`,
    "",
    ...conversion.zones.map(
      (zone) => `${zone.label} [${zone.timeZone}] — ${zone.dateTime} ${zone.abbreviation} (${zone.offset})`,
    ),
  ];
  if (conversion.warning) lines.push("", `Note: ${conversion.warning}`);
  return lines.join("\n");
}
