"use client";

import { useMemo, useState } from "react";
import { Link2, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "how",
  "in", "is", "it", "of", "on", "or", "that", "the", "to", "was", "what", "when",
  "where", "which", "with", "you", "your",
]);

type Separator = "-" | "_" | "none";

function makeSlug(title: string, separator: Separator, removeStopWords: boolean): string {
  const folded = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const tokenPattern = new RegExp("[\\p{L}\\p{N}]+", "gu");
  const tokens = folded.match(tokenPattern) ?? [];
  const kept = removeStopWords ? tokens.filter((token) => !STOP_WORDS.has(token)) : tokens;
  const joiner = separator === "none" ? "" : separator;
  return kept.join(joiner);
}

export function SlugGenerator() {
  const [title, setTitle] = useState("");
  const [separator, setSeparator] = useState<Separator>("-");
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [auto, setAuto] = useState(true);
  const [applied, setApplied] = useState("");

  const liveSlug = useMemo(
    () => makeSlug(title, separator, removeStopWords),
    [title, separator, removeStopWords],
  );

  const generate = () => {
    setApplied(liveSlug);
    setAuto(false);
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (auto) setApplied(makeSlug(value, separator, removeStopWords));
  };

  const reset = () => {
    setTitle("");
    setApplied("");
    setAuto(true);
  };

  const slug = auto ? liveSlug : applied;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Page title" htmlFor="slug-title">
          <Input
            id="slug-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="How to Compress Images for the Web"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Separator" htmlFor="slug-separator">
            <Select id="slug-separator" value={separator} onChange={(event) => { setSeparator(event.target.value as Separator); setAuto(true); }}>
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="none">None</option>
            </Select>
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(event) => { setRemoveStopWords(event.target.checked); setAuto(true); }}
              className="size-4 accent-[var(--accent)]"
            />
            Remove stop words
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate} disabled={!title}>
            <WandSparkles className="size-4" aria-hidden="true" />
            Generate slug
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {slug ? (
          <div className="rounded-card border border-border bg-surface p-4">
            <p className="text-xs font-medium text-subtle-foreground">Preview URL</p>
            <p className="mt-1 break-all font-mono text-sm text-foreground">
              example.com/<span className="text-accent">{slug}</span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <ToolOutput
          label="Slug"
          value={slug}
          filename="slug.txt"
          rows={3}
        />
        <p className="flex items-center gap-1.5 text-xs text-subtle-foreground">
          <Link2 className="size-3.5" aria-hidden="true" />
          Keep slugs short and readable. Changing a published slug requires a redirect.
        </p>
      </div>
    </div>
  );
}
