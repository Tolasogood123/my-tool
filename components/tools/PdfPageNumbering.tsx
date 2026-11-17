"use client";

import { useState } from "react";
import { Download, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { downloadPdf } from "@/lib/utils/pdf";
import {
  DEFAULT_PAGE_NUMBER_OPTIONS,
  numberPages,
  readPdfPageCount,
  validatePdfForNumbering,
  type PageNumberFormat,
  type PageNumberOptions,
  type PageNumberPosition,
} from "@/lib/utils/pdf-page-numbering";

const POSITIONS: Array<{ value: PageNumberPosition; label: string }> = [
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "top-center", label: "Top center" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
];

const FORMATS: Array<{ value: PageNumberFormat; label: string }> = [
  { value: "decimal", label: "1, 2, 3" },
  { value: "x-of-y", label: "1 / 10 (page of total)" },
  { value: "roman-lower", label: "i, ii, iii" },
  { value: "roman-upper", label: "I, II, III" },
  { value: "alpha-lower", label: "a, b, c" },
  { value: "alpha-upper", label: "A, B, C" },
];

export function PdfPageNumbering() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [options, setOptions] = useState<PageNumberOptions>(DEFAULT_PAGE_NUMBER_OPTIONS);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const update = <K extends keyof PageNumberOptions>(key: K, value: PageNumberOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }));

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    setFile(null);
    setBytes(null);
    setPageCount(0);

    if (!selected) return;
    const validationError = validatePdfForNumbering(selected);
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
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await numberPages(bytes, options);
      setResult(output);
      toast({ title: "Page numbers added", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not number that PDF.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, "") || "document";
    downloadPdf(result, `${baseName}-numbered.pdf`);
  };

  const reset = () => {
    setFile(null);
    setBytes(null);
    setPageCount(0);
    setOptions(DEFAULT_PAGE_NUMBER_OPTIONS);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="PDF file"
          htmlFor="page-number-file"
          hint={`Standard PDF up to ${formatBytes(MAX_PDF_UPLOAD_BYTES)}. The file is read locally in your browser.`}
        >
          <Input
            id="page-number-file"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Position" htmlFor="page-number-position">
            <Select
              id="page-number-position"
              value={options.position}
              onChange={(event) => update("position", event.target.value as PageNumberPosition)}
            >
              {POSITIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Number format" htmlFor="page-number-format">
            <Select
              id="page-number-format"
              value={options.format}
              onChange={(event) => update("format", event.target.value as PageNumberFormat)}
            >
              {FORMATS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Font size (pt)" htmlFor="page-number-size">
            <Input
              id="page-number-size"
              type="number"
              min={6}
              max={72}
              value={options.fontSize}
              onChange={(event) => update("fontSize", Number(event.target.value))}
            />
          </Field>
          <Field label="Edge margin (pt)" htmlFor="page-number-margin">
            <Input
              id="page-number-margin"
              type="number"
              min={0}
              max={200}
              value={options.margin}
              onChange={(event) => update("margin", Number(event.target.value))}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start number" htmlFor="page-number-start">
            <Input
              id="page-number-start"
              type="number"
              value={options.startNumber}
              onChange={(event) => update("startNumber", Number(event.target.value))}
            />
          </Field>
          <Field label="Text color" htmlFor="page-number-color">
            <div className="flex items-center gap-2">
              <input
                id="page-number-color"
                type="color"
                value={options.colorHex}
                onChange={(event) => update("colorHex", event.target.value)}
                className="size-10 rounded-control border border-border bg-surface p-1"
              />
              <span className="text-xs text-muted-foreground">{options.colorHex}</span>
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prefix" htmlFor="page-number-prefix" hint="e.g. “Page ”">
            <Input
              id="page-number-prefix"
              value={options.prefix}
              onChange={(event) => update("prefix", event.target.value)}
              placeholder="Page "
            />
          </Field>
          <Field label="Suffix" htmlFor="page-number-suffix" hint="e.g. “ of 10”">
            <Input
              id="page-number-suffix"
              value={options.suffix}
              onChange={(event) => update("suffix", event.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={options.skipFirst}
            onChange={(event) => update("skipFirst", event.target.checked)}
            className="size-4 rounded border-border accent-[var(--accent)]"
          />
          Skip numbering on the first page
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={apply} disabled={!bytes || busy} loading={busy}>
            <FileText className="size-4" aria-hidden="true" />
            {busy ? "Numbering…" : "Add page numbers"}
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
          <ErrorState title="Could not number the PDF" description={error} icon={FileText} />
        ) : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-6 text-center">
        <FileText className="size-10 text-subtle-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-base font-semibold">Numbered PDF preview</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {result
            ? `${pageCount} pages stamped with your format. Download the file to view it in any PDF reader.`
            : "Upload a PDF, choose a position and format, then add page numbers. The file never leaves your device."}
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
