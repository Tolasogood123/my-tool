"use client";

import { useState } from "react";
import { Link2, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";

type Mode = "encode" | "decode";
type Scope = "component" | "full";

export function UrlEncoderDecoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [scope, setScope] = useState<Scope>("component");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);
    if (!input.trim()) {
      setError("Paste a URL or value first. The input is empty.");
      setOutput("");
      return;
    }
    try {
      const encode = scope === "component" ? encodeURIComponent : encodeURI;
      const decode = scope === "component" ? decodeURIComponent : decodeURI;
      setOutput(mode === "encode" ? encode(input) : decode(input));
    } catch (cause) {
      setOutput("");
      setError(
        cause instanceof Error
          ? `${cause.message}. Check that every % is followed by two hexadecimal digits.`
          : "Could not decode that URL.",
      );
    }
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Mode" htmlFor="url-mode">
          <Select
            id="url-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
          >
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </Select>
        </Field>
        <Field
          label="Scope"
          htmlFor="url-scope"
          hint={scope === "component" ? "Best for a single query value." : "Keeps reserved URL characters intact."}
        >
          <Select
            id="url-scope"
            value={scope}
            onChange={(event) => setScope(event.target.value as Scope)}
          >
            <option value="component">Component (value)</option>
            <option value="full">Full URL</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Input" htmlFor="url-input">
          <Textarea
            id="url-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://example.com/search?q=hello world & សួស្តី"
            className="min-h-56 break-all font-mono text-xs leading-6"
          />
        </Field>

        <div className="space-y-4">
          <ToolOutput
            label="Result"
            value={output}
            filename={mode === "encode" ? "encoded-url.txt" : "decoded-url.txt"}
            onClear={() => setOutput("")}
            rows={10}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={convert}>
              <WandSparkles className="size-4" aria-hidden="true" />
              Convert
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
          {error ? (
            <ErrorState title="Could not process that URL" description={error} icon={Link2} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
