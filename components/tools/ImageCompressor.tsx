"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, ImageDown, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import {
  ACCEPTED_IMAGE_ACCEPT,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/constants/limits";
import {
  canvasToBlob,
  extensionForType,
  loadImageFile,
} from "@/lib/utils/image";
import { formatBytes } from "@/lib/utils/format";
import { sanitizeFilename, validateImageFile } from "@/lib/utils/file";

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState("0.78");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const resultUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
    // URLs are managed manually along with their state changes.
  }, [sourceUrl]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResultUrl("");
    setResultSize(0);

    if (!selected) {
      setFile(null);
      setSourceUrl("");
      setDimensions(null);
      return;
    }

    const validationError = validateImageFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setSourceUrl("");
      setDimensions(null);
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    const url = URL.createObjectURL(selected);
    setFile(selected);
    setSourceUrl(url);
    setDimensions(null);

    loadImageFile(selected)
      .then(({ width, height, url: loadedUrl }) => {
        URL.revokeObjectURL(loadedUrl);
        setDimensions({ width, height });
      })
      .catch((cause) => {
        setError(cause instanceof Error ? cause.message : "Could not read that image.");
      });
  };

  const compress = async () => {
    if (!file) {
      setError("Choose an image first.");
      return;
    }

    setBusy(true);
    setError(null);
    let loadedUrl = "";
    try {
      const loaded = await loadImageFile(file);
      loadedUrl = loaded.url;
      const canvas = document.createElement("canvas");
      canvas.width = loaded.width;
      canvas.height = loaded.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available in this browser.");
      context.drawImage(loaded.image, 0, 0);

      const blob = await canvasToBlob(canvas, format, Number(quality));
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultUrl(url);
      setResultSize(blob.size);
      toast({
        title: "Image compressed",
        description: `${formatBytes(file.size)} → ${formatBytes(blob.size)}`,
        variant: "success",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Compression failed.");
    } finally {
      if (loadedUrl) URL.revokeObjectURL(loadedUrl);
      setBusy(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${sanitizeFilename(file.name)}-compressed.${extensionForType(format)}`;
    link.click();
  };

  const reset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setFile(null);
    setSourceUrl("");
    setDimensions(null);
    setResultUrl("");
    setResultSize(0);
    setError(null);
  };

  const savings =
    file && resultSize > 0
      ? Math.max(0, Math.round((1 - resultSize / file.size) * 100))
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Image file"
          htmlFor="compress-file"
          hint={`JPG, PNG, or WebP up to ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}. Your file is never uploaded.`}
        >
          <Input
            id="compress-file"
            type="file"
            accept={ACCEPTED_IMAGE_ACCEPT}
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Output format" htmlFor="compress-format">
            <Select
              id="compress-format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
            >
              <option value="image/webp">WebP (smallest)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG (lossless)</option>
            </Select>
          </Field>
          <Field
            label={`Quality: ${Math.round(Number(quality) * 100)}%`}
            htmlFor="compress-quality"
          >
            <input
              id="compress-quality"
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(event) => setQuality(event.target.value)}
              disabled={format === "image/png"}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </Field>
        </div>
        {format === "image/png" ? (
          <p className="text-xs text-subtle-foreground">
            PNG is lossless, so the quality setting does not apply. Choose WebP or JPEG for smaller files.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={compress} disabled={!file || busy}>
            <ImageDown className="size-4" aria-hidden="true" />
            {busy ? "Compressing…" : "Compress"}
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

        {error ? <ErrorState title="Image error" description={error} icon={Upload} /> : null}

        {file ? (
          <div className="rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-1">
              {formatBytes(file.size)}
              {dimensions ? ` · ${dimensions.width} × ${dimensions.height} px` : ""}
              {resultSize > 0 ? ` → ${formatBytes(resultSize)}` : ""}
              {savings !== null ? ` · ${savings}% smaller` : ""}
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5 text-center">
          {resultUrl ? (
            <>
              <Image
                src={resultUrl}
                alt="Compressed image preview"
                width={400}
                height={300}
                unoptimized
                className="max-h-72 w-auto rounded-control border border-border object-contain"
              />
              <p className="mt-3 text-xs text-muted-foreground">Compressed preview</p>
            </>
          ) : sourceUrl ? (
            <>
              <Image
                src={sourceUrl}
                alt="Original image preview"
                width={400}
                height={300}
                unoptimized
                className="max-h-72 w-auto rounded-control border border-border object-contain"
              />
              <p className="mt-3 text-xs text-muted-foreground">Original image</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Choose an image to see a preview here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
