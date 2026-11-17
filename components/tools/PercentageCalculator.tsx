"use client";

import { useState } from "react";
import { Percent, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";

type Mode = "of" | "is" | "change";

const labels: Record<Mode, [string, string]> = {
  of: ["Percentage (%)", "Of number (Y)"],
  is: ["Value (X)", "Total (Y)"],
  change: ["Old value", "New value"],
};

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [result, setResult] = useState("");
  const [formula, setFormula] = useState("");
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult("");
    setFormula("");

    if (first.trim() === "" || second.trim() === "") {
      setError("Enter both numbers before calculating.");
      return;
    }

    const a = Number(first);
    const b = Number(second);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setError("Both fields must contain valid numbers.");
      return;
    }

    if (mode === "of") {
      setResult(`${((a / 100) * b).toLocaleString("en-US", { maximumFractionDigits: 6 })}`);
      setFormula(`(${a} ÷ 100) × ${b} = ${((a / 100) * b).toLocaleString("en-US", { maximumFractionDigits: 6 })}`);
    } else if (mode === "is") {
      if (b === 0) {
        setError("The total cannot be zero when finding a percentage.");
        return;
      }
      const percent = (a / b) * 100;
      setResult(`${percent.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`);
      setFormula(`(${a} ÷ ${b}) × 100 = ${percent.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`);
    } else {
      if (a === 0) {
        setError("The old value cannot be zero when calculating percent change.");
        return;
      }
      const change = ((b - a) / a) * 100;
      setResult(`${change.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`);
      setFormula(`(${b} − ${a}) ÷ ${a} × 100 = ${change.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`);
    }
  };

  const reset = () => {
    setFirst("");
    setSecond("");
    setResult("");
    setFormula("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Question type" htmlFor="percent-mode">
          <Select
            id="percent-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              setError(null);
              setResult("");
              setFormula("");
            }}
          >
            <option value="of">What is X% of Y?</option>
            <option value="is">X is what % of Y?</option>
            <option value="change">Percent increase / decrease</option>
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={labels[mode][0]} htmlFor="percent-a">
            <Input
              id="percent-a"
              type="number"
              inputMode="decimal"
              value={first}
              onChange={(event) => setFirst(event.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label={labels[mode][1]} htmlFor="percent-b">
            <Input
              id="percent-b"
              type="number"
              inputMode="decimal"
              value={second}
              onChange={(event) => setSecond(event.target.value)}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Percent className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your numbers" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-card border border-border bg-surface-muted p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            Result
          </p>
          <p className="mt-3 break-all text-4xl font-semibold tracking-tight text-accent">
            {result || "—"}
          </p>
          {formula ? (
            <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
              {formula}
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              The formula used will appear here so you can verify the answer.
            </p>
          )}
        </div>
        <ToolOutput label="Result text" value={result} filename="percentage-result.txt" rows={2} />
      </div>
    </div>
  );
}
