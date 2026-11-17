"use client";

import { useEffect, useState } from "react";
import { Clock3, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  convertTimeZone,
  formatTimeZoneReport,
  getSupportedTimeZones,
  isValidTimeZone,
} from "@/lib/utils/time-zone";
import type { TimeZoneConversion } from "@/lib/utils/time-zone";

const ZONES = getSupportedTimeZones();
const DEFAULT_TARGETS = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
];

export function TimeZoneConverter() {
  const [sourceZone, setSourceZone] = useState("UTC");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [targets, setTargets] = useState<string[]>(DEFAULT_TARGETS);
  const [conversion, setConversion] = useState<TimeZoneConversion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    queueMicrotask(() => {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local && isValidTimeZone(local)) setSourceZone(local);
      setDate(new Date().toISOString().slice(0, 10));
      setTargets((current) => (current.length ? current : DEFAULT_TARGETS));
    });
  }, []);

  const addTarget = (zone: string) => {
    if (!zone || targets.includes(zone)) return;
    setTargets((current) => [...current, zone]);
  };

  const convert = () => {
    setError(null);
    setConversion(null);
    const result = convertTimeZone(date, time, sourceZone, targets);
    if (result.error || !result.conversion) {
      setError(result.error ?? "Could not convert that time.");
      return;
    }
    setConversion(result.conversion);
    toast({ title: "Time converted", variant: "success" });
  };

  const reset = () => {
    setDate("");
    setTime("09:00");
    setTargets(DEFAULT_TARGETS);
    setConversion(null);
    setError(null);
  };

  const report = conversion ? formatTimeZoneReport(conversion) : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Source time zone" htmlFor="tz-source">
          <Select
            id="tz-source"
            value={sourceZone}
            onChange={(event) => setSourceZone(event.target.value)}
          >
            {ZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="tz-date">
            <Input
              id="tz-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>
          <Field label="Time (24-hour)" htmlFor="tz-time" hint="For example 09:00 or 17:30.">
            <Input
              id="tz-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </Field>
        </div>

        <Field label="Target time zones" htmlFor="tz-add" hint="Choose a zone to add it to the comparison.">
          <div className="flex gap-2">
            <Select id="tz-add" value="" onChange={(event) => addTarget(event.target.value)}>
              <option value="">Add a time zone…</option>
              {ZONES.filter((zone) => !targets.includes(zone)).map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </Select>
            <Button variant="outline" size="icon" aria-label="Add time zone" onClick={() => addTarget(ZONES[0] ?? "UTC")}>
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Field>

        <div className="flex flex-wrap gap-2">
          {targets.length === 0 ? (
            <p className="text-sm text-subtle-foreground">No target zones added yet.</p>
          ) : (
            targets.map((zone) => (
              <span
                key={zone}
                className="inline-flex max-w-full items-center gap-1 rounded-control border border-border bg-surface-muted py-1 pl-3 pr-1 text-xs"
              >
                <span className="truncate">{zone}</span>
                <button
                  type="button"
                  aria-label={`Remove ${zone}`}
                  onClick={() => setTargets((current) => current.filter((item) => item !== zone))}
                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-border hover:text-foreground"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={convert}>
            <Clock3 className="size-4" aria-hidden="true" />
            Convert time
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not convert time" description={error} /> : null}
      </div>

      <div className="space-y-4">
        {conversion ? (
          <>
            {conversion.warning ? (
              <ErrorState title="Daylight-saving note" description={conversion.warning} />
            ) : null}
            <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                UTC instant
              </p>
              <p className="mt-3 text-lg font-semibold text-accent">{conversion.utc}</p>
              <p className="mt-2 break-all text-xs text-muted-foreground">{conversion.iso}</p>
            </div>
            <ul className="space-y-2">
              {conversion.zones.map((zone) => (
                <li key={zone.timeZone} className="rounded-control border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">{zone.label}</span>
                    <span className="text-xs text-subtle-foreground">
                      {zone.abbreviation} · {zone.offset}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm text-muted-foreground">{zone.dateTime}</p>
                  <p className="mt-1 text-xs text-subtle-foreground">{zone.timeZone}</p>
                </li>
              ))}
            </ul>
            <ToolOutput label="Conversion report" value={report} filename="time-zone-conversion.txt" rows={8} />
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Pick a source zone, date and time, then convert to see the same moment around the world.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
