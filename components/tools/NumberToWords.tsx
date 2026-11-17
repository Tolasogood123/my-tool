"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Type } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { numberToWords } from "@/lib/utils/number-to-words";

const EXAMPLES = ["1234", "-25", "12.05", "1000000001"];

export function NumberToWords() {
  const [input, setInput] = useState("");

  const result = useMemo(() => numberToWords(input), [input]);

  return (
    <div className="space-y-6">
      <Field
        label="Number"
        htmlFor="number-words-input"
        hint="Integers and decimals are supported. Negative numbers use “minus”. Digits after a decimal point are read one by one."
        error={result.error}
      >
        <Input
          id="number-words-input"
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. 1234567.89"
          aria-invalid={result.error ? true : undefined}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-subtle-foreground">Try:</span>
        {EXAMPLES.map((example) => (
          <Button
            key={example}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setInput(example)}
          >
            {example}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <ToolOutput
        label="In words"
        value={result.words}
        filename="number-in-words.txt"
        rows={4}
        placeholder="The English words will appear here."
      />

      <p className="flex items-start gap-2 text-xs text-subtle-foreground">
        <Type className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Very large integers are handled as text, so they do not lose precision, but scale names
        beyond vigintillion are written as powers of ten.
      </p>
    </div>
  );
}
