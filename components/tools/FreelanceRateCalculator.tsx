"use client";

import { useState } from "react";
import { Briefcase, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  calculateFreelanceRate,
  DEFAULT_RATE_INPUTS,
  validateRateInputs,
  type RateInputs,
  type RateResult,
} from "@/lib/utils/freelance-rate";

export function FreelanceRateCalculator() {
  const [inputs, setInputs] = useState<RateInputs>(DEFAULT_RATE_INPUTS);
  const [result, setResult] = useState<RateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof RateInputs) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((current) => ({ ...current, [key]: Number(event.target.value) }));

  const calculate = () => {
    setError(null);
    const validation = validateRateInputs(inputs);
    if (validation) {
      setError(validation);
      setResult(null);
      return;
    }
    setResult(calculateFreelanceRate(inputs));
  };

  const reset = () => {
    setInputs(DEFAULT_RATE_INPUTS);
    setResult(null);
    setError(null);
  };

  const cards = result
    ? [
        { label: "Minimum hourly rate", value: `$${result.hourlyRate.toFixed(2)}/hr`, highlight: true },
        { label: "Day rate", value: `$${result.dayRate.toFixed(2)}/day` },
        { label: "Required annual revenue", value: `$${result.requiredRevenue.toLocaleString("en-US")}` },
        { label: "Monthly revenue target", value: `$${result.monthlyRevenue.toLocaleString("en-US")}` },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target take-home salary ($/yr)" htmlFor="rate-salary">
            <Input id="rate-salary" type="number" min={0} step="100" value={inputs.targetSalary} onChange={set("targetSalary")} />
          </Field>
          <Field label="Annual business expenses ($)" htmlFor="rate-expenses">
            <Input id="rate-expenses" type="number" min={0} step="100" value={inputs.annualExpenses} onChange={set("annualExpenses")} />
          </Field>
          <Field label="Billable hours per week" htmlFor="rate-hours-week">
            <Input id="rate-hours-week" type="number" min={0} step="0.5" value={inputs.billableHoursPerWeek} onChange={set("billableHoursPerWeek")} />
          </Field>
          <Field label="Billing hours per day" htmlFor="rate-hours-day">
            <Input id="rate-hours-day" type="number" min={0} step="0.5" value={inputs.hoursPerDay} onChange={set("hoursPerDay")} />
          </Field>
          <Field label="Weeks worked per year" htmlFor="rate-weeks">
            <Input id="rate-weeks" type="number" min={1} max={52} step="1" value={inputs.weeksPerYear} onChange={set("weeksPerYear")} />
          </Field>
          <Field label="Weeks off (holiday / sick)" htmlFor="rate-off">
            <Input id="rate-off" type="number" min={0} step="1" value={inputs.weeksOff} onChange={set("weeksOff")} />
          </Field>
          <Field label="Tax buffer (%)" htmlFor="rate-tax" hint="Extra revenue set aside for income tax.">
            <Input id="rate-tax" type="number" min={0} max={100} step="1" value={inputs.taxBufferPercent} onChange={set("taxBufferPercent")} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Briefcase className="size-4" aria-hidden="true" />
            Calculate rate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your figures" description={error} /> : null}
      </div>

      <div className="space-y-3">
        {cards.length > 0 ? cards.map((card) => (
          <div key={card.label} className={`rounded-card border p-5 ${card.highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"}`}>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</p>
          </div>
        )) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Your sustainable rates will appear here.</p>
          </div>
        )}
        {result ? (
          <p className="text-xs text-subtle-foreground">
            Based on {result.annualBillableHours.toLocaleString("en-US")} billable hours across {result.workingWeeks} working weeks, including a ${result.taxBuffer.toLocaleString("en-US")} tax buffer.
          </p>
        ) : null}
      </div>
    </div>
  );
}
