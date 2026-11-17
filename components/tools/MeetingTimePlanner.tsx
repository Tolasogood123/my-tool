"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarRange, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { formatMeetingReport, planMeeting } from "@/lib/utils/meeting-time";
import type { MeetingParticipant, MeetingPlan } from "@/lib/utils/meeting-time";
import { getSupportedTimeZones, isValidTimeZone } from "@/lib/utils/time-zone";

const ZONES = getSupportedTimeZones();

interface ParticipantRow extends MeetingParticipant {
  id: number;
}

function initialRows(): ParticipantRow[] {
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const first = local && isValidTimeZone(local) ? local : "UTC";
  return [
    { id: 1, timeZone: first, start: "09:00", end: "17:00" },
    { id: 2, timeZone: "Europe/London", start: "09:00", end: "17:00" },
    { id: 3, timeZone: "Asia/Kolkata", start: "09:00", end: "17:00" },
  ];
}

export function MeetingTimePlanner() {
  const [date, setDate] = useState("");
  const [rows, setRows] = useState<ParticipantRow[]>([
    { id: 1, timeZone: "UTC", start: "09:00", end: "17:00" },
    { id: 2, timeZone: "Europe/London", start: "09:00", end: "17:00" },
    { id: 3, timeZone: "Asia/Kolkata", start: "09:00", end: "17:00" },
  ]);
  const [plan, setPlan] = useState<MeetingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(4);
  const { toast } = useToast();

  useEffect(() => {
    queueMicrotask(() => {
      setDate(new Date().toISOString().slice(0, 10));
      setRows(initialRows());
    });
  }, []);

  const updateRow = (id: number, patch: Partial<ParticipantRow>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    if (rows.length >= 12) return;
    setRows((current) => [
      ...current,
      { id: nextId.current++, timeZone: "America/New_York", start: "09:00", end: "17:00" },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const calculate = () => {
    setError(null);
    setPlan(null);
    const result = planMeeting(date, rows.map(({ timeZone, start, end }) => ({ timeZone, start, end })));
    if (result.error || !result.plan) {
      setError(result.error ?? "Could not plan that meeting.");
      return;
    }
    setPlan(result.plan);
    toast({ title: "Meeting window calculated", variant: "success" });
  };

  const reset = () => {
    setDate("");
    setRows(initialRows());
    setPlan(null);
    setError(null);
  };

  const report = plan ? formatMeetingReport(plan) : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Meeting date" htmlFor="meeting-date" hint="Working hours are read in each zone on this calendar date.">
          <Input
            id="meeting-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Participants and working hours</p>
            <Button variant="outline" size="sm" onClick={addRow} disabled={rows.length >= 12}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add zone
            </Button>
          </div>

          {rows.map((row, index) => (
            <div key={row.id} className="space-y-3 rounded-card border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">Zone {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove zone ${index + 1}`}
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 2}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <Field label="Time zone" htmlFor={`meeting-zone-${row.id}`}>
                <Select
                  id={`meeting-zone-${row.id}`}
                  value={row.timeZone}
                  onChange={(event) => updateRow(row.id, { timeZone: event.target.value })}
                >
                  {ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Work starts" htmlFor={`meeting-start-${row.id}`}>
                  <Input
                    id={`meeting-start-${row.id}`}
                    type="time"
                    value={row.start}
                    onChange={(event) => updateRow(row.id, { start: event.target.value })}
                  />
                </Field>
                <Field label="Work ends" htmlFor={`meeting-end-${row.id}`}>
                  <Input
                    id={`meeting-end-${row.id}`}
                    type="time"
                    value={row.end}
                    onChange={(event) => updateRow(row.id, { end: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculate}>
            <CalendarRange className="size-4" aria-hidden="true" />
            Find shared time
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check the meeting details" description={error} /> : null}
      </div>

      <div className="space-y-4">
        {plan ? (
          <>
            <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                Shared working window
              </p>
              {plan.overlap ? (
                <>
                  <p className="mt-3 text-3xl font-semibold text-accent">
                    {Math.floor(plan.overlap.minutes / 60)}h {plan.overlap.minutes % 60}m
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.overlap.localRanges.length} zones available at the same time
                  </p>
                </>
              ) : (
                <p className="mt-3 text-lg font-semibold text-accent">No overlap</p>
              )}
            </div>

            {plan.overlap ? (
              <ul className="space-y-2">
                {plan.overlap.localRanges.map((item) => (
                  <li key={item.timeZone} className="rounded-control border border-border bg-surface p-4">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.range}</p>
                    <p className="mt-1 text-xs text-subtle-foreground">{item.timeZone}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-sm font-semibold">All working windows in UTC</p>
              <ul className="mt-2 space-y-1">
                {plan.participants.map((item) => (
                  <li key={item.timeZone} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{item.label}</span> {item.utcRange} ({item.localRange})
                  </li>
                ))}
              </ul>
            </div>

            <ToolOutput label="Meeting plan report" value={report} filename="meeting-plan.txt" rows={10} />
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Add time zones and working hours, then find the window when everyone is awake and available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
