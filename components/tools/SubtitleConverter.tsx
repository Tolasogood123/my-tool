"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  RotateCcw,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import { MAX_TEXT_INPUT_CHARS } from "@/constants/limits";
import {
  convertSubtitle,
  detectFormat,
  subtitleBaseName,
  validateSubtitle,
  type ConversionDirection,
} from "@/lib/utils/subtitle-converter";

interface ConversionResult {
  output: string;
  filename: string;
  cueCount: number;
}

export function SubtitleConverter() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("srt-to-vtt");
  const [sourceName, setSourceName] = useState("subtitles");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [validation, setValidation] = useState<ReturnType<typeof validateSubtitle> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const detected = detectFormat(input);
  const formatLabel = detected === "srt" ? "SubRip (SRT)" : detected === "vtt" ? "WebVTT" : "Unknown";

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    setValidation(null);
    if (!selected) return;
    if (!/\.(srt|vtt|txt)$/i.test(selected.name)) {
      setError("Choose an .srt or .vtt subtitle file.");
      return;
    }
    if (selected.size > MAX_TEXT_INPUT_CHARS) {
      setError("That subtitle file is too large to process here.");
      return;
    }
    try {
      const text = await selected.text();
      setInput(text);
      setSourceName(subtitleBaseName(selected.name));
      toast({ title: "Subtitle file loaded", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read that subtitle file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const check = () => {
    setError(null);
    setResult(null);
    setValidation(validateSubtitle(input));
  };

  const convert = () => {
    setError(null);
    setValidation(null);
    try {
      const converted = convertSubtitle(input, direction);
      const extension = direction === "srt-to-vtt" ? "vtt" : "srt";
      setResult({
        output: converted.output,
        filename: `${sourceName}.${extension}`,
        cueCount: converted.cueCount,
      });
      toast({ title: "Subtitles converted", variant: "success" });
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Could not convert those subtitles.");
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await copyTextToClipboard(result.output);
      toast({ title: "Copied to clipboard", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not copy the result.");
    }
  };

  const reset = () => {
    setInput("");
    setDirection("srt-to-vtt");
    setSourceName("subtitles");
    setResult(null);
    setValidation(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Subtitle file (optional)"
          htmlFor="subtitle-file"
          hint="Load an .srt or .vtt file, or paste the text below directly. UTF-8 text is preserved."
        >
          <input
            ref={fileInputRef}
            id="subtitle-file"
            type="file"
            accept=".srt,.vtt,.txt,text/plain"
            onChange={onFileChange}
            className="h-auto w-full rounded-control border border-border bg-surface py-2 text-sm text-foreground transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 file:mr-3 file:rounded-control file:border-0 file:bg-surface-muted file:px-3 file:py-1 file:text-foreground"
          />
        </Field>
        <Field label="Conversion direction" htmlFor="subtitle-direction">
          <Select
            id="subtitle-direction"
            value={direction}
            onChange={(event) => setDirection(event.target.value as ConversionDirection)}
          >
            <option value="srt-to-vtt">SRT to WebVTT</option>
            <option value="vtt-to-srt">WebVTT to SRT</option>
          </Select>
        </Field>
      </div>

      <Field
        label={`Subtitle text · detected: ${formatLabel}`}
        htmlFor="subtitle-input"
        hint="Timestamps, cue order and caption text are checked before conversion."
      >
        <Textarea
          id="subtitle-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setResult(null);
            setValidation(null);
          }}
          placeholder={"1\n00:00:01,000 --> 00:00:04,000\nអរគុណ! (Thank you!)"}
          className="font-mono text-xs"
          rows={12}
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button onClick={check} variant="outline" disabled={!input.trim()}>
          <FileText className="size-4" aria-hidden="true" />
          Validate timestamps
        </Button>
        <Button onClick={convert} disabled={!input.trim()}>
          <WandSparkles className="size-4" aria-hidden="true" />
          Convert subtitles
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {validation ? (
        <div className="space-y-2 rounded-control border border-border bg-surface-muted p-4 text-sm">
          <p className="font-medium">
            {validation.cueCount} cue{validation.cueCount === 1 ? "" : "s"} found · format:{" "}
            {validation.format ?? "unknown"}
          </p>
          {validation.errors.length === 0 && validation.warnings.length === 0 ? (
            <p className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              All timestamps are valid.
            </p>
          ) : null}
          {validation.errors.map((message, index) => (
            <p key={`e-${index}`} role="alert" className="text-danger">
              {message}
            </p>
          ))}
          {validation.warnings.map((message, index) => (
            <p key={`w-${index}`} className="text-muted-foreground">
              Warning: {message}
            </p>
          ))}
        </div>
      ) : null}

      {error ? (
        <ErrorState title="Could not process subtitles" description={error} icon={FileText} />
      ) : null}

      {result ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {result.filename} · {result.cueCount} cue{result.cueCount === 1 ? "" : "s"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={copy}>
                <Clipboard className="size-4" aria-hidden="true" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadText(result.output, result.filename, "text/plain;charset=utf-8")
                }
              >
                <Download className="size-4" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>
          <Textarea
            aria-label="Converted subtitle output"
            readOnly
            value={result.output}
            rows={12}
            className="font-mono text-xs"
          />
        </div>
      ) : null}
    </div>
  );
}
