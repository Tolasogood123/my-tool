/** Pure helpers for 90-minute sleep-cycle planning. Not medical advice. */

export const SLEEP_CYCLE_MINUTES = 90;
export const SLEEP_DISCLAIMER =
  "This is a general planning estimate based on average 90-minute sleep cycles. It is not medical advice. Sleep needs vary by person, and persistent sleep problems should be discussed with a qualified healthcare professional.";

export interface SleepOption {
  cycles: number;
  clock: string;
  duration: string;
}

export type SleepMode = "wake" | "bedtime";

function parseClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatClock(minutesOfDay: number): string {
  const wrapped = ((minutesOfDay % 1440) + 1440) % 1440;
  const hours24 = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
}

/** Returns bedtime options for a fixed wake time, one per cycle count. */
export function bedtimesForWake(
  wakeTime: string,
  minutesToFallAsleep: number,
  cycleCounts: number[],
): { options: SleepOption[]; error: string | null } {
  return buildOptions(wakeTime, minutesToFallAsleep, cycleCounts, "wake");
}

/** Returns wake-time options for a fixed bedtime, one per cycle count. */
export function wakeTimesForBedtime(
  bedtime: string,
  minutesToFallAsleep: number,
  cycleCounts: number[],
): { options: SleepOption[]; error: string | null } {
  return buildOptions(bedtime, minutesToFallAsleep, cycleCounts, "bedtime");
}

function buildOptions(
  time: string,
  minutesToFallAsleep: number,
  cycleCounts: number[],
  mode: SleepMode,
): { options: SleepOption[]; error: string | null } {
  const anchor = parseClock(time);
  if (anchor === null) return { options: [], error: "Enter a time as HH:mm (24-hour)." };
  if (!Number.isFinite(minutesToFallAsleep) || minutesToFallAsleep < 0 || minutesToFallAsleep > 120) {
    return { options: [], error: "Time to fall asleep must be between 0 and 120 minutes." };
  }

  const counts = (cycleCounts.length ? cycleCounts : [4, 5, 6])
    .filter((count) => Number.isInteger(count) && count >= 1 && count <= 10);
  if (counts.length === 0) {
    return { options: [], error: "Choose between 1 and 10 sleep cycles." };
  }

  const options = counts
    .slice()
    .sort((a, b) => a - b)
    .map<SleepOption>((cycles) => {
      const sleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
      const clock =
        mode === "wake"
          ? anchor - minutesToFallAsleep - sleepMinutes
          : anchor + minutesToFallAsleep + sleepMinutes;
      return {
        cycles,
        clock: formatClock(clock),
        duration: formatDuration(sleepMinutes),
      };
    });

  return { options, error: null };
}

/** Plain-text summary of the computed options. */
export function formatSleepReport(
  mode: SleepMode,
  anchor: string,
  options: SleepOption[],
): string {
  const heading =
    mode === "wake"
      ? `Wake time: ${anchor} — suggested bedtimes`
      : `Bedtime: ${anchor} — suggested wake times`;
  return [
    heading,
    ...options.map(
      (option) =>
        `  ${option.cycles} ${option.cycles === 1 ? "cycle" : "cycles"} (${option.duration}): ${option.clock}`,
    ),
    "",
    SLEEP_DISCLAIMER,
  ].join("\n");
}
