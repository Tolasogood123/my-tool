"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  formatEquation,
  formatNumber,
  solveEquation,
  type EquationKind,
  type SolveResult,
} from "@/lib/utils/equation";

export function EquationSolver() {
  const [kind, setKind] = useState<EquationKind>("quadratic");
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");
  const [solution, setSolution] = useState<SolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parse = (value: string) => (value.trim() === "" ? Number.NaN : Number(value));
  const preview = formatEquation(kind, parse(a) || 0, parse(b) || 0, parse(c) || 0);

  const solve = () => {
    setError(null);
    setSolution(null);
    const values = [a, b, ...(kind === "quadratic" ? [c] : [])];
    if (values.some((value) => value.trim() === "")) {
      setError("Fill in every coefficient before solving.");
      return;
    }
    const outcome = solveEquation(kind, parse(a), parse(b), kind === "quadratic" ? parse(c) : 0);
    if (outcome.error || !outcome.result) {
      setError(outcome.error ?? "That equation could not be solved.");
      return;
    }
    setSolution(outcome.result);
  };

  const reset = () => {
    setKind("quadratic");
    setA("1");
    setB("-3");
    setC("2");
    setSolution(null);
    setError(null);
  };

  const report = solution
    ? [
        `${preview}`,
        solution.summary,
        solution.discriminant !== null ? `Discriminant: ${formatNumber(solution.discriminant)}` : "",
        ...solution.steps.map((step, index) => `${index + 1}. ${step}`),
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Equation type" htmlFor="equation-kind">
          <Select
            id="equation-kind"
            value={kind}
            onChange={(event) => {
              setKind(event.target.value as EquationKind);
              setSolution(null);
              setError(null);
            }}
          >
            <option value="linear">Linear (ax + b = 0)</option>
            <option value="quadratic">Quadratic (ax² + bx + c = 0)</option>
          </Select>
        </Field>

        <div className="rounded-card border border-border bg-surface-muted px-4 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            Your equation
          </p>
          <p className="mt-2 break-all font-mono text-xl font-semibold text-foreground">{preview}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={kind === "quadratic" ? "a (x²)" : "a (x)"} htmlFor="equation-a">
            <Input
              id="equation-a"
              type="number"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
              placeholder="1"
            />
          </Field>
          <Field label="b (x)" htmlFor="equation-b">
            <Input
              id="equation-b"
              type="number"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
              placeholder="-3"
            />
          </Field>
          {kind === "quadratic" ? (
            <Field label="c (constant)" htmlFor="equation-c">
              <Input
                id="equation-c"
                type="number"
                step="any"
                value={c}
                onChange={(event) => setC(event.target.value)}
                placeholder="2"
              />
            </Field>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={solve}>
            <Calculator className="size-4" aria-hidden="true" />
            Solve equation
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your equation" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="min-h-56 rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            {solution ? solution.nature : "Solution"}
          </p>
          {solution ? (
            <>
              <p className="mt-4 break-all font-mono text-2xl font-semibold text-accent">
                {solution.roots.length > 0
                  ? `x = ${solution.roots.map((root) => formatNumber(root)).join(", ")}`
                  : "No real roots"}
              </p>
              {solution.complex ? (
                <p className="mt-2 break-all font-mono text-sm text-muted-foreground">
                  {solution.complex}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">{solution.summary}</p>
            </>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">
              Solve the equation to see the roots and each working step.
            </p>
          )}
        </div>

        {solution ? (
          <div className="rounded-card border border-border bg-surface p-4">
            <p className="mb-3 text-sm font-semibold">Working steps</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {solution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}

        <ToolOutput
          label="Full solution"
          value={report}
          filename="equation-solution.txt"
          rows={6}
        />
        <p className="text-xs text-subtle-foreground">
          A quadratic with a negative discriminant has no real roots; the complex pair is shown for
          completeness.
        </p>
      </div>
    </div>
  );
}
