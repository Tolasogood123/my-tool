"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Calculator, ClipboardCopy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import {
  calculateShippingCost,
  validateShippingInput,
} from "@/lib/utils/shipping-cost";
import type { ShippingResult } from "@/lib/utils/shipping-cost";

const EMPTY_FORM = {
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  actualWeightKg: "",
  ratePerKg: "",
  divisor: "5000",
};

export function ShippingCostCalculator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const update = (key: keyof typeof EMPTY_FORM) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const calculate = () => {
    setError(null);
    const input = {
      lengthCm: Number(form.lengthCm),
      widthCm: Number(form.widthCm),
      heightCm: Number(form.heightCm),
      actualWeightKg: Number(form.actualWeightKg),
      ratePerKg: Number(form.ratePerKg),
      divisor: Number(form.divisor),
    };
    const validationError = validateShippingInput(input);
    if (validationError) {
      setResult(null);
      setError(validationError);
      return;
    }
    try {
      setResult(calculateShippingCost(input));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Could not calculate shipping cost.");
    }
  };

  const copySummary = async () => {
    if (!result) return;
    const summary = [
      `Parcel: ${form.lengthCm} × ${form.widthCm} × ${form.heightCm} cm`,
      `Volume: ${result.volumeCm3.toFixed(0)} cm³`,
      `Volumetric weight: ${result.volumetricWeightKg.toFixed(2)} kg (divisor ${form.divisor})`,
      `Actual weight: ${result.actualWeightKg.toFixed(2)} kg`,
      `Chargeable weight: ${result.chargeableWeightKg.toFixed(2)} kg (${result.basis})`,
      `Rate: $${form.ratePerKg}/kg`,
      `Estimated cost: $${result.estimatedCost.toFixed(2)}`,
    ].join("\n");
    try {
      await copyTextToClipboard(summary);
      toast({ title: "Summary copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Copy failed",
        description: cause instanceof Error ? cause.message : "Try again.",
        variant: "error",
      });
    }
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setError(null);
  };

  const basisLabel: Record<ShippingResult["basis"], string> = {
    actual: "Actual weight is higher — you are charged by scale weight.",
    volumetric: "Volumetric weight is higher — the parcel's size drives the cost.",
    equal: "Both weights are equal.",
  };

  const cards = result
    ? [
        { label: "Volumetric weight", value: `${result.volumetricWeightKg.toFixed(2)} kg`, highlight: false },
        { label: "Actual weight", value: `${result.actualWeightKg.toFixed(2)} kg`, highlight: false },
        { label: "Chargeable weight", value: `${result.chargeableWeightKg.toFixed(2)} kg`, highlight: true },
        { label: "Estimated cost", value: `$${result.estimatedCost.toFixed(2)}`, highlight: true },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Length (cm)" htmlFor="ship-length">
            <Input id="ship-length" type="number" min={0} step="0.1" inputMode="decimal" value={form.lengthCm} onChange={update("lengthCm")} placeholder="40" />
          </Field>
          <Field label="Width (cm)" htmlFor="ship-width">
            <Input id="ship-width" type="number" min={0} step="0.1" inputMode="decimal" value={form.widthCm} onChange={update("widthCm")} placeholder="30" />
          </Field>
          <Field label="Height (cm)" htmlFor="ship-height">
            <Input id="ship-height" type="number" min={0} step="0.1" inputMode="decimal" value={form.heightCm} onChange={update("heightCm")} placeholder="20" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Actual weight (kg)" htmlFor="ship-weight">
            <Input id="ship-weight" type="number" min={0} step="0.01" inputMode="decimal" value={form.actualWeightKg} onChange={update("actualWeightKg")} placeholder="3.5" />
          </Field>
          <Field label="Rate per kg ($)" htmlFor="ship-rate">
            <Input id="ship-rate" type="number" min={0} step="0.01" inputMode="decimal" value={form.ratePerKg} onChange={update("ratePerKg")} placeholder="6.50" />
          </Field>
        </div>

        <Field
          label="Volumetric divisor"
          htmlFor="ship-divisor"
          hint="Carriers commonly use 5000 (express) or 6000. Lower divisors produce a higher volumetric weight."
        >
          <Select id="ship-divisor" value={form.divisor} onChange={update("divisor")}>
            <option value="5000">5000 — standard express</option>
            <option value="6000">6000 — some carriers</option>
            <option value="4000">4000 — conservative</option>
          </Select>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Calculator className="size-4" aria-hidden="true" />
            Calculate shipping
          </Button>
          <Button variant="outline" onClick={copySummary} disabled={!result}>
            <ClipboardCopy className="size-4" aria-hidden="true" />
            Copy summary
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your parcel details" description={error} /> : null}

        <div className="rounded-card border border-border bg-surface-muted p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">How it works</p>
          <p className="mt-1">Volumetric weight = (length × width × height) ÷ divisor.</p>
          <p>Chargeable weight = the greater of volumetric and actual weight.</p>
          <p>Estimated cost = chargeable weight × rate per kg.</p>
        </div>
      </div>

      <div className="space-y-3">
        {cards.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-card border p-5 ${card.highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"}`}
                >
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-sm font-medium">Billing basis</p>
              <p className="mt-1 text-sm text-muted-foreground">{basisLabel[result!.basis]}</p>
              <p className="mt-2 text-xs text-subtle-foreground">
                Parcel volume: {result!.volumeCm3.toFixed(0)} cm³ · Divisor: {form.divisor}
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Enter parcel dimensions, weight and rate to see the chargeable weight here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
