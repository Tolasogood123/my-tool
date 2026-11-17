"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, FileText, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_IMAGES_PER_PDF, imagesToPdf } from "@/lib/utils/jpg-to-pdf";
import { formatBytes } from "@/lib/utils/format";
import { downloadPdf } from "@/lib/utils/pdf";

interface ImageItem {
  id: number;
  file: File;
}

let nextId = 1;

export function JpgToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const addImages = (selected: FileList | null) => {
    if (!selected) return;
    setError(null);
    const accepted: ImageItem[] = [];

    for (const file of Array.from(selected)) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        setError(`"${file.name}" is not a JPG or PNG image. Other files were skipped.`);
        continue;
      }
      if (file.size === 0) {
        setError(`"${file.name}" is empty and was skipped.`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 20 MB and was skipped.`);
        continue;
      }
      accepted.push({ id: nextId++, file });
    }

    setImages((current) => {
      const combined = [...current, ...accepted];
      return combined.slice(0, MAX_IMAGES_PER_PDF);
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: number) => {
    setImages((current) => current.filter((item) => item.id !== id));
  };

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(images.map((item) => item.file));
      downloadPdf(bytes, "toladev-images.pdf");
      toast({
        title: "PDF created",
        description: `${images.length} ${images.length === 1 ? "page" : "pages"} generated locally.`,
        variant: "success",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the PDF.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setImages([]);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-dashed border-border bg-surface p-6">
        <label htmlFor="jpg-pdf-files" className="text-sm font-medium">
          JPG or PNG images
        </label>
        <input
          id="jpg-pdf-files"
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          onChange={(event) => addImages(event.target.files)}
          className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-control file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground"
        />
        <p className="mt-2 text-xs text-subtle-foreground">
          Up to {MAX_IMAGES_PER_PDF} images, 20 MB each. One image becomes one page in the order shown below.
        </p>
      </div>

      {images.length > 0 ? (
        <ul className="space-y-2">
          {images.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-control border border-border bg-surface p-3">
              <FileText className="size-5 shrink-0 text-subtle-foreground" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-subtle-foreground">Page {index + 1} · {formatBytes(item.file.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" size="icon" variant="ghost" aria-label="Move image up" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Move image down" onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Remove image" onClick={() => remove(item.id)}>
                  <Trash2 className="size-4 text-danger" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={create} disabled={images.length === 0 || busy}>
          {busy ? "Creating…" : "Create PDF"}
        </Button>
        <Button variant="ghost" onClick={reset} disabled={images.length === 0}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? <ErrorState title="Could not create the PDF" description={error} /> : null}
      <p className="text-xs text-subtle-foreground">
        Images are embedded directly into a PDF in your browser. No upload, no watermark.
      </p>
    </div>
  );
}
