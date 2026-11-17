"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { CheckSquare, ClipboardCopy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import {
  calculateInventory,
  INVENTORY_FORMULAS,
  SERVICE_LEVELS,
  validateInventoryInput,
} from "@/lib/utils/inventory";
import type { InventoryResult } from "@/lib/utils/inventory";

const EMPTY_FORM = {
  annualDemand: "1200",
  workingDays: "365",
  leadTimeDays: "7",
  serviceLevelZ: "1.6449",
  demandStdDevDaily: "0",
  leadTimeStdDevDays: "0",
  orderingCost: "50",
  holdingCostPerUnitYear: "4",
};

export function InventoryCalculator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState<InventoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const update = (key: keyof typeof EMPTY_FORM) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const calculate = () => {
    setError(null);
    const input = {
      annualDemand: Number(form.annualDemand),
      workingDays: Number(form.workingDays),
      leadTimeDays: Number(form.leadTimeDays),
      serviceLevelZ: Number(form.serviceLevelZ),
      demandStdDevDaily: Number(form.demandStdDevDaily),
      leadTimeStdDevDays: Number(form.leadTimeStdDevDays),
      orderingCost: Number(form.orderingCost),
      holdingCostPerUnitYear: Number(form.holdingCostPerUnitYear),
    };
    const validationError = validateInventoryInput(input);
    if (validationError) {
      setResult(null);
      setError(validationError);
      return;
    }
    try {
      setResult(calculateInventory(input));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Could not calculate inventory figures.");
    }
  };

  const copySummary = async () => {
    if (!result) return;
    const summary = [
      "Inventory plan",
      `Daily demand: ${result.dailyDemand.toFixed(2)} units`,
      `Lead-time demand: ${result.leadTimeDemand.toFixed(2)} units`,
      `Safety stock: ${result.safetyStock.toFixed(2)} units`,
      `Reorder point: ${result.reorderPoint.toFixed(2)} units`,
      `Economic order quantity (EOQ): ${result.eoq.toFixed(2)} units`,
      `Orders per year: ${result.ordersPerYear.toFixed(2)}`,
      `Cycle length: ${result.cycleDays.toFixed(1)} days`,
    ].join("\n");
    try {
      await copyTextToClipboard(summary);
      toast({ title: "Inventory plan copied", variant: "success" });
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

  const primary = result
    ? [
        { label: "Reorder point", value: `${result.reorderPoint.toFixed(1)} units`, highlight: true },
        { label: "Safety stock", value: `${result.safetyStock.toFixed(1)} units`, highlight: false },
        { label: "EOQ", value: `${result.eoq.toFixed(1)} units`, highlight: true },
        { label: "Orders / year", value: result.ordersPerYear.toFixed(1), highlight: false },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Annual demand (units)" htmlFor="inv-demand" hint="Total units expected to sell in a year.">
            <Input id="inv-demand" type="number" min={0} step="1" inputMode="numeric" value={form.annualDemand} onChange={update("annualDemand")} />
          </Field>
          <Field label="Working days / year" htmlFor="inv-days">
            <Input id="inv-days" type="number" min={1} max={366} step="1" inputMode="numeric" value={form.workingDays} onChange={update("workingDays")} />
          </Field>
          <Field label="Lead time (days)" htmlFor="inv-lead">
            <Input id="inv-lead" type="number" min={0} step="0.5" inputMode="decimal" value={form.leadTimeDays} onChange={update("leadTimeDays")} />
          </Field>
          <Field label="Service level" htmlFor="inv-service">
            <Select id="inv-service" value={form.serviceLevelZ} onChange={update("serviceLevelZ")}>
              {SERVICE_LEVELS.map((level) => (
                <option key={level.z} value={level.z}>{level.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Daily demand std. dev. (units)" htmlFor="inv-sigma-d" hint="Leave 0 if demand is steady.">
            <Input id="inv-sigma-d" type="number" min={0} step="0.1" inputMode="decimal" value={form.demandStdDevDaily} onChange={update("demandStdDevDaily")} />
          </Field>
          <Field label="Lead-time std. dev. (days)" htmlFor="inv-sigma-l" hint="Leave 0 if lead time is fixed.">
            <Input id="inv-sigma-l" type="number" min={0} step="0.1" inputMode="decimal" value={form.leadTimeStdDevDays} onChange={update("leadTimeStdDevDays")} />
          </Field>
          <Field label="Cost per order ($)" htmlFor="inv-order-cost">
            <Input id="inv-order-cost" type="number" min={0} step="0.01" inputMode="decimal" value={form.orderingCost} onChange={update("orderingCost")} />
          </Field>
          <Field label="Holding cost / unit / year ($)" htmlFor="inv-holding">
            <Input id="inv-holding" type="number" min={0} step="0.01" inputMode="decimal" value={form.holdingCostPerUnitYear} onChange={update("holdingCostPerUnitYear")} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <CheckSquare className="size-4" aria-hidden="true" />
            Calculate inventory plan
          </Button>
          <Button variant="outline" onClick={copySummary} disabled={!result}>
            <ClipboardCopy className="size-4" aria-hidden="true" />
            Copy plan
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your inputs" description={error} /> : null}

        <div className="rounded-card border border-border bg-surface-muted p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Formulas used</p>
          <p className="mt-1">{INVENTORY_FORMULAS.dailyDemand}</p>
          <p>{INVENTORY_FORMULAS.leadTimeDemand}</p>
          <p>{INVENTORY_FORMULAS.safetyStock}</p>
          <p>{INVENTORY_FORMULAS.reorderPoint}</p>
          <p>{INVENTORY_FORMULAS.eoq}</p>
        </div>
      </div>

      <div className="space-y-3">
        {result ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {primary.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-card border p-5 ${card.highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"}`}
                >
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-card border border-border bg-surface p-4 text-sm">
              <p className="font-medium">Supporting figures</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground">
                <dt>Daily demand</dt>
                <dd className="text-right tabular-nums text-foreground">{result.dailyDemand.toFixed(2)} units</dd>
                <dt>Lead-time demand</dt>
                <dd className="text-right tabular-nums text-foreground">{result.leadTimeDemand.toFixed(2)} units</dd>
                <dt>Lead-time demand σ</dt>
                <dd className="text-right tabular-nums text-foreground">{result.demandDuringLeadTimeStdDev.toFixed(2)} units</dd>
                <dt>Order cycle</dt>
                <dd className="text-right tabular-nums text-foreground">{result.cycleDays.toFixed(1)} days</dd>
              </dl>
            </div>
            <p className="text-xs text-subtle-foreground">
              Reorder when stock falls to the reorder point. Safety stock covers variability in
              demand and lead time for your chosen service level.
            </p>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Your reorder point, safety stock and EOQ will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
