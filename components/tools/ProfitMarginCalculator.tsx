"use client";

import { useState } from "react";
import { Percent, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";

type Mode = "margin" | "markup" | "from-price";

export function ProfitMarginCalculator() {
  const [mode, setMode] = useState<Mode>("margin");
  const [cost, setCost] = useState("");
  const [percent, setPercent] = useState("40");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);
    const c = Number(cost);
    const p = Number(percent);
    const s = Number(price);

    if (!Number.isFinite(c) || c < 0) {
      setError("Enter a valid cost of zero or more.");
      return;
    }

    if (mode === "from-price") {
      if (!Number.isFinite(s) || s <= 0) {
        setError("Enter a selling price greater than zero.");
        return;
      }
      if (s < c) {
        setError("The selling price is below cost, which means a loss.");
        return;
      }
      const profit = s - c;
      setResult({ profit, margin: (profit / s) * 100, markup: (profit / c) * 100 || 0, price: s });
      return;
    }

    if (!Number.isFinite(p) || p < 0 || p >= 100) {
      setError(mode === "margin" ? "Margin must be between 0 and under 100." : "Enter a valid markup percentage of zero or more.");
      return;
    }

    const sellingPrice = mode === "margin" ? c / (1 - p / 100) : c * (1 + p / 100);
    const profit = sellingPrice - c;
    setResult({
      price: sellingPrice,
      profit,
      margin: (profit / sellingPrice) * 100,
      markup: c > 0 ? (profit / c) * 100 : 0,
    });
  };

  const reset = () => {
    setCost("");
    setPercent("40");
    setPrice("");
    setResult(null);
    setError(null);
  };

  const cards = result
    ? [
        { label: "Selling price", value: `$${result.price.toFixed(2)}`, highlight: true },
        { label: "Profit per unit", value: `$${result.profit.toFixed(2)}` },
        { label: "Gross margin", value: `${result.margin.toFixed(1)}%` },
        { label: "Markup", value: `${result.markup.toFixed(1)}%` },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Calculation mode" htmlFor="pm-mode">
          <Select id="pm-mode" value={mode} onChange={(event) => { setMode(event.target.value as Mode); setResult(null); setError(null); }}>
            <option value="margin">Cost + target margin → price</option>
            <option value="markup">Cost + markup → price</option>
            <option value="from-price">Cost + selling price → margin</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product cost ($)" htmlFor="pm-cost">
            <Input id="pm-cost" type="number" min={0} step="0.01" inputMode="decimal" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="40" />
          </Field>
          {mode === "from-price" ? (
            <Field label="Selling price ($)" htmlFor="pm-price">
              <Input id="pm-price" type="number" min={0} step="0.01" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="66.67" />
            </Field>
          ) : (
            <Field label={mode === "margin" ? "Target margin (%)" : "Markup (%)"} htmlFor="pm-percent">
              <Input id="pm-percent" type="number" min={0} step="0.1" inputMode="decimal" value={percent} onChange={(event) => setPercent(event.target.value)} />
            </Field>
          )}
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

      <div className="grid grid-cols-2 gap-3">
        {cards.length > 0 ? cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-card border p-5 ${card.highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"}`}
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
          </div>
        )) : (
          <div className="col-span-2 flex min-h-48 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Pricing results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
