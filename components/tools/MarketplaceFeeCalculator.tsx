"use client";

import { useRef, useState } from "react";
import { Plus, RotateCcw, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateMarketplaceFees,
  type FeeLine,
  type MarketplaceFeeResult,
} from "@/lib/utils/marketplace-fee";

const INITIAL_FEES: FeeLine[] = [
  { id: "fee-1", label: "Referral fee", percent: 0 },
  { id: "fee-2", label: "Payment processing", percent: 0 },
];

export function MarketplaceFeeCalculator() {
  const [salePrice, setSalePrice] = useState("");
  const [feeLines, setFeeLines] = useState<FeeLine[]>(INITIAL_FEES);
  const [fixedFees, setFixedFees] = useState("0");
  const [result, setResult] = useState<MarketplaceFeeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(3);

  const updateFee = (id: string, patch: Partial<FeeLine>) => {
    setFeeLines((lines) =>
      lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  };
  const addFee = () => {
    setFeeLines((lines) => [
      ...lines,
      { id: `fee-${nextId.current++}`, label: "", percent: 0 },
    ]);
  };
  const removeFee = (id: string) => {
    setFeeLines((lines) => lines.filter((line) => line.id !== id));
  };

  const calculate = () => {
    const output = calculateMarketplaceFees(
      Number(salePrice),
      feeLines,
      Number(fixedFees),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setSalePrice("");
    setFeeLines(INITIAL_FEES.map((fee) => ({ ...fee })));
    setFixedFees("0");
    setResult(null);
    setError(null);
  };

  const money = (value: number) => `$${value.toFixed(2)}`;
  const report = result
    ? [
        `Sale price: ${money(result.salePrice)}`,
        ...result.fees.map(
          (fee) => `${fee.label} (${fee.percent}%): -${money(fee.amount)}`,
        ),
        `Fixed fees per sale: -${money(result.fixedFees)}`,
        `Total percentage: ${result.totalPercent}%`,
        `Total fees: -${money(result.totalFees)} (${result.effectiveFeeRate.toFixed(1)}% effective)`,
        `Net payout: ${money(result.netPayout)}`,
      ].join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Sale price ($)"
          htmlFor="mf-price"
          hint="The amount the customer pays before any fees."
        >
          <Input
            id="mf-price"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={salePrice}
            onChange={(event) => setSalePrice(event.target.value)}
            placeholder="100"
          />
        </Field>

        <div className="space-y-3">
          <p className="text-sm font-medium">Fee percentages</p>
          <p className="text-xs text-subtle-foreground">
            Enter the rates your marketplace charges. No rates are assumed.
          </p>
          {feeLines.map((fee, index) => (
            <div key={fee.id} className="rounded-control border border-border p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Field label={`Fee ${index + 1} name`} htmlFor={`${fee.id}-label`}>
                  <Input
                    id={`${fee.id}-label`}
                    value={fee.label}
                    onChange={(event) =>
                      updateFee(fee.id, { label: event.target.value })
                    }
                    placeholder="e.g. Referral fee"
                  />
                </Field>
                <Field label="Rate (%)" htmlFor={`${fee.id}-percent`}>
                  <div className="flex gap-2">
                    <Input
                      id={`${fee.id}-percent`}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      inputMode="decimal"
                      className="w-24"
                      value={fee.percent || ""}
                      onChange={(event) =>
                        updateFee(fee.id, { percent: Number(event.target.value) })
                      }
                      placeholder="0"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove fee ${index + 1}`}
                      onClick={() => removeFee(fee.id)}
                      disabled={feeLines.length === 1}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Field>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addFee}>
            <Plus className="size-4" aria-hidden="true" />
            Add fee
          </Button>
        </div>

        <Field
          label="Fixed fees per sale ($)"
          htmlFor="mf-fixed"
          hint="Flat per-order charges such as a listing or packaging fee."
        >
          <Input
            id="mf-fixed"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={fixedFees}
            onChange={(event) => setFixedFees(event.target.value)}
            placeholder="0"
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <ShoppingBag className="size-4" aria-hidden="true" />
            Calculate payout
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState title="Check your fees" description={error} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Net payout
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-accent">
            {result ? money(result.netPayout) : "—"}
          </p>
          {result ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {money(result.totalFees)} in fees · {result.effectiveFeeRate.toFixed(1)}% effective rate
            </p>
          ) : null}
        </div>
        {result && result.netPayout < 0 ? (
          <ErrorState
            title="Fees exceed the sale price"
            description="This combination of fees produces a negative payout. Lower a rate or raise the sale price."
          />
        ) : null}
        <ToolOutput
          label="Payout breakdown"
          value={report}
          filename="marketplace-fee-breakdown.txt"
          rows={8}
        />
      </div>
    </div>
  );
}
