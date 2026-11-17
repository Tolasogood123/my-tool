"use client";

import { useState } from "react";
import { RotateCcw, Sigma } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";

type SolveFor = "interest" | "balance" | "principal" | "rate" | "time";

const fieldLabels: Record<SolveFor, { p: string; r: string; t: string; i: string }> = {
  interest: { p: "Principal (P)", r: "Annual rate (%)", t: "Time (years)", i: "" },
  balance: { p: "Principal (P)", r: "Annual rate (%)", t: "Time (years)", i: "" },
  principal: { p: "", r: "Annual rate (%)", t: "Time (years)", i: "Interest (I)" },
  rate: { p: "Principal (P)", r: "", t: "Time (years)", i: "Interest (I)" },
  time: { p: "Principal (P)", r: "Annual rate (%)", t: "", i: "Interest (I)" },
};

export function SimpleInterestCalculator() {
  const [mode, setMode] = useState<SolveFor>("interest");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState<{ label: string; value: string; formula: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);
    const i = Number(interest);
    const labels = fieldLabels[mode];

    const needed = [
      labels.p ? principal : null,
      labels.r ? rate : null,
      labels.t ? time : null,
      labels.i ? interest : null,
    ].filter((value) => value !== null);

    if (needed.some((value) => value!.trim() === "")) {
      setError("Fill in every field needed for this calculation.");
      return;
    }
    if ([p, r, t, i].some((value) => !Number.isFinite(value)) || [p, t, i].some((value) => value < 0)) {
      setError("Enter valid non-negative numbers.");
      return;
    }

    if (mode === "interest" || mode === "balance") {
      const earned = p * r * t;
      setResult({
        label: mode === "interest" ? "Interest earned" : "Final balance",
        value: `$${(mode === "interest" ? earned : p + earned).toFixed(2)}`,
        formula: mode === "interest" ? "I = P × r × t" : "A = P + (P × r × t)",
      });
    } else if (mode === "principal") {
      if (r === 0 || t === 0) {
        setError("Rate and time must be greater than zero to solve for principal.");
        return;
      }
      setResult({ label: "Principal", value: `$${(i / (r * t)).toFixed(2)}`, formula: "P = I ÷ (r × t)" });
    } else if (mode === "rate") {
      if (p === 0 || t === 0) {
        setError("Principal and time must be greater than zero to solve for the rate.");
        return;
      }
      setResult({ label: "Annual rate", value: `${((i / (p * t)) * 100).toFixed(2)}%`, formula: "r = I ÷ (P × t) × 100" });
    } else {
      if (p === 0 || r === 0) {
        setError("Principal and rate must be greater than zero to solve for time.");
        return;
      }
      const years = i / (p * r);
      setResult({ label: "Time", value: `${years.toFixed(2)} years`, formula: "t = I ÷ (P × r)" });
    }
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setInterest("");
    setResult(null);
    setError(null);
  };

  const labels = fieldLabels[mode];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Find" htmlFor="si-mode">
          <Select id="si-mode" value={mode} onChange={(event) => { setMode(event.target.value as SolveFor); setResult(null); setError(null); }}>
            <option value="interest">Interest earned</option>
            <option value="balance">Final balance</option>
            <option value="principal">Principal</option>
            <option value="rate">Annual rate</option>
            <option value="time">Time</option>
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          {labels.p ? (
            <Field label={labels.p} htmlFor="si-p">
              <Input id="si-p" type="number" min={0} step="0.01" inputMode="decimal" value={principal} onChange={(event) => setPrincipal(event.target.value)} />
            </Field>
          ) : null}
          {labels.r ? (
            <Field label={labels.r} htmlFor="si-r">
              <Input id="si-r" type="number" min={0} step="0.01" inputMode="decimal" value={rate} onChange={(event) => setRate(event.target.value)} />
            </Field>
          ) : null}
          {labels.t ? (
            <Field label={labels.t} htmlFor="si-t">
              <Input id="si-t" type="number" min={0} step="0.1" inputMode="decimal" value={time} onChange={(event) => setTime(event.target.value)} />
            </Field>
          ) : null}
          {labels.i ? (
            <Field label={labels.i} htmlFor="si-i">
              <Input id="si-i" type="number" min={0} step="0.01" inputMode="decimal" value={interest} onChange={(event) => setInterest(event.target.value)} />
            </Field>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Sigma className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your values" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-border bg-surface-muted p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">{result?.label ?? "Result"}</p>
          <p className="mt-4 break-all text-4xl font-semibold text-accent">{result?.value ?? "—"}</p>
          {result ? <p className="mt-4 font-mono text-xs text-muted-foreground">{result.formula}</p> : null}
        </div>
        <p className="text-xs text-subtle-foreground">
          Simple interest does not compound. Each year earns the same amount on the original principal.
        </p>
      </div>
    </div>
  );
}
