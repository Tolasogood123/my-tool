"use client";

import { useState } from "react";
import { Clock3, Copy, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import {
  dateToTimestamp,
  describeTimestamp,
  formatTimestampReport,
  timestampToDate,
} from "@/lib/utils/timestamp";
import type { TimestampDetails, TimestampMode, TimestampUnit } from "@/lib/utils/timestamp";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";

export function UnixTimestampConverter() {
  const [mode, setMode] = useState<TimestampMode>("to-date");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [details, setDetails] = useState<TimestampDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const convert = () => {
    setError(null);
    setDetails(null);
    const result =
      mode === "to-date" ? timestampToDate(value, unit) : dateToTimestamp(value);

    if (result.error || !result.date) {
      setError(result.error ?? "Could not convert that value.");
      return;
    }
    setDetails(describeTimestamp(result.date));
  };

  const reset = () => {
    setMode("to-date");
    setValue("");
    setUnit("seconds");
    setDetails(null);
    setError(null);
  };

  const report = details ? formatTimestampReport(details) : "";

  const copy = async () => {
    try {
      await copyTextToClipboard(report);
      toast({ title: "Result copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Could not copy",
        description: cause instanceof Error ? cause.message : "Select the text manually.",
        variant: "error",
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Conversion direction" htmlFor="ts-mode">
          <Select
            id="ts-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as TimestampMode);
              setValue("");
              setDetails(null);
              setError(null);
            }}
          >
            <option value="to-date">Timestamp → date</option>
            <option value="to-timestamp">Date → timestamp</option>
          </Select>
        </Field>

        {mode === "to-date" ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Field label="Unix timestamp" htmlFor="ts-value" hint="Negative values are dates before 1970.">
              <Input
                id="ts-value"
                inputMode="decimal"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="1700000000"
              />
            </Field>
            <Field label="Unit" htmlFor="ts-unit">
              <Select
                id="ts-unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value as TimestampUnit)}
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </Select>
            </Field>
          </div>
        ) : (
          <Field
            label="Date and time"
            htmlFor="ts-date"
            hint="Interpreted in your device's local time zone."
          >
            <Input
              id="ts-date"
              type="datetime-local"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={convert}>
            <Clock3 className="size-4" aria-hidden="true" />
            Convert
          </Button>
          <Button variant="outline" onClick={copy} disabled={!details}>
            <Copy className="size-4" aria-hidden="true" />
            Copy result
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadText(report, "timestamp-result.txt")}
            disabled={!details}
          >
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not convert" description={error} /> : null}
      </div>

      <div className="space-y-3">
        {details ? (
          <>
            <div className="rounded-card border border-border bg-surface-muted p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
                ISO 8601
              </p>
              <p className="mt-3 break-all text-lg font-semibold text-accent">
                {details.iso}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{details.relative}</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {[
                ["Unix seconds", String(details.seconds)],
                ["Unix milliseconds", String(details.milliseconds)],
                ["UTC", details.utc],
                ["Local time", details.local],
              ].map(([label, content]) => (
                <div key={label} className="rounded-control border border-border bg-surface p-4">
                  <dt className="text-xs text-subtle-foreground">{label}</dt>
                  <dd className="mt-1 break-words font-mono text-xs text-foreground">
                    {content}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              The converted date and timestamp details will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
