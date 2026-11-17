"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateWaterIntake,
  formatWaterReport,
  WATER_DISCLAIMER,
} from "@/lib/utils/water-intake";
import type { ActivityLevel, WaterResult } from "@/lib/utils/water-intake";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary — desk work",
  light: "Light — occasional movement",
  moderate: "Moderate — regular exercise",
  active: "Active — most days training",
  "very-active": "Very active — physical job or twice-daily training",
};

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [exercise, setExercise] = useState("30");
  const [hotClimate, setHotClimate] = useState(false);
  const [result, setResult] = useState<WaterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateWaterIntake({
      weightKg: Number(weight),
      activity,
      exerciseMinutes: Number(exercise),
      hotClimate,
    });
    if (output.error || !output.result) {
      setError(output.error ?? "Could not estimate your fluid target.");
      return;
    }
    setResult(output.result);
    toast({ title: "Fluid target estimated", variant: "success" });
  };

  const reset = () => {
    setWeight("");
    setActivity("moderate");
    setExercise("30");
    setHotClimate(false);
    setResult(null);
    setError(null);
  };

  const report = result ? formatWaterReport(result) : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Weight (kg)" htmlFor="water-weight">
          <Input id="water-weight" type="number" min={25} max={300} step={0.1} value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="70" />
        </Field>

        <Field label="Activity level" htmlFor="water-activity">
          <Select
            id="water-activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value as ActivityLevel)}
          >
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
              <option key={key} value={key}>
                {ACTIVITY_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Exercise today (minutes)" htmlFor="water-exercise">
          <Input id="water-exercise" type="number" min={0} max={600} step={5} value={exercise} onChange={(event) => setExercise(event.target.value)} />
        </Field>

        <Field label="Environment" htmlFor="water-climate">
          <label className="flex items-center gap-2 text-sm" htmlFor="water-climate">
            <input
              id="water-climate"
              type="checkbox"
              checked={hotClimate}
              onChange={(event) => setHotClimate(event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Hot climate or heavy sweating (adds 500 ml)
          </label>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Calculator className="size-4" aria-hidden="true" />
            Calculate water intake
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your details" description={error} /> : null}

        <div className="rounded-card border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold">Estimate only — not medical advice</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{WATER_DISCLAIMER}</p>
        </div>
      </div>

      <div className="space-y-4">
        {result ? (
          <>
            <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                Estimated daily fluid target
              </p>
              <p className="mt-3 text-4xl font-semibold text-accent">{result.liters} L</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {result.totalMl.toLocaleString()} ml · about {result.cups} cups (250 ml each)
              </p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-3">
              {[
                ["Baseline", `${result.baseMl} ml`],
                ["Activity", `${result.activityMl} ml`],
                ["Climate", `${result.climateMl} ml`],
              ].map(([label, content]) => (
                <div key={label} className="rounded-control border border-border bg-surface p-4">
                  <dt className="text-xs text-subtle-foreground">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{content}</dd>
                </div>
              ))}
            </dl>
            <ToolOutput label="Water intake report" value={report} filename="water-intake.txt" rows={8} />
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Enter your weight and activity to get a simple daily fluid estimate in litres and cups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
