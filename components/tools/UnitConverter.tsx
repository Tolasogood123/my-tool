"use client";

import { useState } from "react";
import { ArrowLeftRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import {
  convertUnit,
  formatConverted,
  getCategories,
  getUnits,
  type UnitCategory,
} from "@/lib/utils/unit";

export function UnitConverter() {
  const categories = getCategories();
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("mi");

  const units = getUnits(category);
  const numeric = Number(value);

  const changeCategory = (next: UnitCategory) => {
    const nextUnits = getUnits(next);
    setCategory(next);
    setFrom(nextUnits[0]?.id ?? "");
    setTo(nextUnits[1]?.id ?? nextUnits[0]?.id ?? "");
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const result = value.trim() !== "" && Number.isFinite(numeric)
    ? convertUnit(category, numeric, from, to)
    : Number.NaN;
  const fromUnit = units.find((unit) => unit.id === from);
  const toUnit = units.find((unit) => unit.id === to);
  const label = categories.find((item) => item.id === category)?.label ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Measurement type" htmlFor="unit-category">
            <Select
              id="unit-category"
              value={category}
              onChange={(event) => changeCategory(event.target.value as UnitCategory)}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Value" htmlFor="unit-value">
            <Input
              id="unit-value"
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="1"
            />
          </Field>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <Field label="From" htmlFor="unit-from">
            <Select id="unit-from" value={from} onChange={(event) => setFrom(event.target.value)}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>
              ))}
            </Select>
          </Field>
          <Button variant="outline" size="icon" onClick={swap} aria-label="Swap units" className="mb-0">
            <ArrowLeftRight className="size-4" aria-hidden="true" />
          </Button>
          <Field label="To" htmlFor="unit-to">
            <Select id="unit-to" value={to} onChange={(event) => setTo(event.target.value)}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>
              ))}
            </Select>
          </Field>
        </div>

        <p className="text-xs text-subtle-foreground">
          Uses exact SI-derived factors for {label.toLowerCase()}. Results update as you type.
        </p>
      </div>

      <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-border bg-surface p-6 text-center">
        <Calculator className="size-6 text-accent" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">Converted value</p>
        <p className="mt-2 break-words text-3xl font-semibold tabular-nums">
          {Number.isFinite(result) ? formatConverted(result) : "—"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {Number.isFinite(result)
            ? `${formatConverted(numeric)} ${fromUnit?.symbol ?? ""} = ${formatConverted(result)} ${toUnit?.symbol ?? ""}`
            : "Enter a number to see the result."}
        </p>
      </div>
    </div>
  );
}
