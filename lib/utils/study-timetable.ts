/** Study timetable planning: distributes weekly subject hours across study days. */

export interface SubjectInput {
  name: string;
  hours: number;
  priority: number;
}

export interface TimetableConfig {
  subjects: SubjectInput[];
  days: string[];
  sessionMinutes: number;
  startHour: number;
  endHour: number;
}

export interface ScheduleEntry {
  day: string;
  subject: string;
  start: string;
  end: string;
  minutes: number;
}

export interface TimetableResult {
  rows: ScheduleEntry[];
  warnings: string[];
  totalMinutes: number;
  perDay: Record<string, number>;
}

const BREAK_MINUTES = 10;

export function validateTimetableConfig(config: TimetableConfig): string | null {
  const usable = config.subjects.filter((subject) => subject.name.trim() && subject.hours > 0);
  if (usable.length === 0) return "Add at least one subject with a name and weekly hours above zero.";
  if (config.days.length === 0) return "Choose at least one study day.";
  if (!Number.isFinite(config.sessionMinutes) || config.sessionMinutes < 10 || config.sessionMinutes > 480) {
    return "Session length must be between 10 and 480 minutes.";
  }
  if (
    !Number.isFinite(config.startHour) ||
    !Number.isFinite(config.endHour) ||
    config.startHour < 0 ||
    config.endHour > 24 ||
    config.endHour <= config.startHour
  ) {
    return "Choose an end time later than the start time, both between 0 and 24.";
  }
  return null;
}

function toClock(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

interface PendingSession {
  subject: string;
  minutes: number;
}

/** Builds a balanced weekly timetable from subject hours and available days. */
export function generateTimetable(config: TimetableConfig): TimetableResult {
  const subjects = config.subjects
    .filter((subject) => subject.name.trim() && subject.hours > 0)
    .slice()
    .sort((a, b) => b.priority - a.priority || b.hours - a.hours || a.name.localeCompare(b.name));

  const availableMinutes = Math.max(0, Math.floor((config.endHour - config.startHour) * 60));
  const used: Record<string, number> = {};
  const buckets: Record<string, PendingSession[]> = {};
  for (const day of config.days) {
    used[day] = 0;
    buckets[day] = [];
  }

  const warnings: string[] = [];
  let totalMinutes = 0;

  for (const subject of subjects) {
    let remaining = Math.round(subject.hours * 60);
    let guard = 0;
    while (remaining > 0 && guard < 500) {
      guard += 1;
      const day = config.days
        .slice()
        .sort((a, b) => used[a] - used[b] || config.days.indexOf(a) - config.days.indexOf(b))[0];
      const capacity = availableMinutes - used[day];
      if (capacity <= 0) break;
      const minutes = Math.min(config.sessionMinutes, remaining, capacity);
      buckets[day].push({ subject: subject.name.trim(), minutes });
      used[day] += minutes;
      remaining -= minutes;
      totalMinutes += minutes;
    }
    if (remaining > 0) {
      warnings.push(
        `Could not fit the last ${remaining} min of "${subject.name.trim()}". Add more days, widen the study window, or shorten sessions.`,
      );
    }
  }

  const rows: ScheduleEntry[] = [];
  for (const day of config.days) {
    let cursor = Math.round(config.startHour * 60);
    const sessions = buckets[day];
    sessions.forEach((session, index) => {
      const start = cursor;
      const end = start + session.minutes;
      rows.push({
        day,
        subject: session.subject,
        start: toClock(start),
        end: toClock(end),
        minutes: session.minutes,
      });
      cursor = end;
      if (index < sessions.length - 1) {
        const next = sessions[index + 1].minutes;
        if (cursor + BREAK_MINUTES + next <= Math.round(config.endHour * 60)) {
          cursor += BREAK_MINUTES;
        }
      }
    });
  }

  return { rows, warnings, totalMinutes, perDay: used };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Exports the timetable as CSV text. */
export function timetableToCsv(rows: ScheduleEntry[]): string {
  const header = ["Day", "Subject", "Start", "End", "Minutes"];
  const lines = rows.map((row) =>
    [row.day, row.subject, row.start, row.end, row.minutes].map(csvCell).join(","),
  );
  return [header.join(","), ...lines].join("\r\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Builds a self-contained HTML document suitable for a clean printout. */
export function timetableToHtml(rows: ScheduleEntry[], title: string): string {
  const byDay = new Map<string, ScheduleEntry[]>();
  for (const row of rows) {
    const list = byDay.get(row.day) ?? [];
    list.push(row);
    byDay.set(row.day, list);
  }
  const sections = Array.from(byDay.entries())
    .map(([day, entries]) => {
      const body = entries
        .map(
          (entry) =>
            `<tr><td>${escapeHtml(entry.start)}–${escapeHtml(entry.end)}</td><td>${escapeHtml(entry.subject)}</td><td>${entry.minutes} min</td></tr>`,
        )
        .join("");
      return `<h2>${escapeHtml(day)}</h2><table><thead><tr><th>Time</th><th>Subject</th><th>Length</th></tr></thead><tbody>${body}</tbody></table>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui,Arial,sans-serif;margin:32px;color:#111}h1{margin-bottom:4px}h2{margin-top:28px;font-size:18px}table{border-collapse:collapse;width:100%;max-width:720px}th,td{border:1px solid #ccc;padding:8px 10px;text-align:left}th{background:#f2f2f2}@media print{body{margin:16mm}}</style></head><body><h1>${escapeHtml(title)}</h1>${sections || "<p>No sessions to display.</p>"}</body></html>`;
}
