"use client";

import { useMemo, useState } from "react";
import { FileCode2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  GITIGNORE_TEMPLATES,
  buildGitignore,
} from "@/lib/utils/gitignore";

const DEFAULT_SELECTION = ["node", "nextjs", "vscode", "macos"];

export function GitignoreGenerator() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [includeHeader, setIncludeHeader] = useState(true);

  const output = useMemo(
    () => buildGitignore({ selectedIds: selected, includeHeader }),
    [selected, includeHeader],
  );

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const reset = () => {
    setSelected(DEFAULT_SELECTION);
    setIncludeHeader(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">
            Pick stacks ({selected.length} selected)
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected(GITIGNORE_TEMPLATES.map((t) => t.id))}>
              Select all
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {GITIGNORE_TEMPLATES.map((template) => {
            const checked = selected.includes(template.id);
            return (
              <label
                key={template.id}
                className={`flex cursor-pointer items-center gap-3 rounded-control border px-3 py-2.5 text-sm transition-colors ${
                  checked
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(template.id)}
                  className="size-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="min-w-0">{template.label}</span>
              </label>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeHeader}
            onChange={(event) => setIncludeHeader(event.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Include a generated header comment
        </label>

        <p className="flex items-center gap-2 text-xs text-subtle-foreground">
          <FileCode2 className="size-3.5" aria-hidden="true" />
          Duplicate rules are removed automatically. Download the result as <code className="font-mono">.gitignore</code>.
        </p>
      </div>

      <div className="space-y-4">
        <ToolOutput
          label=".gitignore contents"
          value={output}
          filename=".gitignore"
          mimeType="text/plain;charset=utf-8"
          rows={18}
          placeholder="Select one or more stacks to build your .gitignore file."
        />
      </div>
    </div>
  );
}
