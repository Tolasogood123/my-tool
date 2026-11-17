"use client";

import { useState } from "react";
import { Receipt, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { calculateVat } from "@/lib/utils/vat";
import type { VatMode, VatResult } from "@/lib/utils/vat";
import { ToolOutput } from "@/components/tools/ToolOutput";

export function VatCalculator() {
  const [mode, setMode] = useState<VatMode>("add");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("10");
  const [result, setResult] = useState<VatResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateVat(mode, Number(amount), Number(rate));
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setAmount("");
    setRate("10");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `VAT rate: ${result.rate}%`,
        `Net amount: ${money(result.net)}`,
        `VAT: ${money(result.vat)}`,
        `Gross amount: ${money(result.gross)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Calculation" htmlFor="vat-mode" hint="Choose whether your amount excludes or includes VAT.">
          <Select
            id="vat-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as VatMode);
              setResult(null);
              setError(null);
            }}
          >
            <option value="add">Add VAT (net → gross)</option>
            <option value="remove">Remove VAT (gross → net)</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={mode === "add" ? "Net amount ($)" : "Gross amount ($)"}
            htmlFor="vat-amount"
          >
            <Input id="vat-amount" type="number" min={0} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="100" />
          </Field>
          <Field label="VAT rate (%)" htmlFor="vat-rate" hint="Enter your jurisdiction's rate.">
            <Input id="vat-rate" type="number" min={0} max={100} step="0.1" value={rate} onChange={(event) => setRate(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Receipt className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your numbers" description={error} /> : null}
        {result ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-control border border-border bg-surface p-4 text-center">
              <p className="text-xs text-muted-foreground">Net</p>
              <p className="mt-1 font-semibold">{money(result.net)}</p>
            </div>
            <div className="rounded-control border border-border bg-surface p-4 text-center">
              <p className="text-xs text-muted-foreground">VAT</p>
              <p className="mt-1 font-semibold">{money(result.vat)}</p>
            </div>
            <div className="rounded-control border border-border bg-surface p-4 text-center">
              <p className="text-xs text-muted-foreground">Gross</p>
              <p className="mt-1 font-semibold">{money(result.gross)}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <ToolOutput label="Result summary" value={report} filename="vat-result.txt" rows={5} />
        <p className="text-xs text-subtle-foreground">
          This tool applies the rate you enter. Tax rules vary by country and product; verify the applicable rate and exemptions yourself.
        </p>
      </div>
    </div>
  );
}
