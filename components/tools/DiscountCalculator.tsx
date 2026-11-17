"use client";

import { useState } from "react";
import { Percent, RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { calculateDiscount } from "@/lib/utils/discount";
import type { DiscountMode, DiscountResult } from "@/lib/utils/discount";
import { ToolOutput } from "@/components/tools/ToolOutput";

export function DiscountCalculator() {
  const [mode, setMode] = useState<DiscountMode>("amount");
  const [first, setFirst] = useState("");
  const [percent, setPercent] = useState("20");
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateDiscount(mode, Number(first), Number(percent));
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setFirst("");
    setPercent("20");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Original price: ${money(result.original)}`,
        `Discount: ${result.discount}% (${money(result.saved)})`,
        `Final price: ${money(result.finalPrice)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Calculation" htmlFor="discount-mode">
          <Select
            id="discount-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as DiscountMode);
              setResult(null);
              setError(null);
            }}
          >
            <option value="amount">Price − discount → sale price</option>
            <option value="reverse">Sale price + discount → original price</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={mode === "amount" ? "Original price ($)" : "Sale price ($)"} htmlFor="discount-price">
            <Input id="discount-price" type="number" min={0} step="0.01" value={first} onChange={(event) => setFirst(event.target.value)} placeholder="80" />
          </Field>
          <Field label="Discount (%)" htmlFor="discount-percent">
            <Input id="discount-percent" type="number" min={0} max={100} step="0.1" value={percent} onChange={(event) => setPercent(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Tag className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your numbers" description={error} icon={Percent} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            {mode === "amount" ? "Sale price" : "Original price"}
          </p>
          <p className="mt-3 text-4xl font-semibold text-accent">
            {result ? money(mode === "amount" ? result.finalPrice : result.original) : "—"}
          </p>
          {result ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {money(result.saved)} saved at {result.discount}%
            </p>
          ) : null}
        </div>
        <ToolOutput label="Result summary" value={report} filename="discount-result.txt" rows={4} />
      </div>
    </div>
  );
}
