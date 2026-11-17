"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Link2, Lock, RotateCcw, Scaling, Unlink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ACCEPTED_IMAGE_ACCEPT, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import {
  canvasToBlob,
  extensionForType,
  loadImageFile,
} from "@/lib/utils/image";
import { formatBytes, formatNumber } from "@/lib/utils/format";
import { sanitizeFilename, validateImageFile } from "@/lib/utils/file";

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [original, setOriginal] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const resultUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResultUrl("");
    setResultSize(0);

    if (!selected) {
      setFile(null);
      setSourceUrl("");
      setOriginal(null);
      setWidth("");
      setHeight("");
      return;
    }

    const validationError = validateImageFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setSourceUrl("");
      setOriginal(null);
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    const url = URL.createObjectURL(selected);
    setFile(selected);
    setSourceUrl(url);

    loadImageFile(selected)
      .then(({ width: w, height: h, url: loadedUrl }) => {
        URL.revokeObjectURL(loadedUrl);
        setOriginal({ width: w, height: h });
        setWidth(String(w));
        setHeight(String(h));
      })
      .catch((cause) => {
        setError(cause instanceof Error ? cause.message : "Could not read that image.");
      });
  };

  const setDimension = (which: "width" | "height", value: string) => {
    if (which === "width") setWidth(value);
    else setHeight(value);

    if (!locked || !original) return;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return;

    if (which === "width") {
      setHeight(String(Math.max(1, Math.round((numeric / original.width) * original.height))));
    } else {
      setWidth(String(Math.max(1, Math.round((numeric / original.height) * original.width))));
    }
  };

  const resize = async () => {
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    const targetWidth = Math.round(Number(width));
    const targetHeight = Math.round(Number(height));
    if (
      !Number.isInteger(targetWidth) ||
      !Number.isInteger(targetHeight) ||
      targetWidth < 1 ||
      targetHeight < 1
    ) {
      setError("Enter a valid width and height in whole pixels (at least 1).");
      return;
    }
    if (targetWidth > 10000 || targetHeight > 10000) {
      setError("Dimensions must be 10,000 pixels or less on each side.");
      return;
    }

    setBusy(true);
    setError(null);
    let loadedUrl = "";
    try {
      const loaded = await loadImageFile(file);
      loadedUrl = loaded.url;
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available in this browser.");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(loaded.image, 0, 0, targetWidth, targetHeight);

      const blob = await canvasToBlob(canvas, format);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultUrl(url);
      setResultSize(blob.size);
      toast({
        title: "Image resized",
        description: `${formatNumber(targetWidth)} × ${formatNumber(targetHeight)} px · ${formatBytes(blob.size)}`,
        variant: "success",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Resizing failed.");
    } finally {
      if (loadedUrl) URL.revokeObjectURL(loadedUrl);
      setBusy(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${sanitizeFilename(file.name)}-resized.${extensionForType(format)}`;
    link.click();
  };

  const reset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setFile(null);
    setSourceUrl("");
    setOriginal(null);
    setWidth("");
    setHeight("");
    setResultUrl("");
    setResultSize(0);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Image file"
          htmlFor="resize-file"
          hint={`JPG, PNG, or WebP up to ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}. Processed locally.`}
        >
          <Input
            id="resize-file"
            type="file"
            accept={ACCEPTED_IMAGE_ACCEPT}
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        {original ? (
          <p className="text-xs text-subtle-foreground">
            Original: {formatNumber(original.width)} × {formatNumber(original.height)} px
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Width (px)" htmlFor="resize-width">
            <Input
              id="resize-width"
              type="number"
              min={1}
              max={10000}
              value={width}
              onChange={(event) => setDimension("width", event.target.value)}
            />
          </Field>
          <Field label="Height (px)" htmlFor="resize-height">
            <Input
              id="resize-height"
              type="number"
              min={1}
              max={10000}
              value={height}
              onChange={(event) => setDimension("height", event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocked((value) => !value)}
            aria-pressed={locked}
          >
            {locked ? (
              <Lock className="size-4" aria-hidden="true" />
            ) : (
              <Unlink className="size-4" aria-hidden="true" />
            )}
            {locked ? "Aspect ratio locked" : "Free dimensions"}
          </Button>
          <Field label="Format" htmlFor="resize-format">
            <Select
              id="resize-format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </Select>
          </Field>
        </div>

        {original ? (
          <div className="flex flex-wrap gap-2">
            {[25, 50, 75, 100, 150].map((percent) => (
              <Button
                key={percent}
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  const w = Math.max(1, Math.round((original.width * percent) / 100));
                  const h = Math.max(1, Math.round((original.height * percent) / 100));
                  setWidth(String(w));
                  setHeight(String(h));
                }}
              >
                {percent}%
              </Button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={resize} disabled={!file || busy}>
            <Scaling className="size-4" aria-hidden="true" />
            {busy ? "Resizing…" : "Resize image"}
          </Button>
          <Button variant="outline" onClick={download} disabled={!resultUrl}>
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Image error" description={error} icon={Link2} /> : null}
        {resultSize > 0 ? (
          <p className="text-sm text-muted-foreground">
            Output size: {formatBytes(resultSize)}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-72 items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {resultUrl ? (
          <Image
            src={resultUrl}
            alt="Resized image preview"
            width={400}
            height={300}
            unoptimized
            className="max-h-80 w-auto rounded-control border border-border object-contain"
          />
        ) : sourceUrl ? (
          <Image
            src={sourceUrl}
            alt="Original image preview"
            width={400}
            height={300}
            unoptimized
            className="max-h-80 w-auto rounded-control border border-border object-contain"
          />
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Choose an image to see a preview here.
          </p>
        )}
      </div>
    </div>
  );
}
