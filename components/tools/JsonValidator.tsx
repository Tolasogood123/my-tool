"use client";

import { useTransition, useState } from "react";
import { CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { getJsonStats, parseJson } from "@/lib/utils/json";
import { formatNumber } from "@/lib/utils/format";

export function JsonValidator() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof getJsonStats> | null>(null);
  const [pending, startTransition] = useTransition();

  const validate = () => {
    if (!input.trim()) {
      setStatus("invalid");
      setMessage("Nothing to validate — paste some JSON first.");
      setStats(null);
      return;
    }

    startTransition(() => {
      const { value, error } = parseJson(input);
      if (error) {
        setStatus("invalid");
        setMessage(
          `Syntax error at line ${error.line}, column ${error.column}. ${error.message}`,
        );
        setStats(null);
        return;
      }
      setStatus("valid");
      setMessage(null);
      setStats(getJsonStats(value));
    });
  };

  const reset = () => {
    setInput("");
    setStatus("idle");
    setMessage(null);
    setStats(null);
  };

  const cards = stats
    ? [
        { label: "Keys", value: stats.keys },
        { label: "Arrays", value: stats.arrays },
        { label: "Strings", value: stats.strings },
        { label: "Numbers", value: stats.numbers },
        { label: "Booleans", value: stats.booleans },
        { label: "Null values", value: stats.nulls },
        { label: "Max depth", value: stats.maxDepth },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="JSON to validate" htmlFor="validator-input" hint="Checked with the standard JSON parser built into your browser.">
          <Textarea
            id="validator-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='{\n  "valid": true\n}'
            className="min-h-72 font-mono text-xs leading-6"
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button onClick={validate} disabled={pending}>
            <ShieldCheck className="size-4" aria-hidden="true" />
            {pending ? "Checking…" : "Validate"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {status === "invalid" && message ? (
          <ErrorState title="Invalid JSON" description={message} />
        ) : null}
        {status === "valid" ? (
          <div className="flex items-start gap-3 rounded-card border border-success/30 bg-success-soft p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Valid JSON</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Parsed successfully in your browser. Nothing was uploaded.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold">Structure report</h2>
        {stats ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-control border border-border bg-surface p-4"
                >
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatNumber(card.value)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                </div>
              ))}
            </div>
            {stats.duplicates.length > 0 ? (
              <div className="rounded-card border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
                <p className="font-semibold">Duplicate keys found</p>
                <p className="mt-1 text-xs">
                  Most parsers keep the last value: {stats.duplicates.slice(0, 5).join(", ")}
                  {stats.duplicates.length > 5 ? "…" : ""}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 text-center">
            <ShieldCheck className="size-6 text-subtle-foreground" aria-hidden="true" />
            <p className="mt-3 text-sm text-muted-foreground">
              Validation results and structure statistics will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
