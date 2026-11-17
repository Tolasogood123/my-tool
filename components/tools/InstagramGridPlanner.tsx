"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatBytes } from "@/lib/utils/format";
import {
  chunkRows,
  moveItem,
  validateGridImage,
} from "@/lib/utils/instagram-grid";
import type { GridImage } from "@/lib/utils/instagram-grid";

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `img-${Date.now()}-${nextId}`;
}

export function InstagramGridPlanner() {
  const [images, setImages] = useState<GridImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const urlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    setError(null);
    const problems: string[] = [];
    const created: GridImage[] = [];

    for (const file of selected) {
      const validation = validateGridImage(file);
      if (validation) {
        problems.push(`${file.name}: ${validation}`);
        continue;
      }
      const url = URL.createObjectURL(file);
      urlsRef.current.add(url);
      created.push({ id: makeId(), url, name: file.name, size: file.size });
    }

    if (created.length) setImages((current) => [...current, ...created]);
    if (problems.length) setError(problems.join(" "));
    // Let the same file be selected again after a reset or removal.
    event.target.value = "";
  };

  const move = (index: number, offset: number) => {
    setImages((current) => moveItem(current, index, offset));
  };

  const remove = (index: number) => {
    const target = images[index];
    if (!target) return;
    URL.revokeObjectURL(target.url);
    urlsRef.current.delete(target.url);
    setImages((current) => current.filter((image) => image.id !== target.id));
  };

  const clearAll = () => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current.clear();
    setImages([]);
    setError(null);
  };

  const rows = chunkRows(images, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="Add photos"
          htmlFor="grid-upload"
          hint="JPEG, PNG, or WebP up to 20 MB each. Files never leave your device."
        >
          <Input
            id="grid-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={clearAll} disabled={images.length === 0}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear all
          </Button>
        </div>

        {error ? (
          <ErrorState title="Some files were skipped" description={error} icon={Upload} />
        ) : null}

        <div className="rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">How the grid works</p>
          <p className="mt-2">
            Photos appear in the order you add them, read left to right and top to bottom. Use the
            arrow buttons on each tile to move a photo one slot at a time, then remove any you do
            not want. The three-column preview mirrors the layout visitors see on a profile grid.
          </p>
          <p className="mt-2">
            {images.length === 0
              ? "Add at least one photo to start planning."
              : `${images.length} photo${images.length === 1 ? "" : "s"} in this grid.`}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Grid preview</h3>
          <span className="text-xs text-subtle-foreground">3 columns</span>
        </div>

        {images.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5 text-center">
            <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload images to preview and reorder your profile grid here.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-3 gap-1">
                {row.map((image, columnIndex) => {
                  const index = rowIndex * 3 + columnIndex;
                  return (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-control border border-border bg-surface-muted"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 33vw, 200px"
                        className="object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded bg-surface/85 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                        {index + 1}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 bg-surface/80 text-foreground"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${image.name} left`}
                        >
                          <ChevronLeft className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 bg-surface/80 text-foreground"
                          onClick={() => remove(index)}
                          aria-label={`Remove ${image.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 bg-surface/80 text-foreground"
                          onClick={() => move(index, 1)}
                          disabled={index === images.length - 1}
                          aria-label={`Move ${image.name} right`}
                        >
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {images.length > 0 ? (
          <div className="rounded-card border border-border bg-surface p-3">
            <p className="mb-2 text-xs font-semibold">Current order</p>
            <ol className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              {images.map((image, index) => (
                <li key={image.id} className="rounded bg-surface-muted px-2 py-1">
                  {index + 1}. <span className="break-all">{image.name}</span> · {formatBytes(image.size)}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
}
