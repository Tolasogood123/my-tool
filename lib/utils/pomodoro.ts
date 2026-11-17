/** Pure helpers for the Pomodoro timer. */

export type PomodoroMode = "focus" | "short" | "long";

export const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25,
  short: 5,
  long: 15,
};

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** After every fourth focus session, take the long break. */
export function nextMode(mode: PomodoroMode, completedFocus: number): PomodoroMode {
  if (mode !== "focus") return "focus";
  return completedFocus % 4 === 0 ? "long" : "short";
}

export function progressPercent(remaining: number, totalMinutes: number): number {
  const total = Math.max(1, totalMinutes * 60);
  return Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
}
