"use client";

import { useMemo, useState } from "react";
import { Clock3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  CRON_FIELD_KEYS,
  CRON_FIELD_OPTIONS,
  DEFAULT_CRON_BUILDER,
  buildExpression,
  describeCron,
  formatRunDate,
  getNextRuns,
  validateCronExpression,
} from "@/lib/utils/cron";
import type { CronBuilder } from "@/lib/utils/cron";

const FIELD_LABELS: Record<keyof CronBuilder, string> = {
  minute: "Minute (0–59)",
  hour: "Hour (0–23)",
  dayOfMonth: "Day of month (1–31)",
  month: "Month (1–12)",
  dayOfWeek: "Day of week (0–7)",
};

function initialSelection(): Record<keyof CronBuilder, string> {
  const result = {} as Record<keyof CronBuilder, string>;
  for (const key of CRON_FIELD_KEYS) {
    const value = DEFAULT_CRON_BUILDER[key];
    const exists = CRON_FIELD_OPTIONS[key].some((option) => option.value === value);
    result[key] = exists ? value : "__custom__";
  }
  return result;
}

function emptyCustom(): Record<keyof CronBuilder, string> {
  return { minute: "", hour: "", dayOfMonth: "", month: "", dayOfWeek: "" };
}

export function CronGenerator() {
  const [selection, setSelection] = useState<Record<keyof CronBuilder, string>>(initialSelection);
  const [custom, setCustom] = useState<Record<keyof CronBuilder, string>>(emptyCustom);

  const builder = useMemo(() => {
    const result = {} as CronBuilder;
    for (const key of CRON_FIELD_KEYS) {
      result[key] = selection[key] === "__custom__" ? custom[key].trim() : selection[key];
    }
    return result;
  }, [selection, custom]);

  const expression = buildExpression(builder);
  const error = validateCronExpression(expression);
  const description = error ? "" : describeCron(expression);
  const runs = error ? [] : getNextRuns(expression, 5);

  const report = error
    ? ""
    : [
        `Expression: ${expression}`,
        `Meaning: ${description}`,
        "",
        "Next 5 run times (local time):",
        ...runs.map((run, index) => `${index + 1}. ${formatRunDate(run)}`),
      ].join("\n");

  const reset = () => {
    setSelection(initialSelection());
    setCustom(emptyCustom());
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {CRON_FIELD_KEYS.map((key) => (
            <Field key={key} label={FIELD_LABELS[key]} htmlFor={`cron-${key}`}>
              <Select
                id={`cron-${key}`}
                value={selection[key]}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelection((current) => ({ ...current, [key]: value }));
                  if (value !== "__custom__" && custom[key]) {
                    setCustom((current) => ({ ...current, [key]: "" }));
                  }
                }}
              >
                {CRON_FIELD_OPTIONS[key].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {selection[key] === "__custom__" ? (
                <Input
                  className="mt-2 font-mono text-xs"
                  aria-label={`Custom ${key} value`}
                  value={custom[key]}
                  onChange={(event) => setCustom((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder="e.g. */5, 1-5, 0,6"
                />
              ) : null}
            </Field>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4 text-accent" aria-hidden="true" />
            Expression builder
          </p>
          <p className="mt-2 font-mono text-lg font-semibold tracking-tight text-accent">{expression}</p>
          <p className="mt-1 text-xs text-subtle-foreground">
            Standard 5-field cron: minute, hour, day of month, month, day of week.
          </p>
        </div>

        {error ? <ErrorState title="Check your expression" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <ToolOutput label="Cron summary" value={report} filename="cron-summary.txt" rows={10} />

        {!error ? (
          <>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                In plain English
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{description}</p>
            </div>

            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                Next 5 runs
              </p>
              <ol className="mt-3 space-y-2">
                {runs.map((run, index) => (
                  <li
                    key={`${run.getTime()}-${index}`}
                    className="flex items-center gap-3 rounded-control bg-surface-muted px-3 py-2 text-sm"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                      {index + 1}
                    </span>
                    <time dateTime={run.toISOString()}>{formatRunDate(run)}</time>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
