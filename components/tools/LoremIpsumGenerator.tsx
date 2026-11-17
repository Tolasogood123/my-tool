"use client";

import { useState } from "react";
import { RotateCcw, Sparkles, Type } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { countWords, generateLorem, type LoremMode } from "@/lib/utils/lorem";

export function LoremIpsumGenerator() {
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [count, setCount] = useState("3");
  const [classic, setClassic] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    const parsed = Math.max(1, Math.floor(Number(count) || 1));
    setOutput(generateLorem(mode, parsed, classic));
  };

  const reset = () => {
    setMode("paragraphs");
    setCount("3");
    setClassic(true);
    setOutput("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Generate" htmlFor="lorem-mode">
            <Select id="lorem-mode" value={mode} onChange={(event) => setMode(event.target.value as LoremMode)}>
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </Select>
          </Field>
          <Field label={`Amount (${mode})`} htmlFor="lorem-count">
            <Input
              id="lorem-count"
              type="number"
              min={1}
              max={mode === "words" ? 2000 : mode === "sentences" ? 500 : 100}
              step="1"
              inputMode="numeric"
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
          </Field>
        </div>

        {mode !== "words" ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={classic}
              onChange={(event) => setClassic(event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Start with the classic “Lorem ipsum…” text
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <Sparkles className="size-4" aria-hidden="true" />
            Generate text
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        <p className="flex items-center gap-2 text-xs text-subtle-foreground">
          <Type className="size-4" aria-hidden="true" />
          {output ? `${countWords(output)} words generated.` : "Runs entirely in your browser — nothing is sent anywhere."}
        </p>
      </div>

      <ToolOutput
        label="Generated placeholder text"
        value={output}
        rows={14}
        filename="lorem-ipsum.txt"
        placeholder="Your generated text will appear here."
        onClear={() => setOutput("")}
      />
    </div>
  );
}
