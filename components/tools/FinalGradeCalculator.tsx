"use client";

import { useState } from "react";
import { GraduationCap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";

export function FinalGradeCalculator() {
  const [current, setCurrent] = useState("");
  const [weight, setWeight] = useState("30");
  const [target, setTarget] = useState("85");
  const [result, setResult] = useState<{ needed: number; impossible: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const currentValue = Number(current);
    const remaining = Number(weight);
    const goal = Number(target);

    if ([currentValue, remaining, goal].some((value) => !Number.isFinite(value))) {
      setError("Enter numbers in all three fields.");
      return;
    }
    if (currentValue < 0 || currentValue > 100 || goal < 0 || goal > 100) {
      setError("Current grade and target grade must be between 0 and 100.");
      return;
    }
    if (remaining <= 0 || remaining > 100) {
      setError("The remaining weight must be greater than 0 and at most 100.");
      return;
    }

    const completedWeight = 1 - remaining / 100;
    const needed = (goal - completedWeight * currentValue) / (remaining / 100);
    setResult({ needed, impossible: needed > 100 });
  };

  const reset = () => {
    setCurrent("");
    setWeight("30");
    setTarget("85");
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Current weighted grade (%)" htmlFor="fg-current" hint="Your average for all work already graded, excluding the final.">
          <Input id="fg-current" type="number" min={0} max={100} step="0.1" inputMode="decimal" value={current} onChange={(event) => setCurrent(event.target.value)} placeholder="82" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Remaining work weight (%)" htmlFor="fg-weight">
            <Input id="fg-weight" type="number" min={0.1} max={100} step="0.1" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} />
          </Field>
          <Field label="Target course grade (%)" htmlFor="fg-target">
            <Input id="fg-target" type="number" min={0} max={100} step="0.1" inputMode="decimal" value={target} onChange={(event) => setTarget(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <GraduationCap className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your grades" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface-muted p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            Grade needed on remaining work
          </p>
          {result ? (
            result.impossible ? (
              <>
                <p className="mt-4 text-3xl font-semibold text-danger">Not achievable</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  You would need {result.needed.toFixed(1)}%, which is above 100%. Lower the target or check your current grade.
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-4xl font-semibold text-accent">
                  {result.needed <= 0 ? "0%" : `${Math.max(0, result.needed).toFixed(1)}%`}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {result.needed <= 0
                    ? "Your current grade already meets the target."
                    : "You need at least this percentage to reach your target."}
                </p>
              </>
            )
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">The required grade appears here.</p>
          )}
        </div>
        {current && weight && target ? (
          <p className="rounded-control border border-border bg-surface p-4 font-mono text-xs leading-6 text-muted-foreground">
            needed = (target − (1 − weight ÷ 100) × current) ÷ (weight ÷ 100)
          </p>
        ) : null}
      </div>
    </div>
  );
}
