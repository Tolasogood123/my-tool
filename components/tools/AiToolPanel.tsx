"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { NeedsApiNotice } from "@/components/tool/NeedsApiNotice";
import { AI_TASKS } from "@/lib/ai/tasks";
import type { AiTaskId } from "@/lib/ai/tasks";

interface AiToolPanelProps {
  task: AiTaskId;
  inputLabel: string;
  placeholder: string;
  outputLabel: string;
  hint: string;
  rows?: number;
}

type Status = "checking" | "ready" | "unconfigured" | "error";

export function AiToolPanel({
  task,
  inputLabel,
  placeholder,
  outputLabel,
  hint,
  rows = 10,
}: AiToolPanelProps) {
  const config = AI_TASKS[task];
  const [status, setStatus] = useState<Status>("checking");
  const [text, setText] = useState("");
  const [option, setOption] = useState(config.options?.values[0]?.value ?? "");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/ai", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { configured?: boolean }) => {
        if (!active) return;
        setStatus(data.configured ? "ready" : "unconfigured");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const generate = async () => {
    if (!text.trim()) {
      setError("Enter some text first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, text, option }),
      });
      const data = (await response.json()) as { result?: string; error?: string };

      if (!response.ok) {
        if (data.error?.includes("not configured")) setStatus("unconfigured");
        setError(data.error ?? "The request could not be completed.");
        return;
      }
      setResult(data.result ?? "");
    } catch {
      setError("Could not reach the AI service. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setText("");
    setResult("");
    setError(null);
  };

  const disabled = status !== "ready" || busy;
  const optionConfig = config.options;

  return (
    <div className="space-y-6">
      {status === "checking" ? (
        <p className="rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
          Checking whether the AI service is configured…
        </p>
      ) : null}

      {status === "unconfigured" ? (
        <NeedsApiNotice service="an OpenAI-compatible API key stored in the server environment (OPENAI_API_KEY)">
          Rate limiting and usage caps are built into the server route. No key is
          ever sent to the browser.
        </NeedsApiNotice>
      ) : null}

      {status === "error" ? (
        <ErrorState
          title="Could not check AI availability"
          description="The status endpoint did not respond. The tool stays disabled until the service can be verified."
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label={inputLabel} htmlFor={`ai-input-${task}`} hint={hint}>
            <Textarea
              id={`ai-input-${task}`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
              rows={rows}
              maxLength={config.maxInputChars}
              disabled={disabled}
              className="text-sm leading-7"
            />
          </Field>
          <p className="text-xs text-subtle-foreground">
            {text.length} / {config.maxInputChars} characters
          </p>

          {optionConfig ? (
            <Field label={optionConfig.label} htmlFor={`ai-option-${task}`}>
              <Select
                id={`ai-option-${task}`}
                value={option}
                onChange={(event) => setOption(event.target.value)}
                disabled={disabled}
              >
                {optionConfig.values.map((value) => (
                  <option key={value.value} value={value.value}>
                    {value.label}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} disabled={disabled || !text.trim()}>
              <Sparkles className="size-4" aria-hidden="true" />
              {busy ? "Working…" : optionConfig ? config.label : "Generate"}
            </Button>
            <Button variant="ghost" onClick={reset} disabled={!text && !result}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>

          {error ? (
            <ErrorState title="The AI request failed" description={error} />
          ) : null}
        </div>

        <ToolOutput
          label={outputLabel}
          value={result}
          filename={`${task}-result.txt`}
          rows={rows}
          onClear={() => setResult("")}
        />
      </div>
    </div>
  );
}
