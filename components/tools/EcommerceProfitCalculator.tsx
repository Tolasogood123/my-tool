"use client";

import { useState } from "react";
import { Briefcase, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateEcommerceProfit,
  type EcommerceProfitResult,
} from "@/lib/utils/ecommerce-profit";

export function EcommerceProfitCalculator() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [shipping, setShipping] = useState("");
  const [ads, setAds] = useState("");
  const [fees, setFees] = useState("");
  const [returns, setReturns] = useState("");
  const [result, setResult] = useState<EcommerceProfitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const output = calculateEcommerceProfit(
      Number(revenue),
      Number(cogs),
      Number(shipping),
      Number(ads),
      Number(fees),
      Number(returns),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setRevenue("");
    setCogs("");
    setShipping("");
    setAds("");
    setFees("");
    setReturns("");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Revenue: ${money(result.revenue)}`,
        `Cost of goods sold: -${money(result.cogs)}`,
        `Shipping: -${money(result.shipping)}`,
        `Advertising: -${money(result.ads)}`,
        `Fees: -${money(result.fees)}`,
        `Returns & refunds: -${money(result.returns)}`,
        `Total costs: -${money(result.totalCosts)} (${result.costRatio.toFixed(1)}% of revenue)`,
        `Net profit: ${money(result.profit)}`,
        `Profit margin: ${result.margin.toFixed(1)}%`,
      ].join("\n")
    : "";

  const cards = result
    ? [
        { label: "Net profit", value: money(result.profit), highlight: true },
        { label: "Profit margin", value: `${result.margin.toFixed(1)}%`, highlight: true },
        { label: "Total costs", value: money(result.totalCosts) },
        { label: "Cost ratio", value: `${result.costRatio.toFixed(1)}%` },
      ]
    : [];

  const fields: Array<{
    key: string;
    label: string;
    value: string;
    set: (value: string) => void;
    placeholder: string;
  }> = [
    { key: "revenue", label: "Revenue ($)", value: revenue, set: setRevenue, placeholder: "25000" },
    { key: "cogs", label: "Cost of goods sold ($)", value: cogs, set: setCogs, placeholder: "9000" },
    { key: "shipping", label: "Shipping ($)", value: shipping, set: setShipping, placeholder: "1500" },
    { key: "ads", label: "Advertising ($)", value: ads, set: setAds, placeholder: "3000" },
    { key: "fees", label: "Platform & payment fees ($)", value: fees, set: setFees, placeholder: "2000" },
    { key: "returns", label: "Returns & refunds ($)", value: returns, set: setReturns, placeholder: "500" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.key} label={field.label} htmlFor={`ep-${field.key}`}>
              <Input
                id={`ep-${field.key}`}
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
                placeholder={field.placeholder}
              />
            </Field>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Briefcase className="size-4" aria-hidden="true" />
            Calculate profit
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState title="Check your amounts" description={error} />
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
                Profit results will appear here.
              </p>
            </div>
          )}
        </div>
        {result && result.profit < 0 ? (
          <ErrorState
            title="This period is at a loss"
            description="Total costs exceed revenue. Review the largest cost lines to find savings."
          />
        ) : null}
        <ToolOutput
          label="Profit statement"
          value={report}
          filename="profit-statement.txt"
          rows={9}
        />
      </div>
    </div>
  );
}
