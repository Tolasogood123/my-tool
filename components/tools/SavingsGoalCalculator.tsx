"use client";

import { useState } from "react";
import { RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  calculateSavingsGoal,
  formatDuration,
  validateSavingsInputs,
  type SavingsInputs,
  type SavingsResult,
} from "@/lib/utils/savings-goal";

export function SavingsGoalCalculator() {
  const [inputs, setInputs] = useState<SavingsInputs>({
    goal: 10000,
    current: 1000,
    monthlyContribution: 300,
    annualRatePercent: 0,
  });
  const [result, setResult] = useState<SavingsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof SavingsInputs) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((current) => ({ ...current, [key]: Number(event.target.value) }));

  const calculate = () => {
    setError(null);
    const validation = validateSavingsInputs(inputs);
    if (validation) {
      setError(validation);
      setResult(null);
      return;
    }
    setResult(calculateSavingsGoal(inputs));
  };

  const reset = () => {
    setInputs({ goal: 10000, current: 1000, monthlyContribution: 300, annualRatePercent: 0 });
    setResult(null);
    setError(null);
  };

  const cards = result
    ? [
        { label: "Time to goal", value: result.reachable ? formatDuration(result.months) : "Not reachable", highlight: true },
        { label: "Goal reached at", value: `$${result.finalBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}` },
        { label: "You contribute", value: `$${result.totalContributed.toLocaleString("en-US", { maximumFractionDigits: 2 })}` },
        { label: "Interest earned", value: `$${result.interestEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}` },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Savings goal ($)" htmlFor="savings-goal">
            <Input id="savings-goal" type="number" min={0} step="100" value={inputs.goal} onChange={set("goal")} />
          </Field>
          <Field label="Current savings ($)" htmlFor="savings-current">
            <Input id="savings-current" type="number" min={0} step="100" value={inputs.current} onChange={set("current")} />
          </Field>
          <Field label="Monthly contribution ($)" htmlFor="savings-monthly">
            <Input id="savings-monthly" type="number" min={0} step="50" value={inputs.monthlyContribution} onChange={set("monthlyContribution")} />
          </Field>
          <Field label="Expected annual return (%)" htmlFor="savings-rate" hint="Optional. Leave at 0 for a simple estimate.">
            <Input id="savings-rate" type="number" min={0} max={100} step="0.1" value={inputs.annualRatePercent} onChange={set("annualRatePercent")} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <TrendingUp className="size-4" aria-hidden="true" />
            Calculate timeline
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your numbers" description={error} /> : null}
        <p className="text-xs text-subtle-foreground">
          Projections assume deposits at the end of each month and a constant return. They are illustrative, not financial advice.
        </p>
      </div>

      <div className="space-y-3">
        {cards.length > 0 ? cards.map((card) => (
          <div key={card.label} className={`rounded-card border p-5 ${card.highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"}`}>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</p>
          </div>
        )) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Your savings timeline will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
