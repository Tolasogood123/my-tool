"use client";

import { useState } from "react";
import { FileText, RotateCcw, Scissors, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { downloadPdf, validatePdfFile } from "@/lib/utils/pdf";

/** Parses "1-3, 5, 8" into a sorted list of unique 1-based page numbers. */
function parsePages(input: string, totalPages: number): number[] {
  const pages = new Set<number>();

  for (const part of input.split(",")) {
    const token = part.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);

    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start > end) throw new Error(`Invalid range "${token}": start is after end.`);
      for (let page = start; page <= end; page += 1) pages.add(page);
    } else if (/^\d+$/.test(token)) {
      pages.add(Number(token));
    } else {
      throw new Error(`"${token}" is not a page number or range.`);
    }
  }

  const result = [...pages].sort((a, b) => a - b);
  if (result.length === 0) throw new Error("Enter at least one page or range.");
  for (const page of result) {
    if (page < 1 || page > totalPages) {
      throw new Error(`Page ${page} is outside the document (1–${totalPages}).`);
    }
  }
  return result;
}

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesInput, setPagesInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setPageCount(0);
    setPagesInput("");
    setFile(null);

    if (!selected) return;
    const validationError = validatePdfFile(selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const document = await PDFDocument.load(new Uint8Array(await selected.arrayBuffer()));
      setFile(selected);
      setPageCount(document.getPageCount());
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `${cause.message} Password-protected or damaged PDFs cannot be read.`
          : "Could not read that PDF.",
      );
    }
  };

  const split = async () => {
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const document = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
      const pages = parsePages(pagesInput, document.getPageCount());
      const output = await PDFDocument.create();
      const copied = await output.copyPages(document, pages.map((page) => page - 1));
      copied.forEach((page) => output.addPage(page));
      const bytes = await output.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-selected-pages.pdf`);
      toast({
        title: "PDF split",
        description: `${pages.length} ${pages.length === 1 ? "page" : "pages"} extracted.`,
        variant: "success",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not split that PDF.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setPagesInput("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="PDF file"
          htmlFor="pdf-split-file"
          hint={`Standard PDF up to ${formatBytes(MAX_PDF_UPLOAD_BYTES)}. Read locally in your browser.`}
        >
          <Input id="pdf-split-file" type="file" accept="application/pdf,.pdf" onChange={onFileChange} className="h-auto py-2" />
        </Field>

        {file ? (
          <div className="rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-1">{formatBytes(file.size)} · {pageCount} pages</p>
          </div>
        ) : null}

        <Field label="Pages to extract" htmlFor="pdf-pages" hint="Examples: 1-3, 5, 8. Duplicates are removed.">
          <Input
            id="pdf-pages"
            value={pagesInput}
            onChange={(event) => setPagesInput(event.target.value)}
            placeholder={pageCount ? `1-${pageCount}` : "1-3, 5"}
            disabled={!file}
          />
        </Field>

        {pageCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setPagesInput(`1-${pageCount}`)}>
            Select all pages
          </Button>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={split} disabled={!file || busy}>
            <Scissors className="size-4" aria-hidden="true" />
            {busy ? "Splitting…" : "Split PDF"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check the PDF or page range" description={error} icon={FileText} /> : null}
      </div>

      <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-8 text-center">
        <FileText className="size-10 text-subtle-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-base font-semibold">Your extracted pages</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          The selected pages are copied into a new PDF in your browser and downloaded as a separate file.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-subtle-foreground">
          <Download className="size-3.5" aria-hidden="true" />
          No upload, no email, no watermark.
        </p>
      </div>
    </div>
  );
}
