"use client";

import { useTransition, useState } from "react";
import { Braces, Minus, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { parseJson } from "@/lib/utils/json";

type Indent = "2" | "4" | "tab";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<Indent>("2");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (mode: "format" | "minify") => {
    setError(null);
    if (!input.trim()) {
      setError("Paste some JSON first. The input is empty.");
      setOutput("");
      return;
    }

    startTransition(() => {
      const { value, error: parseError } = parseJson(input);
      if (parseError) {
        setError(
          `Invalid JSON at line ${parseError.line}, column ${parseError.column}: ${parseError.message}`,
        );
        setOutput("");
        return;
      }
      const space = indent === "tab" ? "\t" : Number(indent);
      setOutput(mode === "minify" ? JSON.stringify(value) : JSON.stringify(value, null, space));
    });
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="JSON input"
          htmlFor="json-input"
          hint="Paste a JSON object, array, or value."
        >
          <Textarea
            id="json-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={'{\n  "name": "TolaDev",\n  "tools": 15\n}'}
            className="font-mono text-xs leading-6"
          />
        </Field>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Indentation" htmlFor="json-indent">
            <Select
              id="json-indent"
              value={indent}
              onChange={(event) => setIndent(event.target.value as Indent)}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => run("format")} disabled={pending}>
            <WandSparkles className="size-4" aria-hidden="true" />
            {pending ? "Formatting…" : "Format"}
          </Button>
          <Button variant="outline" onClick={() => run("minify")} disabled={pending}>
            <Minus className="size-4" aria-hidden="true" />
            Minify
          </Button>
          <Button variant="ghost" onClick={reset} disabled={pending}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState
            title="Could not process that JSON"
            description={error}
            icon={Braces}
          />
        ) : null}
      </div>

      <ToolOutput
        label="Result"
        value={output}
        filename="formatted.json"
        mimeType="application/json;charset=utf-8"
        onClear={() => setOutput("")}
        rows={14}
      />
    </div>
  );
}
