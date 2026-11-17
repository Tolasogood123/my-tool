"use client";

import { useState } from "react";
import { Landmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { calculateLoan } from "@/lib/utils/loan";
import type { LoanResult } from "@/lib/utils/loan";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateLoan(Number(principal), Number(rate), Number(years));
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Loan amount: ${money(result.principal)}`,
        `Annual rate: ${result.annualRate}%`,
        `Term: ${result.months} months`,
        `Monthly payment: ${money(result.monthlyPayment)}`,
        `Total interest: ${money(result.totalInterest)}`,
        `Total repaid: ${money(result.totalPaid)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Loan amount ($)" htmlFor="loan-principal">
            <Input id="loan-principal" type="number" min={0} step="100" value={principal} onChange={(event) => setPrincipal(event.target.value)} placeholder="10000" />
          </Field>
          <Field label="Annual rate (%)" htmlFor="loan-rate">
            <Input id="loan-rate" type="number" min={0} max={100} step="0.1" value={rate} onChange={(event) => setRate(event.target.value)} placeholder="6.5" />
          </Field>
          <Field label="Term (years)" htmlFor="loan-years">
            <Input id="loan-years" type="number" min={0.1} max={100} step={1} value={years} onChange={(event) => setYears(event.target.value)} placeholder="5" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Landmark className="size-4" aria-hidden="true" />
            Calculate loan
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check the loan details" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Monthly payment
          </p>
          <p className="mt-3 text-4xl font-semibold text-accent">
            {result ? money(result.monthlyPayment) : "—"}
          </p>
          {result ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {result.months} payments · {money(result.totalInterest)} interest
            </p>
          ) : null}
        </div>
        <ToolOutput label="Loan summary" value={report} filename="loan-summary.txt" rows={6} />
        <p className="text-xs text-subtle-foreground">
          Uses standard amortization with monthly compounding. Taxes and insurance are not included.
        </p>
      </div>
    </div>
  );
}
