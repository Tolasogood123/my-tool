/** Pure helpers for finding a shared working-hours window across time zones.
 *  Offsets are derived with Intl.DateTimeFormat from IANA zone names. */

import {
  formatOffset,
  getTimeZoneOffsetMs,
  isValidTimeZone,
  zoneLabel,
} from "@/lib/utils/time-zone";

export interface MeetingParticipant {
  timeZone: string;
  start: string; // "09:00" in the participant's local time
  end: string; // "17:00" in the participant's local time
}

export interface ParticipantWindow {
  timeZone: string;
  label: string;
  localRange: string;
  utcStart: Date;
  utcEnd: Date;
  utcRange: string;
}

export interface MeetingPlan {
  date: string;
  participants: ParticipantWindow[];
  overlap: {
    utcStart: Date;
    utcEnd: Date;
    minutes: number;
    localRanges: { timeZone: string; label: string; range: string }[];
  } | null;
}

const MINUTE = 60_000;

function parseMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function dateParts(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return { year, month, day };
}

/** Wall-clock minutes on a given date (including day carry) to a UTC instant. */
function wallToInstant(
  year: number,
  month: number,
  day: number,
  minutesOfDay: number,
  timeZone: string,
): Date {
  const base = Date.UTC(year, month - 1, day, 0, 0, 0) + minutesOfDay * MINUTE;
  let candidate = base;
  for (let pass = 0; pass < 4; pass += 1) {
    const offset = getTimeZoneOffsetMs(new Date(candidate), timeZone);
    const next = base - offset;
    if (next === candidate) break;
    candidate = next;
  }
  return new Date(candidate);
}

function formatUtc(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function formatLocal(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function minutesLabel(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

/** Finds the common working window for all participants on a calendar date. */
export function planMeeting(
  date: string,
  participants: MeetingParticipant[],
): { plan: MeetingPlan | null; error: string | null } {
  const parts = dateParts(date);
  if (!parts) return { plan: null, error: "Choose a valid meeting date." };
  if (participants.length < 2) {
    return { plan: null, error: "Add at least two participants to compare windows." };
  }
  if (participants.length > 12) {
    return { plan: null, error: "Compare at most 12 participants at a time." };
  }

  const windows: ParticipantWindow[] = [];
  for (const participant of participants) {
    if (!isValidTimeZone(participant.timeZone)) {
      return { plan: null, error: `Unknown time zone: ${participant.timeZone}.` };
    }
    const start = parseMinutes(participant.start);
    const end = parseMinutes(participant.end);
    if (start === null || end === null) {
      return { plan: null, error: "Enter each working window as HH:mm." };
    }
    if (end === start) {
      return { plan: null, error: "A working window's end time must differ from its start." };
    }
    const effectiveEnd = end > start ? end : end + 1440; // overnight shift carries to next day
    const utcStart = wallToInstant(parts.year, parts.month, parts.day, start, participant.timeZone);
    const utcEnd = wallToInstant(parts.year, parts.month, parts.day, effectiveEnd, participant.timeZone);
    if (utcEnd <= utcStart) {
      return { plan: null, error: "A working window must end after it begins." };
    }
    windows.push({
      timeZone: participant.timeZone,
      label: zoneLabel(participant.timeZone),
      localRange: `${participant.start}–${participant.end}${effectiveEnd > 1440 ? " (+1 day)" : ""}`,
      utcStart,
      utcEnd,
      utcRange: `${formatUtc(utcStart)} → ${formatUtc(utcEnd)}`,
    });
  }

  const latestStart = new Date(Math.max(...windows.map((item) => item.utcStart.getTime())));
  const earliestEnd = new Date(Math.min(...windows.map((item) => item.utcEnd.getTime())));
  const minutes = Math.round((earliestEnd.getTime() - latestStart.getTime()) / MINUTE);

  return {
    plan: {
      date,
      participants: windows,
      overlap:
        minutes > 0
          ? {
              utcStart: latestStart,
              utcEnd: earliestEnd,
              minutes,
              localRanges: windows.map((item) => ({
                timeZone: item.timeZone,
                label: item.label,
                range: `${formatLocal(latestStart, item.timeZone)} → ${formatLocal(earliestEnd, item.timeZone)}`,
              })),
            }
          : null,
    },
    error: null,
  };
}

/** Plain-text report of the plan, including a no-overlap explanation. */
export function formatMeetingReport(plan: MeetingPlan): string {
  const lines = [
    `Meeting date: ${plan.date}`,
    "",
    "Working windows (UTC):",
    ...plan.participants.map(
      (item) => `  • ${item.label} [${item.timeZone}] ${item.localRange} = ${item.utcRange} (${formatOffset(getTimeZoneOffsetMs(item.utcStart, item.timeZone))})`,
    ),
    "",
  ];
  if (plan.overlap) {
    lines.push(
      `Shared window: ${minutesLabel(plan.overlap.minutes)}`,
      `UTC: ${formatUtc(plan.overlap.utcStart)} → ${formatUtc(plan.overlap.utcEnd)}`,
      "",
      "Local times for the shared window:",
      ...plan.overlap.localRanges.map((item) => `  • ${item.label}: ${item.range}`),
    );
  } else {
    lines.push(
      "No shared working window on this date. The latest start is at or after the earliest end; try a different date or wider hours.",
    );
  }
  return lines.join("\n");
}
