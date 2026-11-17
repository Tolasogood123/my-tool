"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Languages, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  asciiToKhmer,
  containsKhmerDigits,
  khmerToAscii,
} from "@/lib/utils/khmer-numeral";

type Direction = "to-khmer" | "to-ascii";

export function KhmerNumeralConverter() {
  const [direction, setDirection] = useState<Direction>("to-khmer");
  const [input, setInput] = useState("");

  const output = useMemo(
    () => (direction === "to-khmer" ? asciiToKhmer(input) : khmerToAscii(input)),
    [direction, input],
  );

  const swap = () => {
    setDirection((current) => (current === "to-khmer" ? "to-ascii" : "to-khmer"));
    if (output) setInput(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion direction">
        <Button
          variant={direction === "to-khmer" ? "primary" : "outline"}
          onClick={() => setDirection("to-khmer")}
        >
          0–9 → ០–៩
        </Button>
        <Button
          variant={direction === "to-ascii" ? "primary" : "outline"}
          onClick={() => setDirection("to-ascii")}
        >
          ០–៩ → 0–9
        </Button>
        <Button variant="ghost" onClick={swap} disabled={!output}>
          <ArrowLeftRight className="size-4" aria-hidden="true" />
          Swap with result
        </Button>
      </div>

      <Field
        label={direction === "to-khmer" ? "ASCII digits" : "Khmer digits"}
        htmlFor="khmer-input"
        hint="Only the ten modern Khmer digits ០–៩ (U+17E0–U+17E9) are mapped. Other characters are left as they are."
      >
        <Textarea
          id="khmer-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={direction === "to-khmer" ? "Phone: 012 345 678" : "លេខ៖ ០១២ ៣៤៥ ៦៧៨"}
          className="min-h-32 text-sm leading-7"
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-subtle-foreground">
          {containsKhmerDigits(input)
            ? "Khmer digits detected in the input."
            : "Enter digits to see the conversion."}
        </p>
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <ToolOutput
        label={direction === "to-khmer" ? "Khmer numerals" : "ASCII numerals"}
        value={output}
        filename={direction === "to-khmer" ? "khmer-numerals.txt" : "ascii-numerals.txt"}
        rows={5}
      />

      <p className="flex items-start gap-2 text-xs text-subtle-foreground">
        <Languages className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        This tool deliberately supports only the verified modern Khmer digit range. Legacy or
        unassigned Unicode Khmer numeral code points are not converted.
      </p>
    </div>
  );
}
