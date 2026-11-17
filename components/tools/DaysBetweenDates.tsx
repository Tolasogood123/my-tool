"use client";

import { useState } from "react";
import { CalendarRange, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatNumber } from "@/lib/utils/format";

const DAY_MS = 86_400_000;

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function toDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calendarBreakdown(start: Date, end: Date) {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = end.getUTCMonth() === 0 ? 11 : end.getUTCMonth() - 1;
    const previousYear =
      end.getUTCMonth() === 0 ? end.getUTCFullYear() - 1 : end.getUTCFullYear();
    days += daysInMonth(previousYear, previousMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function DaysBetweenDates() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [inclusive, setInclusive] = useState(false);
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    breakdown: { years: number; months: number; days: number };
    reversed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const from = toDate(start);
    const to = toDate(end);

    if (!from || !to) {
      setError("Choose both a start date and an end date.");
      return;
    }

    const utcFrom = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
    const utcTo = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
    const rawDays = (utcTo - utcFrom) / DAY_MS;
    const days = inclusive
      ? rawDays + (rawDays >= 0 ? 1 : -1)
      : rawDays;
    const earlier = new Date(Math.min(utcFrom, utcTo));
    const later = new Date(Math.max(utcFrom, utcTo));

    setResult({
      days,
      weeks: Math.trunc(days / 7),
      breakdown: calendarBreakdown(earlier, later),
      reversed: rawDays < 0,
    });
  };

  const reset = () => {
    setStart("");
    setEnd("");
    setInclusive(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date" htmlFor="dbd-start">
            <Input id="dbd-start" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
          </Field>
          <Field label="End date" htmlFor="dbd-end">
            <Input id="dbd-end" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
          </Field>
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={inclusive}
            onChange={(event) => setInclusive(event.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Count both the start and end day
        </label>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <CalendarRange className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check the dates" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface-muted p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            Total difference
          </p>
          {result ? (
            <>
              <p className="mt-3 text-4xl font-semibold text-accent">
                {formatNumber(result.days)} {Math.abs(result.days) === 1 ? "day" : "days"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatNumber(result.weeks)} {result.weeks === 1 ? "week" : "weeks"}
                {result.reversed ? " · end date is earlier" : ""}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Your result appears here.</p>
          )}
        </div>
        {result ? (
          <div className="rounded-card border border-border bg-surface p-5 text-center text-sm text-muted-foreground">
            Calendar breakdown: {result.breakdown.years} years, {result.breakdown.months} months, {result.breakdown.days} days
            {inclusive ? " (inclusive counting)" : ""}
          </div>
        ) : null}
      </div>
    </div>
  );
}
