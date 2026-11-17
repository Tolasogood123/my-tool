"use client";

import { useMemo, useState } from "react";
import { BarChart3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { formatNumber, formatPercentage } from "@/lib/utils/format";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is",
  "it", "of", "on", "or", "that", "the", "to", "was", "with",
]);

interface Counter {
  term: string;
  count: number;
  percent: number;
}

function tokenize(text: string): string[] {
  const Segmenter = (Intl as typeof Intl & {
    Segmenter?: new (
      locale?: string,
      options?: { granularity: "word" },
    ) => { segment(input: string): Iterable<{ isWordLike?: boolean; segment: string }> };
  }).Segmenter;

  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "word" });
    return [...segmenter.segment(text)]
      .filter((part) => part.isWordLike)
      .map((part) => part.segment.toLowerCase());
  }
  return text.toLowerCase().match(/\p{L}+/gu) ?? [];
}

function countTerms(tokens: string[], size: number, includeStopWords: boolean): Counter[] {
  const counts = new Map<string, number>();

  for (let index = 0; index <= tokens.length - size; index += 1) {
    const phrase = tokens.slice(index, index + size).join(" ");
    if (!includeStopWords && phrase.split(" ").every((word) => STOP_WORDS.has(word))) continue;
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([term, count]) => ({ term, count, percent: tokens.length ? (count / tokens.length) * 100 : 0 }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

export function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [includeStopWords, setIncludeStopWords] = useState(false);
  const [phraseSize, setPhraseSize] = useState<1 | 2 | 3>(1);

  const tokens = useMemo(() => tokenize(text), [text]);
  const counters = useMemo(
    () => countTerms(tokens, phraseSize, includeStopWords).slice(0, 15),
    [tokens, phraseSize, includeStopWords],
  );
  const maxCount = counters[0]?.count ?? 1;

  const reset = () => setText("");

  return (
    <div className="space-y-6">
      <Field label="Text to analyze" htmlFor="kd-text" hint="Paste an article, product description, or draft.">
        <Textarea
          id="kd-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste your text here…"
          className="min-h-56 text-sm leading-7"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Phrase length:</span>
          {([1, 2, 3] as const).map((size) => (
            <Button key={size} type="button" size="sm" variant={phraseSize === size ? "primary" : "outline"} onClick={() => setPhraseSize(size)}>
              {size}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeStopWords} onChange={(event) => setIncludeStopWords(event.target.checked)} className="size-4 accent-[var(--accent)]" />
          Include common words
        </label>
        <Button variant="ghost" size="sm" onClick={reset} disabled={!text}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="size-4" aria-hidden="true" />
        {formatNumber(tokens.length)} total words analyzed
      </div>

      {counters.length > 0 ? (
        <div className="scrollbar-thin max-w-full overflow-x-auto rounded-card border border-border">
          <table className="w-full min-w-[320px] table-fixed text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-subtle-foreground">
              <tr>
                <th className="w-[60%] px-4 py-3 font-medium">Term</th>
                <th className="w-[18%] px-4 py-3 text-right font-medium">Count</th>
                <th className="w-[22%] px-4 py-3 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {counters.map((counter) => (
                <tr key={counter.term}>
                  <td className="break-words px-4 py-3">
                    <span className="font-medium">{counter.term}</span>
                    <span className="mt-1 block h-1 max-w-full rounded-full bg-accent" style={{ width: `${Math.max(2, (counter.count / maxCount) * 100)}%` }} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{counter.count}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {formatPercentage(counter.percent, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          Word frequencies will appear here once you add some text.
        </p>
      )}
    </div>
  );
}
