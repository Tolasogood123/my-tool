"use client";

import { useState } from "react";
import { ArrowLeftRight, Binary, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";

type Mode = "encode" | "decode";

/** Encodes UTF-8 bytes in chunks so large inputs never overflow the argument stack. */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function decodeBase64(encoded: string): string {
  const cleaned = encoded.replace(/\s+/g, "");
  if (!cleaned) throw new Error("There is nothing to decode.");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
    throw new Error("This is not valid Base64: check for stray characters or missing padding.");
  }
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);
    if (!input.trim()) {
      setError(mode === "encode" ? "Paste text to encode first." : "Paste Base64 to decode first.");
      setOutput("");
      return;
    }
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Conversion failed.");
    }
  };

  const swap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    setMode(nextMode);
    setInput(output);
    setOutput(input);
    setError(null);
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Mode" htmlFor="base64-mode">
          <Select
            id="base64-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
          >
            <option value="encode">Text → Base64</option>
            <option value="decode">Base64 → Text</option>
          </Select>
        </Field>
        <Button variant="outline" onClick={swap} disabled={!output}>
          <ArrowLeftRight className="size-4" aria-hidden="true" />
          Swap
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label={mode === "encode" ? "Text" : "Base64"}
          htmlFor="base64-input"
          hint={mode === "encode" ? "Unicode is supported, including Khmer and emoji." : "Whitespace and line breaks are ignored."}
        >
          <Textarea
            id="base64-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "encode" ? "Hello, world! សួស្តី" : "SGVsbG8sIHdvcmxkIQ=="}
            className="min-h-56 font-mono text-xs leading-6"
          />
        </Field>

        <div className="space-y-4">
          <ToolOutput
            label="Result"
            value={output}
            filename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
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
            <ErrorState title="Conversion failed" description={error} icon={Binary} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
