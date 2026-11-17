"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { filterHttpStatuses, formatHttpStatuses } from "@/lib/utils/http-status";
import type { StatusGroup } from "@/lib/utils/http-status";

const GROUPS: Array<{ value: StatusGroup; label: string }> = [
  { value: "all", label: "All classes" },
  { value: "1xx", label: "1xx — Informational" },
  { value: "2xx", label: "2xx — Success" },
  { value: "3xx", label: "3xx — Redirection" },
  { value: "4xx", label: "4xx — Client error" },
  { value: "5xx", label: "5xx — Server error" },
];

function badgeClass(code: number): string {
  const family = Math.floor(code / 100);
  if (family === 4 || family === 5) {
    return "inline-flex shrink-0 items-center rounded-pill bg-danger-soft px-2.5 py-1 font-mono text-xs font-bold text-danger";
  }
  if (family === 3) {
    return "inline-flex shrink-0 items-center rounded-pill bg-warning-soft px-2.5 py-1 font-mono text-xs font-bold text-warning";
  }
  return "inline-flex shrink-0 items-center rounded-pill bg-accent-soft px-2.5 py-1 font-mono text-xs font-bold text-accent-soft-foreground";
}

export function HttpStatusReference() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<StatusGroup>("all");

  const results = useMemo(() => filterHttpStatuses(query, group), [query, group]);
  const report = formatHttpStatuses(results);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Field
          label="Search status codes"
          htmlFor="status-search"
          hint="Search by number, name or words in the explanation."
        >
          <Input
            id="status-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. 404, redirect, timeout"
          />
        </Field>
        <Field label="Status class" htmlFor="status-group">
          <Select
            id="status-group"
            value={group}
            onChange={(event) => setGroup(event.target.value as StatusGroup)}
          >
            {GROUPS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{results.length}</span>{" "}
        {results.length === 1 ? "code" : "codes"}.
      </p>

      {results.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center">
          <Search className="mx-auto size-6 text-subtle-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            No codes match that search. Try a number or a simpler word.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((item) => (
            <li
              key={item.code}
              className="flex flex-col gap-2 rounded-control border border-border bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
            >
              <span className={badgeClass(item.code)}>{item.code}</span>
              <div className="min-w-0">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.explanation}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToolOutput
        label="Visible status codes"
        value={report}
        filename="http-status-codes.txt"
        rows={12}
      />
    </div>
  );
}
