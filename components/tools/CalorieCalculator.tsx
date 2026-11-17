"use client";

import { useState } from "react";
import { CheckSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateCalories,
  CALORIE_DISCLAIMER,
  formatCalorieReport,
} from "@/lib/utils/calorie";
import type { ActivityLevel, CalorieResult, Goal, Sex } from "@/lib/utils/calorie";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary — little or no exercise",
  light: "Light — 1–3 days/week",
  moderate: "Moderate — 3–5 days/week",
  active: "Active — 6–7 days/week",
  "very-active": "Very active — hard labour or twice-daily training",
};

export function CalorieCalculator() {
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateCalories({
      sex,
      age: Number(age),
      weightKg: Number(weight),
      heightCm: Number(height),
      activity,
      goal,
    });
    if (output.error || !output.result) {
      setError(output.error ?? "Could not estimate your calories.");
      return;
    }
    setResult(output.result);
    toast({ title: "Estimate calculated", variant: "success" });
  };

  const reset = () => {
    setSex("female");
    setAge("");
    setWeight("");
    setHeight("");
    setActivity("moderate");
    setGoal("maintain");
    setResult(null);
    setError(null);
  };

  const report = result ? formatCalorieReport(result) : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sex" htmlFor="cal-sex">
            <Select id="cal-sex" value={sex} onChange={(event) => setSex(event.target.value as Sex)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Select>
          </Field>
          <Field label="Age (years)" htmlFor="cal-age">
            <Input id="cal-age" type="number" min={15} max={100} value={age} onChange={(event) => setAge(event.target.value)} placeholder="30" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Weight (kg)" htmlFor="cal-weight">
            <Input id="cal-weight" type="number" min={25} max={300} step={0.1} value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="70" />
          </Field>
          <Field label="Height (cm)" htmlFor="cal-height">
            <Input id="cal-height" type="number" min={100} max={250} step={0.1} value={height} onChange={(event) => setHeight(event.target.value)} placeholder="170" />
          </Field>
        </div>

        <Field label="Activity level" htmlFor="cal-activity">
          <Select
            id="cal-activity"
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

        <Field label="Goal" htmlFor="cal-goal">
          <Select id="cal-goal" value={goal} onChange={(event) => setGoal(event.target.value as Goal)}>
            <option value="lose">Lose weight (≈500 kcal/day deficit)</option>
            <option value="maintain">Maintain weight</option>
            <option value="gain">Gain weight (≈500 kcal/day surplus)</option>
          </Select>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <CheckSquare className="size-4" aria-hidden="true" />
            Calculate calories
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your details" description={error} /> : null}

        <div className="rounded-card border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold">Estimate only — not medical advice</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{CALORIE_DISCLAIMER}</p>
        </div>
      </div>

      <div className="space-y-4">
        {result ? (
          <>
            <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                Estimated daily target
              </p>
              <p className="mt-3 text-4xl font-semibold text-accent">{result.target.toLocaleString()}</p>
              <p className="mt-2 text-sm text-muted-foreground">kcal per day</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {[
                ["BMR (resting)", `${result.bmr.toLocaleString()} kcal/day`],
                ["With activity (TDEE)", `${result.tdee.toLocaleString()} kcal/day`],
                ["Goal adjustment", `${result.adjustment > 0 ? "+" : ""}${result.adjustment} kcal/day`],
                ["Daily target", `${result.target.toLocaleString()} kcal/day`],
              ].map(([label, content]) => (
                <div key={label} className="rounded-control border border-border bg-surface p-4">
                  <dt className="text-xs text-subtle-foreground">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{content}</dd>
                </div>
              ))}
            </dl>
            <ToolOutput label="Calorie report" value={report} filename="calorie-estimate.txt" rows={8} />
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Enter your details to see a Mifflin-St Jeor BMR and an activity-adjusted daily target.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
