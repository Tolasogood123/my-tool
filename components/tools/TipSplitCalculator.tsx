"use client";

import { useState } from "react";
import { RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { calculateSplit } from "@/lib/utils/tip";
import type { SplitResult } from "@/lib/utils/tip";

export function TipSplitCalculator() {
  const [subtotal, setSubtotal] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("2");
  const [result, setResult] = useState<SplitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateSplit(Number(subtotal), Number(tipPercent), Number(people));
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setSubtotal("");
    setTipPercent("15");
    setPeople("2");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Bill: ${money(result.subtotal)}`,
        `Tip: ${result.tipPercent}% = ${money(result.tip)}`,
        `Total: ${money(result.total)}`,
        `People: ${result.people}`,
        `Per person: ${money(result.perPerson)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Bill amount ($)" htmlFor="tip-bill" hint="Enter the pre-tip subtotal.">
          <Input id="tip-bill" type="number" min={0} step="0.01" value={subtotal} onChange={(event) => setSubtotal(event.target.value)} placeholder="84.50" />
        </Field>
        <div className="flex flex-wrap gap-2">
          {[0, 10, 15, 18, 20].map((value) => (
            <Button key={value} type="button" size="sm" variant={tipPercent === String(value) ? "primary" : "outline"} onClick={() => setTipPercent(String(value))}>
              {value}%
            </Button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Custom tip (%)" htmlFor="tip-percent">
            <Input id="tip-percent" type="number" min={0} max={100} step={0.5} value={tipPercent} onChange={(event) => setTipPercent(event.target.value)} />
          </Field>
          <Field label="Split between" htmlFor="tip-people">
            <Input id="tip-people" type="number" min={1} max={100} step={1} value={people} onChange={(event) => setPeople(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Users className="size-4" aria-hidden="true" />
            Calculate split
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check the bill details" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Each person pays
          </p>
          <p className="mt-3 text-4xl font-semibold text-accent">
            {result ? money(result.perPerson) : "—"}
          </p>
          {result ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Total {money(result.total)} including {money(result.tip)} tip
            </p>
          ) : null}
        </div>
        <ToolOutput label="Split summary" value={report} filename="split-summary.txt" rows={5} />
      </div>
    </div>
  );
}
