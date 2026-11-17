"use client";

import { useState } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  bedtimesForWake,
  formatSleepReport,
  SLEEP_DISCLAIMER,
  wakeTimesForBedtime,
} from "@/lib/utils/sleep-cycle";
import type { SleepMode, SleepOption } from "@/lib/utils/sleep-cycle";

const CYCLE_CHOICES = [4, 5, 6];

export function SleepCycleCalculator() {
  const [mode, setMode] = useState<SleepMode>("wake");
  const [anchor, setAnchor] = useState("07:00");
  const [fallAsleep, setFallAsleep] = useState("15");
  const [cycles, setCycles] = useState<number[]>(CYCLE_CHOICES);
  const [options, setOptions] = useState<SleepOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleCycle = (value: number) => {
    setCycles((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const calculate = () => {
    setError(null);
    setOptions([]);
    const result =
      mode === "wake"
        ? bedtimesForWake(anchor, Number(fallAsleep), cycles)
        : wakeTimesForBedtime(anchor, Number(fallAsleep), cycles);
    if (result.error || result.options.length === 0) {
      setError(result.error ?? "Choose at least one cycle count.");
      return;
    }
    setOptions(result.options);
    toast({ title: "Sleep options ready", variant: "success" });
  };

  const reset = () => {
    setMode("wake");
    setAnchor("07:00");
    setFallAsleep("15");
    setCycles(CYCLE_CHOICES);
    setOptions([]);
    setError(null);
  };

  const report = options.length ? formatSleepReport(mode, anchor, options) : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="What do you know?" htmlFor="sleep-mode">
          <div className="flex flex-wrap gap-2" id="sleep-mode">
            <Button
              variant={mode === "wake" ? "primary" : "outline"}
              onClick={() => setMode("wake")}
            >
              I know my wake time
            </Button>
            <Button
              variant={mode === "bedtime" ? "primary" : "outline"}
              onClick={() => setMode("bedtime")}
            >
              I know my bedtime
            </Button>
          </div>
        </Field>

        <Field
          label={mode === "wake" ? "Target wake time" : "Bedtime"}
          htmlFor="sleep-anchor"
        >
          <Input
            id="sleep-anchor"
            type="time"
            value={anchor}
            onChange={(event) => setAnchor(event.target.value)}
          />
        </Field>

        <Field
          label="Minutes to fall asleep"
          htmlFor="sleep-fall"
          hint="Average time between getting into bed and actually sleeping."
        >
          <Input
            id="sleep-fall"
            type="number"
            min={0}
            max={120}
            step={1}
            value={fallAsleep}
            onChange={(event) => setFallAsleep(event.target.value)}
          />
        </Field>

        <Field label="Cycle counts to compare" htmlFor="sleep-cycles">
          <div className="flex flex-wrap gap-4" id="sleep-cycles">
            {CYCLE_CHOICES.map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cycles.includes(value)}
                  onChange={() => toggleCycle(value)}
                  className="size-4 accent-[var(--accent)]"
                />
                {value} cycles ({value * 1.5} hr)
              </label>
            ))}
          </div>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <Timer className="size-4" aria-hidden="true" />
            Calculate options
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check the sleep details" description={error} /> : null}

        <div className="rounded-card border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold">Non-medical disclaimer</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{SLEEP_DISCLAIMER}</p>
        </div>
      </div>

      <div className="space-y-4">
        {options.length ? (
          <>
            <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                {mode === "wake" ? "Suggested bedtimes" : "Suggested wake times"}
              </p>
              <p className="mt-3 text-3xl font-semibold text-accent">{options[0]?.clock}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {options[0]?.cycles} cycles · {options[0]?.duration} of sleep
              </p>
            </div>

            <ul className="space-y-2">
              {options.map((option) => (
                <li key={option.cycles} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-4">
                  <span className="text-sm font-medium">
                    {option.cycles} {option.cycles === 1 ? "cycle" : "cycles"}
                  </span>
                  <span className="text-sm text-muted-foreground">{option.duration}</span>
                  <span className="text-base font-semibold text-accent">{option.clock}</span>
                </li>
              ))}
            </ul>

            <ToolOutput label="Sleep plan report" value={report} filename="sleep-plan.txt" rows={10} />
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Enter a wake time or bedtime to see options that land on full 90-minute cycles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
