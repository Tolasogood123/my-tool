"use client";

import { useState } from "react";
import { HeartPulse, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  BMI_DISCLAIMER,
  calculateBmi,
  feetAndInchesToInches,
  type BmiResult,
  type BmiSystem,
} from "@/lib/utils/bmi";

export function BmiCalculator() {
  const [system, setSystem] = useState<BmiSystem>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    try {
      if (system === "metric") {
        setResult(calculateBmi(Number(weight), Number(height), "metric"));
      } else {
        const totalInches = feetAndInchesToInches(Number(feet), Number(inches));
        setResult(calculateBmi(Number(weight), totalInches, "imperial"));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Check your measurements.");
    }
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setFeet("");
    setInches("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Measurement system" htmlFor="bmi-system">
          <Select
            id="bmi-system"
            value={system}
            onChange={(event) => {
              setSystem(event.target.value as BmiSystem);
              setResult(null);
              setError(null);
            }}
          >
            <option value="metric">Metric (kg, meters)</option>
            <option value="imperial">Imperial (lb, feet/inches)</option>
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={system === "metric" ? "Weight (kg)" : "Weight (lb)"} htmlFor="bmi-weight">
            <Input
              id="bmi-weight"
              type="number"
              min={0}
              step="0.1"
              inputMode="decimal"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder={system === "metric" ? "70" : "154"}
            />
          </Field>
          {system === "metric" ? (
            <Field label="Height (m)" htmlFor="bmi-height" hint="For example 1.75">
              <Input
                id="bmi-height"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                placeholder="1.75"
              />
            </Field>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (ft)" htmlFor="bmi-feet">
                <Input id="bmi-feet" type="number" min={0} step="1" inputMode="numeric" value={feet} onChange={(event) => setFeet(event.target.value)} placeholder="5" />
              </Field>
              <Field label="Height (in)" htmlFor="bmi-inches">
                <Input id="bmi-inches" type="number" min={0} step="1" inputMode="numeric" value={inches} onChange={(event) => setInches(event.target.value)} placeholder="9" />
              </Field>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <HeartPulse className="size-4" aria-hidden="true" />
            Calculate BMI
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your measurements" description={error} /> : null}
        <p className="text-xs text-subtle-foreground">{BMI_DISCLAIMER}</p>
      </div>

      <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-border bg-surface p-6 text-center">
        {result ? (
          <>
            <p className="text-sm text-muted-foreground">Your BMI</p>
            <p className="mt-2 text-5xl font-semibold tabular-nums">{result.value.toFixed(1)}</p>
            <p className="mt-3 rounded-full bg-surface-muted px-4 py-1.5 text-sm font-medium">
              {result.category.label} <span className="text-muted-foreground">({result.category.range})</span>
            </p>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              A healthy weight for your height is roughly{" "}
              <strong className="text-foreground">{result.healthyWeightMin.toFixed(1)}–{result.healthyWeightMax.toFixed(1)} {result.system === "metric" ? "kg" : "lb"}</strong>.
            </p>
          </>
        ) : (
          <p className="max-w-xs text-sm text-muted-foreground">
            Enter your weight and height to calculate your Body Mass Index.
          </p>
        )}
      </div>
    </div>
  );
}
