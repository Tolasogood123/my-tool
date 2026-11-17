"use client";

import { useState } from "react";
import { GraduationCap, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { calculateCgpa } from "@/lib/utils/cgpa";
import type { CgpaResult, SemesterInput } from "@/lib/utils/cgpa";

interface Row extends SemesterInput {
  id: number;
}

let nextId = 1;
const emptyRow = (): Row => ({ id: nextId++, name: "", credits: 18, sgpa: 3 });

export function CgpaCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { id: nextId++, name: "", credits: 18, sgpa: 3 },
  ]);
  const [result, setResult] = useState<CgpaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (id: number, patch: Partial<Row>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const calculate = () => {
    setError(null);
    const output = calculateCgpa(
      rows.map((row) => ({
        name: row.name,
        credits: Number(row.credits),
        sgpa: Number(row.sgpa),
      })),
    );
    setResult(output.result);
    setError(output.error);
  };

  const reset = () => {
    setRows([{ id: nextId++, name: "", credits: 18, sgpa: 3 }]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="grid gap-3 rounded-card border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] sm:items-end"
          >
            <Field label={`Semester ${index + 1}`} htmlFor={`cgpa-name-${row.id}`}>
              <Input
                id={`cgpa-name-${row.id}`}
                value={row.name}
                onChange={(event) => update(row.id, { name: event.target.value })}
                placeholder="Fall 2026"
              />
            </Field>
            <Field label="Credits" htmlFor={`cgpa-credits-${row.id}`}>
              <Input
                id={`cgpa-credits-${row.id}`}
                type="number"
                min={0.5}
                step={0.5}
                value={row.credits}
                onChange={(event) => update(row.id, { credits: event.target.value as unknown as number })}
              />
            </Field>
            <Field label="SGPA (0–4)" htmlFor={`cgpa-sgpa-${row.id}`}>
              <Input
                id={`cgpa-sgpa-${row.id}`}
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={row.sgpa}
                onChange={(event) => update(row.id, { sgpa: event.target.value as unknown as number })}
              />
            </Field>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Remove semester ${index + 1}`}
              onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
              disabled={rows.length === 1}
            >
              <Trash2 className="size-4 text-danger" aria-hidden="true" />
            </Button>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setRows((current) => [...current, emptyRow()])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add semester
          </Button>
          <Button onClick={calculate}>
            <GraduationCap className="size-4" aria-hidden="true" />
            Calculate CGPA
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your semesters" description={error} /> : null}
      </div>

      <div className="space-y-3">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Cumulative GPA
          </p>
          <p className="mt-3 text-5xl font-semibold text-accent">
            {result ? result.cgpa.toFixed(2) : "—"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">On a 4.0 scale</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-control border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted-foreground">Total credits</p>
            <p className="mt-1 text-xl font-semibold">{result?.totalCredits ?? "—"}</p>
          </div>
          <div className="rounded-control border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted-foreground">Semesters</p>
            <p className="mt-1 text-xl font-semibold">{result?.semesters ?? "—"}</p>
          </div>
        </div>
        <p className="text-xs text-subtle-foreground">
          Formula: CGPA = Σ(credits × SGPA) ÷ Σ credits.
        </p>
      </div>
    </div>
  );
}
