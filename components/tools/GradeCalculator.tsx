"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { calculateGrade } from "@/lib/utils/grade";
import type { GradeResult } from "@/lib/utils/grade";

interface Row {
  id: number;
  name: string;
  score: string;
  weight: string;
}

let nextId = 1;
const emptyRow = (): Row => ({ id: nextId++, name: "", score: "", weight: "" });

export function GradeCalculator() {
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (id: number, patch: Partial<Row>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const calculate = () => {
    setError(null);
    setResult(null);
    const output = calculateGrade(
      rows.map((row) => ({
        name: row.name,
        score: Number(row.score),
        weight: Number(row.weight),
      })),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setRows([emptyRow()]);
    setResult(null);
    setError(null);
  };

  const weightSum = rows.reduce((total, row) => total + (Number(row.weight) || 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="grid gap-3 rounded-card border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] sm:items-end"
          >
            <Field label={`Assessment ${index + 1}`} htmlFor={`grade-name-${row.id}`}>
              <Input
                id={`grade-name-${row.id}`}
                value={row.name}
                onChange={(event) => update(row.id, { name: event.target.value })}
                placeholder="Midterm"
              />
            </Field>
            <Field label="Score (%)" htmlFor={`grade-score-${row.id}`}>
              <Input
                id={`grade-score-${row.id}`}
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={row.score}
                onChange={(event) => update(row.id, { score: event.target.value })}
                placeholder="85"
              />
            </Field>
            <Field label="Weight (%)" htmlFor={`grade-weight-${row.id}`}>
              <Input
                id={`grade-weight-${row.id}`}
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={row.weight}
                onChange={(event) => update(row.id, { weight: event.target.value })}
                placeholder="30"
              />
            </Field>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Remove assessment ${index + 1}`}
              onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
              disabled={rows.length === 1}
            >
              <Trash2 className="size-4 text-danger" aria-hidden="true" />
            </Button>
          </div>
        ))}

        <p className="text-sm text-muted-foreground">
          Total weight: <strong>{weightSum.toFixed(1)}%</strong>
          {Math.abs(weightSum - 100) > 0.01 ? " — add the remaining assessments or adjust weights to reach 100%." : " — complete."}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setRows((current) => [...current, emptyRow()])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add assessment
          </Button>
          <Button onClick={calculate}>
            <TrendingUp className="size-4" aria-hidden="true" />
            Calculate grade
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your assessments" description={error} /> : null}
      </div>

      <div className="space-y-3">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Weighted grade
          </p>
          <p className="mt-3 text-5xl font-semibold text-accent">
            {result ? `${result.currentGrade.toFixed(2)}%` : "—"}
          </p>
        </div>
        {result ? (
          <ul className="space-y-2">
            {result.contributions.map((value, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-control border border-border bg-surface px-4 py-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {rows[index].name.trim() || `Assessment ${index + 1}`}
                </span>
                <span className="font-semibold tabular-nums">{value.toFixed(2)} pts</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-xs text-subtle-foreground">
          Grade = Σ(score × weight) ÷ Σ weight. This shows your current grade; use the Final Grade Calculator to find a needed exam score.
        </p>
      </div>
    </div>
  );
}
