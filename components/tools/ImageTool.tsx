"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ACCEPTED_IMAGE_ACCEPT, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { downloadBlob } from "@/lib/utils/download";
import { validateImageFile } from "@/lib/utils/file";
import {
  convertImage,
  cropImage,
  stripImageMetadata,
} from "@/lib/utils/image-convert";
import type { CropRect, ImageOutput } from "@/lib/utils/image-convert";
import { loadImageFile } from "@/lib/utils/image";

export type ImageToolMode = "convert" | "crop" | "exif";

const MODES: Record<
  ImageToolMode,
  { action: string; hint: string; resultLabel: string }
> = {
  convert: {
    action: "Convert image",
    hint: "Choose a new format. WebP is usually the smallest.",
    resultLabel: "Converted image",
  },
  crop: {
    action: "Crop image",
    hint: "Set a pixel rectangle to keep. Values are relative to the original image.",
    resultLabel: "Cropped image",
  },
  exif: {
    action: "Remove metadata",
    hint: "Re-encodes the image from pixel data, which removes most embedded metadata.",
    resultLabel: "Clean image",
  },
};

export function ImageTool({ mode }: { mode: ImageToolMode }) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [original, setOriginal] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState("0.85");
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [result, setResult] = useState<ImageOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, [sourceUrl]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";

    if (!selected) {
      setFile(null);
      setSourceUrl("");
      setOriginal(null);
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
    setFile(selected);
    setSourceUrl(URL.createObjectURL(selected));

    loadImageFile(selected)
      .then((loaded) => {
        URL.revokeObjectURL(loaded.url);
        setOriginal({ width: loaded.width, height: loaded.height });
        setCrop({ x: 0, y: 0, width: loaded.width, height: loaded.height });
      })
      .catch((cause) => {
        setError(cause instanceof Error ? cause.message : "Could not read that image.");
      });
  };

  const run = async () => {
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const qualityValue = Number(quality);
      const output =
        mode === "convert"
          ? await convertImage(file, format, qualityValue)
          : mode === "crop"
            ? await cropImage(file, crop, format, qualityValue)
            : await stripImageMetadata(file, format, qualityValue);

      resultUrlRef.current = output.url;
      setResult(output);
      toast({ title: MODES[mode].resultLabel + " ready", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not process that image.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
  };

  const reset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setFile(null);
    setSourceUrl("");
    setOriginal(null);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setResult(null);
    setError(null);
  };

  const updateCrop = (patch: Partial<CropRect>) => {
    setCrop((current) => ({ ...current, ...patch }));
  };

  const applyAspect = (ratio: number | null) => {
    if (!original) return;
    if (ratio === null) {
      setCrop({ x: 0, y: 0, width: original.width, height: original.height });
      return;
    }
    const width = Math.round(Math.min(original.width, original.height * ratio));
    const height = Math.round(width / ratio);
    setCrop({
      x: Math.floor((original.width - width) / 2),
      y: Math.floor((original.height - height) / 2),
      width,
      height,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Image file"
          htmlFor="image-tool-file"
          hint={`JPG, PNG or WebP up to ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}. Never uploaded.`}
        >
          <Input id="image-tool-file" type="file" accept={ACCEPTED_IMAGE_ACCEPT} onChange={onFileChange} className="h-auto py-2" />
        </Field>

        {original ? (
          <p className="text-xs text-subtle-foreground">
            Original: {original.width} × {original.height} px
          </p>
        ) : null}

        <Field label="Output format" htmlFor="image-tool-format">
          <Select id="image-tool-format" value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </Select>
        </Field>

        {format !== "image/png" ? (
          <Field label={`Quality: ${Math.round(Number(quality) * 100)}%`} htmlFor="image-tool-quality">
            <input id="image-tool-quality" type="range" min={0.1} max={1} step={0.01} value={quality} onChange={(event) => setQuality(event.target.value)} className="w-full accent-[var(--accent)]" />
          </Field>
        ) : null}

        {mode === "crop" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Full", ratio: null },
                { label: "1:1", ratio: 1 },
                { label: "16:9", ratio: 16 / 9 },
                { label: "4:3", ratio: 4 / 3 },
              ].map((preset) => (
                <Button key={preset.label} type="button" size="sm" variant="outline" onClick={() => applyAspect(preset.ratio)} disabled={!original}>
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                ["x", "Left (px)"],
                ["y", "Top (px)"],
                ["width", "Width (px)"],
                ["height", "Height (px)"],
              ] as const).map(([key, label]) => (
                <Field key={key} label={label} htmlFor={`crop-${key}`}>
                  <Input
                    id={`crop-${key}`}
                    type="number"
                    min={0}
                    value={Math.round(crop[key])}
                    onChange={(event) => updateCrop({ [key]: Number(event.target.value) })}
                    disabled={!original}
                  />
                </Field>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!file || busy}>
            <WandSparkles className="size-4" aria-hidden="true" />
            {busy ? "Working…" : MODES[mode].action}
          </Button>
          <Button variant="outline" onClick={download} disabled={!result}>
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Image error" description={error} /> : null}
        <p className="text-xs text-subtle-foreground">{MODES[mode].hint}</p>
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {result ? (
          <>
            <Image
              src={result.url}
              alt={MODES[mode].resultLabel}
              width={400}
              height={300}
              unoptimized
              className="max-h-80 w-auto rounded-control border border-border object-contain"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              {result.width} × {result.height} px · {formatBytes(result.blob.size)}
            </p>
          </>
        ) : sourceUrl ? (
          <>
            <Image
              src={sourceUrl}
              alt="Original image preview"
              width={400}
              height={300}
              unoptimized
              className="max-h-80 w-auto rounded-control border border-border object-contain"
            />
            <p className="mt-3 text-xs text-muted-foreground">Original image</p>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Choose an image to see a preview here.
          </p>
        )}
      </div>
    </div>
  );
}
