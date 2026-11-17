"use client";

import { useTransition, useState } from "react";
import { Copy, Download, GitCompareArrows, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import {
  diffLines,
  formatUnifiedDiff,
  validateDiffInput,
  MAX_DIFF_LINES,
} from "@/lib/utils/diff";
import type { DiffResult } from "@/lib/utils/diff";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";

export function TextDiffChecker() {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const compare = () => {
    setError(null);
    setResult(null);

    if (!before.trim() && !after.trim()) {
      setError("Paste text into at least one side before comparing.");
      return;
    }

    const validationError = validateDiffInput(before, after);
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(() => {
      setResult(diffLines(before, after));
    });
  };

  const reset = () => {
    setBefore("");
    setAfter("");
    setResult(null);
    setError(null);
  };

  const unified = result ? formatUnifiedDiff(result) : "";

  const copy = async () => {
    try {
      await copyTextToClipboard(unified);
      toast({ title: "Diff copied to clipboard", variant: "success" });
    } catch (cause) {
      toast({
        title: "Could not copy",
        description: cause instanceof Error ? cause.message : "Select the text manually.",
        variant: "error",
      });
    }
  };

  const download = () => {
    downloadText(unified, "text-diff.txt");
    toast({ title: "Diff downloaded", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Original text" htmlFor="diff-before" hint={`Up to ${MAX_DIFF_LINES} lines.`}>
          <Textarea
            id="diff-before"
            value={before}
            onChange={(event) => setBefore(event.target.value)}
            placeholder={"Line one\nLine two"}
            className="min-h-56 font-mono text-xs leading-6"
          />
        </Field>
        <Field label="Changed text" htmlFor="diff-after" hint="Compare against the original.">
          <Textarea
            id="diff-after"
            value={after}
            onChange={(event) => setAfter(event.target.value)}
            placeholder={"Line one\nChanged line"}
            className="min-h-56 font-mono text-xs leading-6"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={compare} disabled={pending}>
          <GitCompareArrows className="size-4" aria-hidden="true" />
          {pending ? "Comparing…" : "Compare text"}
        </Button>
        <Button variant="outline" onClick={copy} disabled={!result}>
          <Copy className="size-4" aria-hidden="true" />
          Copy diff
        </Button>
        <Button variant="outline" onClick={download} disabled={!result}>
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? <ErrorState title="Could not compare" description={error} /> : null}

      {result ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <span className="rounded-pill bg-success-soft px-3 py-1 text-success">
              +{result.added} added
            </span>
            <span className="rounded-pill bg-danger-soft px-3 py-1 text-danger">
              −{result.removed} removed
            </span>
            <span className="rounded-pill bg-surface-muted px-3 py-1 text-muted-foreground">
              {result.unchanged} unchanged
            </span>
          </div>
          <div
            aria-label="Line diff result"
            className="scrollbar-thin max-h-96 overflow-auto rounded-card border border-border bg-surface font-mono text-xs"
          >
            {result.lines.map((line, index) => (
              <div
                key={index}
                className={`flex gap-3 border-b border-border/50 px-3 py-1 leading-6 last:border-b-0 ${
                  line.type === "added"
                    ? "bg-success-soft/60 text-success"
                    : line.type === "removed"
                      ? "bg-danger-soft/60 text-danger"
                      : "text-muted-foreground"
                }`}
              >
                <span className="w-8 shrink-0 select-none text-right opacity-60">
                  {line.leftLine ?? ""}
                </span>
                <span className="w-8 shrink-0 select-none text-right opacity-60">
                  {line.rightLine ?? ""}
                </span>
                <span className="w-3 shrink-0 select-none font-bold">
                  {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                </span>
                <span className="min-w-0 whitespace-pre-wrap break-words">{line.text || " "}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-subtle-foreground">
            Left column: original line number. Right column: changed line number. Comparison runs locally.
          </p>
        </div>
      ) : null}
    </div>
  );
}
