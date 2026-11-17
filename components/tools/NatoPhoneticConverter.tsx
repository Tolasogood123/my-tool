"use client";

import { useMemo, useState } from "react";
import { Languages, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { countLetters, NATO_ALPHABET, textToNato } from "@/lib/utils/nato-phonetic";

export function NatoPhoneticConverter() {
  const [input, setInput] = useState("");

  const output = useMemo(() => textToNato(input), [input]);
  const letters = useMemo(() => countLetters(input), [input]);

  return (
    <div className="space-y-6">
      <Field
        label="Text"
        htmlFor="nato-input"
        hint="A–Z letters become NATO code words. Digits, spaces and punctuation pass through unchanged."
      >
        <Textarea
          id="nato-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Meeting at gate B7"
          className="min-h-32 text-sm leading-7"
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-subtle-foreground">
          {letters} {letters === 1 ? "letter" : "letters"} will be spelled out.
        </p>
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <ToolOutput
        label="NATO phonetic words"
        value={output}
        filename="nato-phonetic.txt"
        rows={5}
      />

      <details className="rounded-card border border-border bg-surface p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Show the full A–Z reference alphabet
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {NATO_ALPHABET.map((entry) => (
            <p key={entry.letter} className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{entry.letter}</span> – {entry.word}
            </p>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-subtle-foreground">
          <Languages className="size-3.5" aria-hidden="true" />
          Spelling words make letters unambiguous over noisy radio and phone lines.
        </p>
      </details>
    </div>
  );
}
