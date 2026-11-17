/** Pure helpers for a monthly content calendar and its CSV export. */

export interface CalendarPost {
  id: string;
  /** ISO day key, YYYY-MM-DD. */
  date: string;
  title: string;
  platform: string;
  time: string;
  notes: string;
}

export interface CalendarCell {
  /** ISO day key, or null for padding cells outside the current month. */
  date: string | null;
  day: number | null;
}

export const CALENDAR_PLATFORMS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "X / Twitter",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Other",
] as const;

export const CALENDAR_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Returns true only for a real calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));
}

/**
 * Builds a Monday-first grid for a month. Leading and trailing padding cells
 * use null so the caller can render blank squares without inventing dates.
 */
export function getMonthGrid(
  year: number,
  month: number,
  weekStartsOn = 1,
): CalendarCell[][] {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const offset = (firstWeekday - weekStartsOn + 7) % 7;
  const total = daysInMonth(year, month);
  const cells: CalendarCell[] = [];

  for (let i = 0; i < offset; i += 1) cells.push({ date: null, day: null });

  for (let day = 1; day <= total; day += 1) {
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      day,
    });
  }

  while (cells.length % 7 !== 0) cells.push({ date: null, day: null });

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/** Escapes one CSV field: quote it when it contains a comma, quote or newline. */
export function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function postsToCsv(posts: CalendarPost[]): string {
  const header = ["Date", "Title", "Platform", "Time", "Notes"];
  const rows = posts.map((post) =>
    [post.date, post.title, post.platform, post.time, post.notes]
      .map(csvEscape)
      .join(","),
  );
  return [header.join(","), ...rows].join("\r\n");
}

export function validatePost(input: Pick<CalendarPost, "date" | "title">): string | null {
  if (!isIsoDate(input.date)) return "Pick a valid date on the calendar.";
  const title = input.title.trim();
  if (!title) return "Give the post a title.";
  if (title.length > 200) return "Keep the title under 200 characters.";
  return null;
}
