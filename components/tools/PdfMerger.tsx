"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Combine, Download, FileText, RotateCcw, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { downloadPdf, validatePdfFile } from "@/lib/utils/pdf";

interface PdfItem {
  id: number;
  file: File;
}

let nextId = 1;

export function PdfMerger() {
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    setError(null);
    const accepted: PdfItem[] = [];

    for (const file of Array.from(selected)) {
      const validationError = validatePdfFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }
      accepted.push({ id: nextId++, file });
    }
    setFiles((current) => [...current, ...accepted]);
  };

  const move = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: number) => setFiles((current) => current.filter((item) => item.id !== id));

  const merge = async () => {
    if (files.length < 2) {
      setError("Choose at least two PDF files to merge.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();
      for (const item of files) {
        const bytes = new Uint8Array(await item.file.arrayBuffer());
        const source = await PDFDocument.load(bytes, { ignoreEncryption: false });
        const pages = await merged.copyPages(source, source.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const output = await merged.save();
      downloadPdf(output, "toladev-merged.pdf");
      toast({ title: "PDFs merged", description: `${merged.getPageCount()} pages in one file.`, variant: "success" });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `${cause.message} Password-protected or damaged PDFs cannot be merged.`
          : "Could not merge those files.",
      );
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-dashed border-border bg-surface p-6">
        <label htmlFor="pdf-merge-files" className="text-sm font-medium">
          PDF files to combine
        </label>
        <input
          id="pdf-merge-files"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(event) => addFiles(event.target.files)}
          className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-control file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground"
        />
        <p className="mt-2 text-xs text-subtle-foreground">
          Up to {formatBytes(MAX_PDF_UPLOAD_BYTES)} per file. Nothing is uploaded.
        </p>
      </div>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-control border border-border bg-surface p-3"
            >
              <FileText className="size-5 shrink-0 text-subtle-foreground" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-subtle-foreground">{formatBytes(item.file.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" size="icon" variant="ghost" aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Move down" onClick={() => move(index, 1)} disabled={index === files.length - 1}>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Remove file" onClick={() => remove(item.id)}>
                  <Trash2 className="size-4 text-danger" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={merge} disabled={files.length < 2 || busy}>
          <Combine className="size-4" aria-hidden="true" />
          {busy ? "Merging…" : "Merge PDFs"}
        </Button>
        <Button variant="ghost" onClick={reset} disabled={files.length === 0}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? (
        <ErrorState title="Could not process the PDFs" description={error} icon={FileText} />
      ) : null}
      <p className="flex items-center gap-1.5 text-xs text-subtle-foreground">
        <Download className="size-3.5" aria-hidden="true" />
        The merged file is created in your browser and downloaded directly.
      </p>
    </div>
  );
}
