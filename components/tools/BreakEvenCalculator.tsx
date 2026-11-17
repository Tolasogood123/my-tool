"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { formatNumber } from "@/lib/utils/format";
import {
  calculateBreakEven,
  type BreakEvenResult,
} from "@/lib/utils/break-even";

export function BreakEvenCalculator() {
  const [fixedCost, setFixedCost] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const output = calculateBreakEven(
      Number(fixedCost),
      Number(variableCost),
      Number(price),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setFixedCost("");
    setVariableCost("");
    setPrice("");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Fixed costs: ${money(result.fixedCost)}`,
        `Variable cost per unit: ${money(result.variableCostPerUnit)}`,
        `Selling price: ${money(result.sellingPrice)}`,
        `Contribution margin per unit: ${money(result.contributionMargin)} (${result.contributionMarginRatio.toFixed(1)}%)`,
        `Break-even units (exact): ${formatNumber(result.breakEvenUnitsExact)}`,
        `Break-even units (whole): ${formatNumber(result.breakEvenUnits)}`,
        `Break-even revenue (whole units): ${money(result.breakEvenRevenue)}`,
      ].join("\n")
    : "";

  const cards = result
    ? [
        {
          label: "Break-even units (whole)",
          value: formatNumber(result.breakEvenUnits),
          highlight: true,
        },
        {
          label: "Break-even revenue",
          value: money(result.breakEvenRevenue),
          highlight: true,
        },
        {
          label: "Contribution margin / unit",
          value: money(result.contributionMargin),
        },
        {
          label: "Contribution margin ratio",
          value: `${result.contributionMarginRatio.toFixed(1)}%`,
        },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Total fixed costs ($)"
          htmlFor="be-fixed"
          hint="Costs that do not change with output, such as rent or software."
        >
          <Input
            id="be-fixed"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={fixedCost}
            onChange={(event) => setFixedCost(event.target.value)}
            placeholder="5000"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Variable cost per unit ($)" htmlFor="be-variable">
            <Input
              id="be-variable"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={variableCost}
              onChange={(event) => setVariableCost(event.target.value)}
              placeholder="12"
            />
          </Field>
          <Field label="Selling price per unit ($)" htmlFor="be-price">
            <Input
              id="be-price"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="30"
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Calculator className="size-4" aria-hidden="true" />
            Calculate break-even
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState title="Check your numbers" description={error} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card.label}
                className={`rounded-card border p-4 ${
                  card.highlight
                    ? "border-accent/30 bg-accent-soft"
                    : "border-border bg-surface"
                }`}
              >
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {card.value}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-2 flex min-h-32 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Break-even results will appear here.
              </p>
            </div>
          )}
        </div>
        <ToolOutput
          label="Break-even summary"
          value={report}
          filename="break-even-summary.txt"
          rows={7}
        />
      </div>
    </div>
  );
}
