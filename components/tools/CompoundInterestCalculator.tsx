"use client";

import { useState } from "react";
import { RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { calculateCompound } from "@/lib/utils/compound";
import type { Compounding, CompoundResult } from "@/lib/utils/compound";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compounding, setCompounding] = useState<Compounding>("monthly");
  const [result, setResult] = useState<CompoundResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateCompound(
      Number(principal),
      Number(rate),
      Number(years),
      compounding,
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setCompounding("monthly");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Starting amount: ${money(result.principal)}`,
        `Annual rate: ${result.rate}%`,
        `Time: ${result.years} years`,
        `Compounded: ${result.compounding} (${result.periods} periods)`,
        `Interest earned: ${money(result.interest)}`,
        `Final amount: ${money(result.finalAmount)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starting amount ($)" htmlFor="compound-principal">
            <Input id="compound-principal" type="number" min={0} step="100" value={principal} onChange={(event) => setPrincipal(event.target.value)} placeholder="1000" />
          </Field>
          <Field label="Annual rate (%)" htmlFor="compound-rate">
            <Input id="compound-rate" type="number" min={0} max={100} step="0.1" value={rate} onChange={(event) => setRate(event.target.value)} placeholder="7" />
          </Field>
          <Field label="Years" htmlFor="compound-years">
            <Input id="compound-years" type="number" min={0.1} max={200} step={1} value={years} onChange={(event) => setYears(event.target.value)} placeholder="10" />
          </Field>
          <Field label="Compounding" htmlFor="compound-frequency">
            <Select id="compound-frequency" value={compounding} onChange={(event) => setCompounding(event.target.value as Compounding)}>
              <option value="annually">Annually</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <TrendingUp className="size-4" aria-hidden="true" />
            Calculate growth
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your inputs" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Final amount
          </p>
          <p className="mt-3 text-4xl font-semibold text-accent">
            {result ? money(result.finalAmount) : "—"}
          </p>
          {result ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {money(result.interest)} earned over {result.years} years
            </p>
          ) : null}
        </div>
        <ToolOutput label="Growth summary" value={report} filename="compound-summary.txt" rows={6} />
        <p className="text-xs text-subtle-foreground">
          Uses A = P(1 + r/n)^(nt). Results are illustrative and do not include fees, taxes, or market risk.
        </p>
      </div>
    </div>
  );
}
