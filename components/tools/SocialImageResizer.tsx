"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, RotateCcw, Scaling, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import { loadImageFile } from "@/lib/utils/image";
import {
  clampDimension,
  renderResized,
  SOCIAL_PRESETS,
  validateSocialImage,
} from "@/lib/utils/social-image";
import type { ResizeMode } from "@/lib/utils/social-image";

interface Result {
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
}

export function SocialImageResizer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [presetId, setPresetId] = useState(SOCIAL_PRESETS[0].id);
  const [width, setWidth] = useState(SOCIAL_PRESETS[0].width);
  const [height, setHeight] = useState(SOCIAL_PRESETS[0].height);
  const [mode, setMode] = useState<ResizeMode>("cover");
  const [background, setBackground] = useState("#ffffff");
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/jpeg");
  const [quality, setQuality] = useState("0.9");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceUrlRef = useRef("");
  const resultUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const releaseResult = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setResult(null);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    releaseResult();

    if (!selected) {
      setImage(null);
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = "";
      setSourceUrl("");
      return;
    }

    const validation = validateSocialImage(selected);
    if (validation) {
      setError(validation);
      setImage(null);
      return;
    }

    try {
      const loaded = await loadImageFile(selected);
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = loaded.url;
      setSourceUrl(loaded.url);
      setImage(loaded.image);
      setFileName(selected.name);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read that image.");
      setImage(null);
    }
    event.target.value = "";
  };

  const applyPreset = (id: string) => {
    const preset = SOCIAL_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setWidth(preset.width);
    setHeight(preset.height);
    releaseResult();
  };

  const generate = async () => {
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    const targetWidth = clampDimension(Number(width), 1080);
    const targetHeight = clampDimension(Number(height), 1080);
    setBusy(true);
    setError(null);
    let created = "";

    try {
      const output = await renderResized(
        image,
        targetWidth,
        targetHeight,
        mode,
        background,
        format,
        Number(quality),
        fileName,
      );
      created = output.url;
      releaseResult();
      resultUrlRef.current = output.url;
      setResult({
        url: output.url,
        filename: output.filename,
        size: output.blob.size,
        width: targetWidth,
        height: targetHeight,
      });
      toast({ title: "Image resized", variant: "success" });
    } catch (cause) {
      if (created) URL.revokeObjectURL(created);
      setError(cause instanceof Error ? cause.message : "Could not resize that image.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    releaseResult();
    setImage(null);
    setSourceUrl("");
    setFileName("");
    setPresetId(SOCIAL_PRESETS[0].id);
    setWidth(SOCIAL_PRESETS[0].width);
    setHeight(SOCIAL_PRESETS[0].height);
    setMode("cover");
    setBackground("#ffffff");
    setFormat("image/jpeg");
    setQuality("0.9");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="Source image"
          htmlFor="social-image-upload"
          hint="JPEG, PNG, or WebP up to 20 MB. The image is processed locally in your browser."
        >
          <Input
            id="social-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        {image ? (
          <p className="text-xs text-subtle-foreground">
            {fileName} · {image.naturalWidth} × {image.naturalHeight} px · {formatBytes(
              image.naturalWidth * image.naturalHeight * 4,
            )}{" "}
            decoded
          </p>
        ) : null}

        <Field label="Platform preset" htmlFor="social-preset">
          <Select
            id="social-preset"
            value={presetId}
            onChange={(event) => applyPreset(event.target.value)}
          >
            {SOCIAL_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label} — {preset.width}×{preset.height}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Width (px)" htmlFor="social-width" hint="16 to 4096 pixels.">
            <Input
              id="social-width"
              type="number"
              min={16}
              max={4096}
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </Field>
          <Field label="Height (px)" htmlFor="social-height" hint="16 to 4096 pixels.">
            <Input
              id="social-height"
              type="number"
              min={16}
              max={4096}
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Resize mode" htmlFor="social-mode">
            <Select
              id="social-mode"
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as ResizeMode);
                releaseResult();
              }}
            >
              <option value="cover">Crop to fill (no padding)</option>
              <option value="contain">Fit with padding</option>
            </Select>
          </Field>
          <Field label="Output format" htmlFor="social-format">
            <Select
              id="social-format"
              value={format}
              onChange={(event) => {
                setFormat(event.target.value as "image/png" | "image/jpeg");
                releaseResult();
              }}
            >
              <option value="image/jpeg">JPEG (smaller)</option>
              <option value="image/png">PNG (lossless)</option>
            </Select>
          </Field>
        </div>

        {mode === "contain" ? (
          <Field label="Padding color" htmlFor="social-background">
            <input
              id="social-background"
              type="color"
              value={background}
              onChange={(event) => {
                setBackground(event.target.value);
                releaseResult();
              }}
              className="h-10 w-full cursor-pointer rounded-control border border-border bg-surface p-1"
            />
          </Field>
        ) : null}

        {format === "image/jpeg" ? (
          <Field
            label={`JPEG quality: ${Math.round(Number(quality) * 100)}%`}
            htmlFor="social-quality"
          >
            <input
              id="social-quality"
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={quality}
              onChange={(event) => setQuality(event.target.value)}
              className="w-full accent-[var(--accent)]"
            />
          </Field>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate} disabled={!image || busy}>
            <Scaling className="size-4" aria-hidden="true" />
            {busy ? "Resizing…" : "Resize image"}
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

        {error ? (
          <ErrorState title="Could not resize the image" description={error} icon={Upload} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
          {result ? (
            <>
              <Image
                src={result.url}
                alt="Resized social image preview"
                width={result.width}
                height={result.height}
                unoptimized
                className="max-h-80 w-auto rounded-control border border-border object-contain"
              />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {result.width} × {result.height} px · {result.filename} · {formatBytes(result.size)}
              </p>
            </>
          ) : sourceUrl ? (
            <p className="text-center text-sm text-muted-foreground">
              Choose a preset and click Resize image to see the {clampDimension(width, 1080)} ×{" "}
              {clampDimension(height, 1080)} result here.
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Upload an image, pick a platform size, then resize and download it here.
            </p>
          )}
        </div>
        <p className="text-xs text-subtle-foreground">
          Crop to fill removes the excess edges to match the exact ratio. Fit with padding keeps the
          whole image and fills the leftover space with your chosen color.
        </p>
      </div>
    </div>
  );
}
