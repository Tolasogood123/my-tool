"use client";

import { useState } from "react";
import { Braces, Copy, Download, FileCode2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import {
  svgToJsx,
  validateSvgInput,
  wrapInComponent,
} from "@/lib/utils/svg-to-jsx";

const EXAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon" viewBox="0 0 24 24" width="24" height="24">
  <title>Download icon</title>
  <path fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" d="M12 3v12m0 0l-4-4m4 4l4-4" />
  <circle cx="12" cy="12" r="10" style="fill: #fff; stroke-width: 1.5px" />
  <image xlink:href="https://example.com/pixel.png" width="4" height="4" />
</svg>`;

export function SvgToJsx() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [wrap, setWrap] = useState(false);
  const [componentName, setComponentName] = useState("MyIcon");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const convert = () => {
    const validationError = validateSvgInput(input);
    if (validationError) {
      setError(validationError);
      setOutput("");
      return;
    }
    try {
      const jsx = svgToJsx(input);
      setOutput(wrap ? wrapInComponent(jsx, componentName) : jsx);
      setError(null);
      toast({ title: "Converted to JSX", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not convert that SVG.");
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await copyTextToClipboard(output);
      toast({ title: "JSX copied", variant: "success" });
    } catch {
      toast({ title: "Copy failed", description: "Your browser blocked clipboard access.", variant: "error" });
    }
  };

  const download = () => {
    if (!output) return;
    const name = wrap ? componentName.trim().replace(/[^A-Za-z0-9_]/g, "") || "SvgIcon" : "SvgIcon";
    downloadText(output, `${name}.tsx`, "text/plain;charset=utf-8");
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setWrap(false);
    setComponentName("MyIcon");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="SVG markup"
          htmlFor="svg-input"
          hint="Paste a complete <svg> element. Scripts, event handlers and javascript: URLs are removed automatically."
        >
          <Textarea
            id="svg-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
            spellCheck={false}
            className="min-h-64 font-mono text-xs"
          />
        </Field>

        <p className="text-xs text-subtle-foreground">{input.length.toLocaleString()} characters</p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={convert} disabled={!input.trim()}>
            <Braces className="size-4" aria-hidden="true" />
            Convert to JSX
          </Button>
          <Button variant="outline" onClick={() => { setInput(EXAMPLE_SVG); setOutput(""); setError(null); }}>
            <Sparkles className="size-4" aria-hidden="true" />
            Load example
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        <div className="space-y-4 rounded-card border border-border bg-surface p-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={wrap}
              onChange={(event) => setWrap(event.target.checked)}
              className="size-4 rounded border-border accent-[var(--accent)]"
            />
            Wrap in a typed React component
          </label>
          {wrap ? (
            <Field label="Component name" htmlFor="svg-component-name">
              <Input
                id="svg-component-name"
                value={componentName}
                onChange={(event) => setComponentName(event.target.value)}
                placeholder="MyIcon"
              />
            </Field>
          ) : null}
        </div>

        {error ? (
          <ErrorState title="Could not convert that SVG" description={error} icon={FileCode2} />
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Converted JSX</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
              <Copy className="size-4" aria-hidden="true" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={download} disabled={!output}>
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          </div>
        </div>

        <div className="min-h-64 overflow-auto rounded-card border border-border bg-surface-muted p-4">
          {output ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-foreground">
              <code>{output}</code>
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your JSX will appear here. Attributes like <code>class</code>,{' '}
              <code>stroke-width</code> and <code>xlink:href</code> are converted for React, and
              inline <code>style</code> strings become style objects.
            </p>
          )}
        </div>

        <p className="text-xs text-subtle-foreground">
          Output is plain JSX markup — no <code>dangerouslySetInnerHTML</code>. Review the result
          before using untrusted artwork in production.
        </p>
      </div>
    </div>
  );
}
