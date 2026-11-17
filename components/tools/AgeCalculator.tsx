"use client";

import { useState } from "react";
import { CalendarDays, Cake, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatNumber } from "@/lib/utils/format";

function toDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const DAY_MS = 86_400_000;

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function nextBirthday(birth: Date, reference: Date): { date: Date; days: number } {
  const todayUtc = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  );

  for (let year = reference.getUTCFullYear(); year <= reference.getUTCFullYear() + 1; year += 1) {
    const month = birth.getUTCMonth();
    let day = birth.getUTCDate();
    // February 29 in a non-leap year: use the common civil convention.
    if (month === 1 && day === 29 && daysInMonth(year, month) === 28) {
      day = 28;
    }
    const candidate = Date.UTC(year, month, day);
    if (candidate >= todayUtc) {
      return { date: new Date(candidate), days: Math.round((candidate - todayUtc) / DAY_MS) };
    }
  }

  // Unreachable for valid dates, but keeps the return type total.
  return { date: reference, days: 0 };
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    weeks: number;
    birthdayDays: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const birth = toDate(birthDate);
    const reference = referenceDate ? toDate(referenceDate) : new Date();

    if (!birth) {
      setError("Enter a valid date of birth.");
      return;
    }
    if (!reference) {
      setError("Enter a valid reference date.");
      return;
    }
    if (birth.getTime() > reference.getTime()) {
      setError("The date of birth must be on or before the reference date.");
      return;
    }

    let years = reference.getUTCFullYear() - birth.getUTCFullYear();
    let months = reference.getUTCMonth() - birth.getUTCMonth();
    let days = reference.getUTCDate() - birth.getUTCDate();

    if (days < 0) {
      months -= 1;
      const previousMonth =
        reference.getUTCMonth() === 0 ? 11 : reference.getUTCMonth() - 1;
      const previousYear =
        reference.getUTCMonth() === 0
          ? reference.getUTCFullYear() - 1
          : reference.getUTCFullYear();
      days += daysInMonth(previousYear, previousMonth);
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor(
      (Date.UTC(
        reference.getUTCFullYear(),
        reference.getUTCMonth(),
        reference.getUTCDate(),
      ) -
        Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate())) /
        DAY_MS,
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      weeks: Math.floor(totalDays / 7),
      birthdayDays: nextBirthday(birth, reference).days,
    });
  };

  const reset = () => {
    setBirthDate("");
    setReferenceDate("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Date of birth" htmlFor="age-birth">
          <Input
            id="age-birth"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            max={referenceDate || undefined}
          />
        </Field>
        <Field
          label="Reference date"
          htmlFor="age-reference"
          hint="Leave empty to use today."
        >
          <Input
            id="age-reference"
            type="date"
            value={referenceDate}
            onChange={(event) => setReferenceDate(event.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <CalendarDays className="size-4" aria-hidden="true" />
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
            Exact age
          </p>
          {result ? (
            <>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-accent">
                {result.years} y {result.months} m {result.days} d
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatNumber(result.totalDays)} days · {formatNumber(result.weeks)} weeks lived
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Your result will appear here.</p>
          )}
        </div>
        {result ? (
          <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-5">
            <Cake className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {result.birthdayDays === 0
                ? "Today is the birthday — happy birthday!"
                : `${result.birthdayDays} ${result.birthdayDays === 1 ? "day" : "days"} until the next birthday.`}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
