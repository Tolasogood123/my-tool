"use client";

import { useState } from "react";
import { RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateWholesale,
  type WholesaleMode,
  type WholesaleResult,
} from "@/lib/utils/wholesale-price";

export function WholesalePriceCalculator() {
  const [retailPrice, setRetailPrice] = useState("");
  const [mode, setMode] = useState<WholesaleMode>("margin");
  const [percent, setPercent] = useState("50");
  const [result, setResult] = useState<WholesaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const output = calculateWholesale(
      Number(retailPrice),
      mode,
      Number(percent),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setRetailPrice("");
    setMode("margin");
    setPercent("50");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Retail price: ${money(result.retailPrice)}`,
        `Pricing model: ${result.mode}${result.mode !== "keystone" ? ` (${result.inputPercent}%)` : ""}`,
        `Wholesale price: ${money(result.wholesalePrice)}`,
        `Wholesale / retail ratio: ${result.ratio.toFixed(1)}%`,
        `Retailer margin at retail: ${result.retailerMargin.toFixed(1)}%`,
        `Retailer markup on wholesale: ${result.retailerMarkup.toFixed(1)}%`,
      ].join("\n")
    : "";

  const cards = result
    ? [
        { label: "Wholesale price", value: money(result.wholesalePrice), highlight: true },
        { label: "Retailer margin", value: `${result.retailerMargin.toFixed(1)}%`, highlight: true },
        { label: "Retailer markup", value: `${result.retailerMarkup.toFixed(1)}%` },
        { label: "Wholesale / retail", value: `${result.ratio.toFixed(1)}%` },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Retail price ($)"
          htmlFor="ws-retail"
          hint="The price the end customer will pay."
        >
          <Input
            id="ws-retail"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={retailPrice}
            onChange={(event) => setRetailPrice(event.target.value)}
            placeholder="60"
          />
        </Field>
        <Field label="Pricing model" htmlFor="ws-mode">
          <Select
            id="ws-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as WholesaleMode);
              setResult(null);
              setError(null);
            }}
          >
            <option value="margin">Desired retailer margin (%)</option>
            <option value="markup">Markup on wholesale (%)</option>
            <option value="keystone">Keystone (50/50 split)</option>
          </Select>
        </Field>
        {mode !== "keystone" ? (
          <Field
            label={mode === "margin" ? "Desired retailer margin (%)" : "Markup on wholesale (%)"}
            htmlFor="ws-percent"
            hint={
              mode === "margin"
                ? "The share of the retail price the retailer keeps as gross margin."
                : "The percentage added to the wholesale price to reach retail."
            }
          >
            <Input
              id="ws-percent"
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
              placeholder="50"
            />
          </Field>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Tag className="size-4" aria-hidden="true" />
            Calculate wholesale
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState title="Check your inputs" description={error} />
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
                Wholesale pricing results will appear here.
              </p>
            </div>
          )}
        </div>
        <ToolOutput
          label="Wholesale summary"
          value={report}
          filename="wholesale-summary.txt"
          rows={6}
        />
      </div>
    </div>
  );
}
