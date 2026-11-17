"use client";

import { useState } from "react";
import {
  CalendarDays,
  Download,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { useToast } from "@/components/ui/Toast";
import { downloadText } from "@/lib/utils/download";
import {
  generateTimetable,
  timetableToCsv,
  timetableToHtml,
  validateTimetableConfig,
  type SubjectInput,
  type TimetableResult,
} from "@/lib/utils/study-timetable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Row {
  id: number;
  name: string;
  hours: string;
  priority: string;
}

let nextId = 1;
const makeRow = (name = "", hours = "", priority = "3"): Row => ({
  id: nextId++,
  name,
  hours,
  priority,
});

const defaultSubjects = (): Row[] => [
  makeRow("Mathematics", "5", "5"),
  makeRow("Biology", "4", "4"),
  makeRow("History", "3", "3"),
];
const defaultDays = () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function StudyTimetableGenerator() {
  const [subjects, setSubjects] = useState<Row[]>(defaultSubjects);
  const [days, setDays] = useState<string[]>(defaultDays);
  const [sessionMinutes, setSessionMinutes] = useState("50");
  const [startHour, setStartHour] = useState("9");
  const [endHour, setEndHour] = useState("18");
  const [result, setResult] = useState<TimetableResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const update = (id: number, patch: Partial<Row>) => {
    setSubjects((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const toggleDay = (day: string) => {
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  };

  const generate = () => {
    setError(null);
    setResult(null);
    const parsedSubjects: SubjectInput[] = subjects.map((row) => ({
      name: row.name,
      hours: row.hours.trim() === "" ? Number.NaN : Number(row.hours),
      priority: row.priority.trim() === "" ? 0 : Number(row.priority),
    }));
    const config = {
      subjects: parsedSubjects,
      days,
      sessionMinutes: Number(sessionMinutes),
      startHour: Number(startHour),
      endHour: Number(endHour),
    };
    const validation = validateTimetableConfig(config);
    if (validation) {
      setError(validation);
      return;
    }
    const output = generateTimetable(config);
    if (output.rows.length === 0) {
      setError("No sessions could be placed. Check the study window and subject hours.");
      return;
    }
    setResult(output);
  };

  const csv = result ? timetableToCsv(result.rows) : "";

  const downloadCsv = () => {
    if (!csv) return;
    downloadText(csv, "study-timetable.csv", "text/csv;charset=utf-8");
    toast({ title: "CSV downloaded", variant: "success" });
  };

  const print = () => {
    if (!result || result.rows.length === 0) {
      toast({ title: "Generate a timetable first", variant: "error" });
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Popup blocked",
        description: "Allow popups for this site, then try printing again.",
        variant: "error",
      });
      return;
    }
    printWindow.document.open();
    printWindow.document.write(timetableToHtml(result.rows, "My Study Timetable"));
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
  };

  const reset = () => {
    setSubjects(defaultSubjects());
    setDays(defaultDays());
    setSessionMinutes("50");
    setStartHour("9");
    setEndHour("18");
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Subjects</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSubjects((current) => [...current, makeRow()])}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add subject
            </Button>
          </div>
          {subjects.map((row, index) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-card border border-border bg-surface p-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] sm:items-end"
            >
              <Field label={`Subject ${index + 1}`} htmlFor={`subject-name-${row.id}`}>
                <Input
                  id={`subject-name-${row.id}`}
                  value={row.name}
                  onChange={(event) => update(row.id, { name: event.target.value })}
                  placeholder="Physics"
                />
              </Field>
              <Field label="Hours / week" htmlFor={`subject-hours-${row.id}`}>
                <Input
                  id={`subject-hours-${row.id}`}
                  type="number"
                  min={0}
                  step={0.5}
                  value={row.hours}
                  onChange={(event) => update(row.id, { hours: event.target.value })}
                  placeholder="4"
                />
              </Field>
              <Field label="Priority" htmlFor={`subject-priority-${row.id}`}>
                <Input
                  id={`subject-priority-${row.id}`}
                  type="number"
                  min={1}
                  max={10}
                  value={row.priority}
                  onChange={(event) => update(row.id, { priority: event.target.value })}
                  placeholder="3"
                />
              </Field>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={`Remove subject ${index + 1}`}
                onClick={() => setSubjects((current) => current.filter((item) => item.id !== row.id))}
                disabled={subjects.length === 1}
              >
                <Trash2 className="size-4 text-danger" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <Field label="Study days" htmlFor="timetable-days" hint="Pick the days you can study each week.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAYS.map((day) => (
              <label
                key={day}
                className="flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  id={day === DAYS[0] ? "timetable-days" : undefined}
                  checked={days.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="size-4 accent-[var(--accent)]"
                />
                {day}
              </label>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Session (min)" htmlFor="timetable-session">
            <Input
              id="timetable-session"
              type="number"
              min={10}
              max={480}
              value={sessionMinutes}
              onChange={(event) => setSessionMinutes(event.target.value)}
            />
          </Field>
          <Field label="Start hour" htmlFor="timetable-start">
            <Input
              id="timetable-start"
              type="number"
              min={0}
              max={23}
              value={startHour}
              onChange={(event) => setStartHour(event.target.value)}
            />
          </Field>
          <Field label="End hour" htmlFor="timetable-end">
            <Input
              id="timetable-end"
              type="number"
              min={1}
              max={24}
              value={endHour}
              onChange={(event) => setEndHour(event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <CalendarDays className="size-4" aria-hidden="true" />
            Generate timetable
          </Button>
          <Button variant="outline" onClick={downloadCsv} disabled={!result}>
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={print} disabled={!result}>
            <Printer className="size-4" aria-hidden="true" />
            Print
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your plan" description={error} /> : null}
        {result?.warnings.map((warning, index) => (
          <p key={index} role="status" className="text-xs font-medium text-danger">
            {warning}
          </p>
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Weekly schedule</p>
            {result ? (
              <p className="text-xs text-muted-foreground">
                {(result.totalMinutes / 60).toFixed(1)} h planned
              </p>
            ) : null}
          </div>
          {result ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {days
                .filter((day) => result.rows.some((row) => row.day === day))
                .map((day) => (
                  <div key={day} className="rounded-control border border-border bg-surface-muted p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                      {day}
                    </p>
                    <ul className="space-y-2">
                      {result.rows
                        .filter((row) => row.day === day)
                        .map((row, index) => (
                          <li
                            key={`${day}-${index}`}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-control border border-border bg-surface px-3 py-2 text-sm"
                          >
                            <span className="font-medium">{row.subject}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {row.start}–{row.end} · {row.minutes} min
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Add subjects and study days, then generate your timetable here.
            </p>
          )}
        </div>

        <ToolOutput label="CSV export" value={csv} filename="study-timetable.csv" mimeType="text/csv;charset=utf-8" rows={5} />
        <p className="text-xs text-subtle-foreground">
          Higher-priority subjects are placed first and sessions are spread evenly across your chosen
          days. Printing opens a clean, printer-friendly page in a new tab.
        </p>
      </div>
    </div>
  );
}
