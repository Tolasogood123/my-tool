"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  evaluateExpression,
  formatResult,
  type AngleMode,
} from "@/lib/utils/scientific";

const QUICK_KEYS: { label: string; insert: string }[] = [
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "√", insert: "sqrt(" },
  { label: "log", insert: "log(" },
  { label: "ln", insert: "ln(" },
  { label: "π", insert: "pi" },
  { label: "e", insert: "e" },
  { label: "xʸ", insert: "^" },
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
  { label: "+", insert: "+" },
  { label: "−", insert: "-" },
  { label: "×", insert: "*" },
  { label: "÷", insert: "/" },
];

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState<AngleMode>("rad");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const insert = (token: string) => {
    setExpression((current) => current + token);
    setError(null);
  };

  const calculate = () => {
    setError(null);
    setResult(null);
    const outcome = evaluateExpression(expression, mode);
    if (outcome.error || outcome.result === null) {
      setError(outcome.error ?? "That expression could not be evaluated.");
      return;
    }
    setResult(formatResult(outcome.result));
  };

  const reset = () => {
    setExpression("");
    setResult(null);
    setError(null);
    setMode("rad");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Expression"
          htmlFor="scientific-expression"
          hint="Use + − * / ^ and brackets. Functions: sin, cos, tan, sqrt, log, ln, abs. Constants: pi, e. Press Enter to calculate."
        >
          <Input
            id="scientific-expression"
            value={expression}
            onChange={(event) => {
              setExpression(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                calculate();
              }
            }}
            placeholder="(sin(pi/2) + sqrt(16)) * 2"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
          />
        </Field>

        <Field label="Angle unit" htmlFor="scientific-mode" hint="Trigonometry uses this unit. sqrt, log and powers are unaffected.">
          <Select
            id="scientific-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as AngleMode)}
          >
            <option value="rad">Radians</option>
            <option value="deg">Degrees</option>
          </Select>
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium">Insert a token</p>
          <div className="grid grid-cols-5 gap-2">
            {QUICK_KEYS.map((key) => (
              <Button
                key={key.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insert(key.insert)}
                className="px-0 font-mono"
              >
                {key.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Calculator className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your expression" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Result
          </p>
          <p className="mt-4 w-full break-all font-mono text-3xl font-semibold tracking-tight text-accent">
            {result ?? "—"}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Mode: {mode === "rad" ? "radians" : "degrees"}
          </p>
        </div>
        <ToolOutput
          label="Result text"
          value={result ?? ""}
          filename="scientific-calculator-result.txt"
          rows={2}
        />
        <p className="text-xs text-subtle-foreground">
          Expressions are tokenized and solved with the shunting-yard algorithm. No browser eval or
          dynamic code execution is used.
        </p>
      </div>
    </div>
  );
}
