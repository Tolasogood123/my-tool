"use client";

import { useMemo, useState } from "react";
import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { analyzeReadability, formatReadabilityReport } from "@/lib/utils/readability";

export function ReadabilityScore() {
  const [text, setText] = useState("");
  const analysis = useMemo(() => analyzeReadability(text), [text]);

  const reset = () => setText("");
  const report = analysis.result ? formatReadabilityReport(analysis.result) : "";

  const cards = analysis.result
    ? [
        { label: "Reading ease", value: analysis.result.score.toFixed(1), highlight: true },
        { label: "US grade level", value: analysis.result.grade.toFixed(1) },
        { label: "Words", value: String(analysis.result.words) },
        { label: "Sentences", value: String(analysis.result.sentences) },
        { label: "Syllables", value: String(analysis.result.syllables) },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Text to analyze"
          htmlFor="readability-text"
          hint="Results update as you type. Uses English syllable heuristics."
        >
          <Textarea
            id="readability-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste an article or paragraph here…"
            className="min-h-72 text-sm leading-7"
          />
        </Field>
        <Button variant="ghost" onClick={reset} disabled={!text}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </Button>
        {analysis.error && text.trim() ? (
          <ErrorState title="Could not analyze" description={analysis.error} icon={BookOpen} />
        ) : null}
      </div>

      <div className="space-y-4">
        {cards.length > 0 ? (
          <>
            <div className="rounded-card border border-accent/30 bg-accent-soft p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
                {analysis.result?.label}
              </p>
              <p className="mt-3 text-5xl font-semibold text-accent">
                {analysis.result?.score.toFixed(1)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Flesch Reading Ease · grade {analysis.result?.grade.toFixed(1)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cards.slice(2).map((card) => (
                <div key={card.label} className="rounded-control border border-border bg-surface p-4 text-center">
                  <p className="text-xl font-semibold tabular-nums">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                </div>
              ))}
            </div>
            <p className="rounded-control border border-border bg-surface p-4 text-sm text-muted-foreground">
              {analysis.result?.advice}
            </p>
          </>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Readability scores appear here as you type.
            </p>
          </div>
        )}
        <ToolOutput label="Report" value={report} filename="readability-report.txt" rows={7} />
        <p className="text-xs text-subtle-foreground">
          Higher ease scores mean easier reading. Results are estimates, not a measure of content quality.
        </p>
      </div>
    </div>
  );
}
