"use client";

import { useTransition, useState } from "react";
import { Copy, Download, Regex, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import {
  formatRegexResult,
  runRegex,
  MAX_MATCHES,
  MAX_PATTERN_CHARS,
  MAX_TEST_TEXT_CHARS,
} from "@/lib/utils/regex";
import type { RegexResult } from "@/lib/utils/regex";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";

const FLAGS = [
  { id: "g", label: "g — find all" },
  { id: "i", label: "i — ignore case" },
  { id: "m", label: "m — multiline" },
  { id: "s", label: "s — dot matches newline" },
  { id: "u", label: "u — Unicode" },
];

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [text, setText] = useState("");
  const [result, setResult] = useState<RegexResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const toggleFlag = (flag: string) => {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag].sort(),
    );
  };

  const test = () => {
    setError(null);
    setResult(null);
    startTransition(() => {
      const output = runRegex(pattern, flags.join(""), text);
      setError(output.error);
      setResult(output.result);
    });
  };

  const reset = () => {
    setPattern("");
    setFlags(["g"]);
    setText("");
    setResult(null);
    setError(null);
  };

  const formatted = result ? formatRegexResult(result, pattern, flags.join("")) : "";

  const copy = async () => {
    try {
      await copyTextToClipboard(formatted);
      toast({ title: "Results copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Could not copy",
        description: cause instanceof Error ? cause.message : "Select the text manually.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Field
          label="Regular expression"
          htmlFor="regex-pattern"
          hint={`Pattern up to ${MAX_PATTERN_CHARS} characters.`}
        >
          <Input
            id="regex-pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="\\b\\w+@\\w+\\.\\w+\\b"
            className="font-mono text-sm"
            maxLength={MAX_PATTERN_CHARS}
          />
        </Field>
        <fieldset className="flex flex-wrap items-end gap-3">
          <legend className="mb-1 text-sm font-medium">Flags</legend>
          {FLAGS.map((flag) => (
            <label key={flag.id} className="flex items-center gap-1.5 text-xs font-medium">
              <input
                type="checkbox"
                checked={flags.includes(flag.id)}
                onChange={() => toggleFlag(flag.id)}
                className="size-4 accent-[var(--accent)]"
              />
              <span className="font-mono">{flag.id}</span>
              <span className="sr-only">{flag.label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <Field
        label="Test text"
        htmlFor="regex-text"
        hint={`Up to ${MAX_TEST_TEXT_CHARS.toLocaleString("en-US")} characters. Matching happens in your browser.`}
      >
        <Textarea
          id="regex-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste text containing examples you want to match…"
          className="min-h-48 font-mono text-xs leading-6"
          maxLength={MAX_TEST_TEXT_CHARS}
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button onClick={test} disabled={pending}>
          <Search className="size-4" aria-hidden="true" />
          {pending ? "Testing…" : "Test regex"}
        </Button>
        <Button variant="outline" onClick={copy} disabled={!result}>
          <Copy className="size-4" aria-hidden="true" />
          Copy results
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadText(formatted, "regex-results.txt")}
          disabled={!result}
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? <ErrorState title="Pattern error" description={error} icon={Regex} /> : null}

      {result ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-pill bg-accent-soft px-3 py-1 font-semibold text-accent-soft-foreground">
              {result.count} {result.count === 1 ? "match" : "matches"}
            </span>
            <span className="text-xs text-subtle-foreground">
              {result.durationMs.toFixed(1)} ms
              {result.truncated ? ` · stopped after ${MAX_MATCHES} matches` : ""}
            </span>
          </div>
          {result.matches.length === 0 ? (
            <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
              No matches. Check the pattern or try different flags.
            </p>
          ) : (
            <ol className="space-y-2">
              {result.matches.map((match, index) => (
                <li
                  key={index}
                  className="rounded-control border border-border bg-surface p-4 font-mono text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-accent">#{index + 1}</span>
                    <span className="text-subtle-foreground">
                      index {match.index} · length {match.length}
                    </span>
                  </div>
                  <p className="mt-2 break-all text-foreground">“{match.text}”</p>
                  {match.groups.map((group, groupIndex) => (
                    <p key={groupIndex} className="mt-1 break-all text-muted-foreground">
                      group {groupIndex + 1}: {group || "(empty)"}
                    </p>
                  ))}
                  {Object.entries(match.named).map(([name, value]) => (
                    <p key={name} className="mt-1 break-all text-muted-foreground">
                      named “{name}”: {value || "(undefined)"}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : null}
    </div>
  );
}
