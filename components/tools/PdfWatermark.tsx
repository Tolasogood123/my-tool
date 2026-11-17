"use client";

import { useState } from "react";
import { Download, Droplets, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { downloadPdf } from "@/lib/utils/pdf";
import {
  DEFAULT_WATERMARK_OPTIONS,
  drawWatermark,
  readPdfPageCount,
  validatePdfForWatermark,
  validateWatermarkText,
  type WatermarkOptions,
  type WatermarkPlacement,
} from "@/lib/utils/pdf-watermark";

const PLACEMENTS: Array<{ value: WatermarkPlacement; label: string }> = [
  { value: "diagonal", label: "Diagonal across page" },
  { value: "center", label: "Centered" },
  { value: "tiled", label: "Tiled (repeating)" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [options, setOptions] = useState<WatermarkOptions>(DEFAULT_WATERMARK_OPTIONS);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const update = <K extends keyof WatermarkOptions>(key: K, value: WatermarkOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }));

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    setFile(null);
    setBytes(null);
    setPageCount(0);

    if (!selected) return;
    const validationError = validatePdfForWatermark(selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const data = new Uint8Array(await selected.arrayBuffer());
      const count = await readPdfPageCount(data);
      setBytes(data);
      setFile(selected);
      setPageCount(count);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `${cause.message} Password-protected or damaged PDFs cannot be read.`
          : "Could not read that PDF.",
      );
    }
  };

  const apply = async () => {
    if (!bytes) {
      setError("Choose a PDF file first.");
      return;
    }
    const textError = validateWatermarkText(options.text);
    if (textError) {
      setError(textError);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await drawWatermark(bytes, options);
      setResult(output);
      toast({ title: "Watermark applied", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not watermark that PDF.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, "") || "document";
    downloadPdf(result, `${baseName}-watermarked.pdf`);
  };

  const reset = () => {
    setFile(null);
    setBytes(null);
    setPageCount(0);
    setOptions(DEFAULT_WATERMARK_OPTIONS);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="PDF file"
          htmlFor="watermark-file"
          hint={`Standard PDF up to ${formatBytes(MAX_PDF_UPLOAD_BYTES)}. Processed entirely in your browser.`}
        >
          <Input
            id="watermark-file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        {file ? (
          <div className="rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-1">{formatBytes(file.size)} · {pageCount} pages</p>
          </div>
        ) : null}

        <Field label="Watermark text" htmlFor="watermark-text" required>
          <Input
            id="watermark-text"
            value={options.text}
            onChange={(event) => update("text", event.target.value)}
            placeholder="CONFIDENTIAL"
            maxLength={120}
          />
        </Field>

        <Field label="Placement" htmlFor="watermark-placement">
          <Select
            id="watermark-placement"
            value={options.placement}
            onChange={(event) => update("placement", event.target.value as WatermarkPlacement)}
          >
            {PLACEMENTS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`Opacity: ${Math.round(options.opacity * 100)}%`} htmlFor="watermark-opacity">
            <input
              id="watermark-opacity"
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={options.opacity}
              onChange={(event) => update("opacity", Number(event.target.value))}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </Field>
          <Field label={`Rotation: ${options.rotation}°`} htmlFor="watermark-rotation">
            <input
              id="watermark-rotation"
              type="range"
              min={-180}
              max={180}
              step={5}
              value={options.rotation}
              onChange={(event) => update("rotation", Number(event.target.value))}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Font size (pt)" htmlFor="watermark-size">
            <Input
              id="watermark-size"
              type="number"
              min={8}
              max={200}
              value={options.fontSize}
              onChange={(event) => update("fontSize", Number(event.target.value))}
            />
          </Field>
          <Field label="Text color" htmlFor="watermark-color">
            <div className="flex items-center gap-2">
              <input
                id="watermark-color"
                type="color"
                value={options.colorHex}
                onChange={(event) => update("colorHex", event.target.value)}
                className="size-10 rounded-control border border-border bg-surface p-1"
              />
              <span className="text-xs text-muted-foreground">{options.colorHex}</span>
            </div>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={options.bold}
            onChange={(event) => update("bold", event.target.checked)}
            className="size-4 rounded border-border accent-[var(--accent)]"
          />
          Bold text
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={apply} disabled={!bytes || busy} loading={busy}>
            <Droplets className="size-4" aria-hidden="true" />
            {busy ? "Applying…" : "Apply watermark"}
          </Button>
          <Button variant="outline" onClick={download} disabled={!result}>
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? (
          <ErrorState title="Could not apply the watermark" description={error} icon={FileText} />
        ) : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-border">
          <span className="rotate-[-20deg] text-xs font-bold uppercase tracking-widest text-subtle-foreground">
            {options.text.trim() || "preview"}
          </span>
        </div>
        <h2 className="mt-5 text-base font-semibold">Watermark preview</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The text, opacity, angle and color you choose are drawn over every page. Open the
          downloaded PDF to see the final result.
        </p>
        {result ? (
          <p className="mt-4 text-xs text-subtle-foreground">
            Output ready · {formatBytes(result.byteLength)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
