"use client";

import { useState } from "react";
import { CaseUpper, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";

type CaseStyle =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

const styles: { id: CaseStyle; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
];

function wordsFrom(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s\-_]+/)
    .filter(Boolean);
}

function convert(text: string, style: CaseStyle): string {
  const words = wordsFrom(text);

  switch (style) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );
    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "camel":
      return words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");
    case "pascal":
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    case "snake":
      return words.map((word) => word.toLowerCase()).join("_");
    case "kebab":
      return words.map((word) => word.toLowerCase()).join("-");
  }
}

export function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [style, setStyle] = useState<CaseStyle>("upper");

  const apply = (nextStyle: CaseStyle) => {
    setStyle(nextStyle);
    setOutput(input ? convert(input, nextStyle) : "");
  };

  const reset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <Field label="Text" htmlFor="case-input" hint="Khmer has no letter case, so only Latin text changes.">
        <Textarea
          id="case-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="User profile settings"
          className="min-h-40 text-sm leading-7"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        {styles.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={style === item.id ? "primary" : "outline"}
            onClick={() => apply(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => apply(style)} disabled={!input}>
          <WandSparkles className="size-4" aria-hidden="true" />
          Convert
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <ToolOutput
        label="Converted text"
        value={output}
        filename="converted-text.txt"
        onClear={() => setOutput("")}
        rows={8}
      />
      <p className="flex items-center gap-2 text-xs text-subtle-foreground">
        <CaseUpper className="size-3.5" aria-hidden="true" />
        Programming styles split on spaces, hyphens, underscores, and camelCase boundaries.
      </p>
    </div>
  );
}
