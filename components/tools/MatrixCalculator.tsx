"use client";

import { useMemo, useState } from "react";
import { Calculator, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  addMatrices,
  determinantMatrix,
  dimensions,
  inverseMatrix,
  multiplyMatrices,
  parseMatrix,
  subtractMatrices,
  transposeMatrix,
  type Matrix,
  type MatrixResult,
} from "@/lib/utils/matrix";

type Operation = "add" | "subtract" | "multiply" | "determinant" | "inverse" | "transpose-a" | "transpose-b";

const EXAMPLE_A = "1 2\n3 4";
const EXAMPLE_B = "5 6\n7 8";

interface Display {
  label: string;
  text: string;
  matrix: Matrix | null;
}

export function MatrixCalculator() {
  const [aText, setAText] = useState(EXAMPLE_A);
  const [bText, setBText] = useState(EXAMPLE_B);
  const [operation, setOperation] = useState<Operation>("multiply");
  const [display, setDisplay] = useState<Display | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedA = useMemo(() => parseMatrix(aText), [aText]);
  const parsedB = useMemo(() => parseMatrix(bText), [bText]);
  const needsB =
    operation === "add" ||
    operation === "subtract" ||
    operation === "multiply" ||
    operation === "transpose-b";

  const describe = (matrix: Matrix | null) => {
    if (!matrix) return "empty";
    const { rows, cols } = dimensions(matrix);
    return `${rows}×${cols}`;
  };

  const calculate = () => {
    setError(null);
    setDisplay(null);

    if (parsedA.error || (needsB && parsedB.error)) {
      setError(parsedA.error ?? parsedB.error ?? "Check your matrices.");
      return;
    }
    if (!parsedA.matrix) {
      setError("Enter matrix A before calculating.");
      return;
    }
    if (needsB && !parsedB.matrix) {
      setError("This operation needs matrix B as well.");
      return;
    }

    const a = parsedA.matrix;
    const b = parsedB.matrix ?? [];
    let outcome: MatrixResult;
    let label: string;

    switch (operation) {
      case "add":
        outcome = addMatrices(a, b);
        label = "A + B";
        break;
      case "subtract":
        outcome = subtractMatrices(a, b);
        label = "A − B";
        break;
      case "multiply":
        outcome = multiplyMatrices(a, b);
        label = "A × B";
        break;
      case "determinant":
        outcome = determinantMatrix(a);
        label = "det(A)";
        break;
      case "inverse":
        outcome = inverseMatrix(a);
        label = "A⁻¹";
        break;
      case "transpose-b":
        outcome = transposeMatrix(b);
        label = "Bᵀ";
        break;
      case "transpose-a":
      default:
        outcome = transposeMatrix(a);
        label = "Aᵀ";
        break;
    }

    if (outcome.error) {
      setError(outcome.error);
      return;
    }

    if (outcome.scalar !== null) {
      setDisplay({ label, text: String(outcome.scalar), matrix: null });
      return;
    }
    const matrix = outcome.matrix ?? [];
    setDisplay({ label, text: formatCells(matrix), matrix });
  };

  const reset = () => {
    setAText(EXAMPLE_A);
    setBText(EXAMPLE_B);
    setOperation("multiply");
    setDisplay(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Matrix A"
            htmlFor="matrix-a"
            hint={`${describe(parsedA.matrix)} · one row per line, values separated by spaces`}
            error={parsedA.error}
          >
            <Textarea
              id="matrix-a"
              value={aText}
              onChange={(event) => setAText(event.target.value)}
              rows={4}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </Field>
          <Field
            label="Matrix B"
            htmlFor="matrix-b"
            hint={`${describe(parsedB.matrix)} · needed for add / subtract / multiply`}
            error={parsedB.error}
          >
            <Textarea
              id="matrix-b"
              value={bText}
              onChange={(event) => setBText(event.target.value)}
              rows={4}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </Field>
        </div>

        <Field label="Operation" htmlFor="matrix-operation">
          <Select
            id="matrix-operation"
            value={operation}
            onChange={(event) => {
              setOperation(event.target.value as Operation);
              setError(null);
            }}
          >
            <option value="add">Add (A + B)</option>
            <option value="subtract">Subtract (A − B)</option>
            <option value="multiply">Multiply (A × B)</option>
            <option value="determinant">Determinant of A</option>
            <option value="inverse">Inverse of A</option>
            <option value="transpose-a">Transpose of A</option>
            <option value="transpose-b">Transpose of B</option>
          </Select>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Calculator className="size-4" aria-hidden="true" />
            Calculate
          </Button>
          <Button variant="outline" onClick={reset}>
            <Sparkles className="size-4" aria-hidden="true" />
            Load example
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your matrices" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="min-h-56 rounded-card border border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            {display ? display.label : "Result"}
          </p>
          {display ? (
            display.matrix ? (
              <div
                className="mt-5 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${display.matrix[0]?.length ?? 1}, minmax(0, 1fr))` }}
              >
                {display.matrix.flatMap((row, rowIndex) =>
                  row.map((value, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="rounded-control border border-border bg-surface-muted px-2 py-3 text-center font-mono text-sm tabular-nums"
                    >
                      {formatCell(value)}
                    </div>
                  )),
                )}
              </div>
            ) : (
              <p className="mt-4 break-all font-mono text-3xl font-semibold text-accent">
                {display.text}
              </p>
            )
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Enter two matrices and choose an operation. Your result will appear here.
            </p>
          )}
        </div>
        <ToolOutput
          label="Result text"
          value={display?.text ?? ""}
          filename="matrix-result.txt"
          rows={4}
        />
        <p className="text-xs text-subtle-foreground">
          Addition requires equal dimensions; multiplication requires A&apos;s columns to equal B&apos;s
          rows. Determinants and inverses require square matrices.
        </p>
      </div>
    </div>
  );
}

function formatCell(value: number): string {
  if (Math.abs(value) < 1e-10) return "0";
  const cleaned = Number(value.toPrecision(12));
  return Number.isInteger(cleaned) ? String(cleaned) : cleaned.toFixed(4).replace(/\.?0+$/, "");
}

function formatCells(matrix: Matrix): string {
  const widths = matrix[0].map((_, col) => Math.max(...matrix.map((row) => formatCell(row[col]).length)));
  return matrix
    .map((row) => row.map((value, col) => formatCell(value).padStart(widths[col])).join("  "))
    .join("\n");
}
