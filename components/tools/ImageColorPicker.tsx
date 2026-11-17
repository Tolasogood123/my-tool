"use client";

import { useRef, useState } from "react";
import { Copy, Download, Pipette, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import { formatBytes } from "@/lib/utils/format";
import { loadImageFile } from "@/lib/utils/image";
import {
  extractPalette,
  formatHsl,
  formatRgb,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  samplePixelFromCanvas,
  validateColorImage,
  type Hsl,
  type Rgb,
} from "@/lib/utils/image-color-picker";

interface Swatch {
  hex: string;
  rgb: Rgb;
  hsl: Hsl;
}

const MAX_DISPLAY_PIXELS = 1200;
const MAX_SAMPLES = 12;

function makeSwatch(rgb: Rgb): Swatch {
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
  };
}

export function ImageColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Swatch | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [samples, setSamples] = useState<Swatch[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null;
    setError(null);
    setSelected(null);
    setCursor(null);
    setSamples([]);
    setPalette([]);
    setLoaded(false);
    setFileName("");
    setFileSize(0);

    if (!chosen) return;
    const validationError = validateColorImage(chosen);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      const loadedImage = await loadImageFile(chosen);
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas is not available in this browser.");

      const scale = Math.min(
        1,
        MAX_DISPLAY_PIXELS / Math.max(loadedImage.width, loadedImage.height),
      );
      canvas.width = Math.max(1, Math.round(loadedImage.width * scale));
      canvas.height = Math.max(1, Math.round(loadedImage.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available in this browser.");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(loadedImage.image, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(loadedImage.url);
      setFileName(chosen.name);
      setFileSize(chosen.size);
      setLoaded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open that image.");
    } finally {
      setBusy(false);
    }
  };

  const sampleAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const rgb = samplePixelFromCanvas(canvas, x, y);
    if (!rgb) return;
    setSelected(makeSwatch(rgb));
    setCursor({ x: Math.floor(x), y: Math.floor(y) });
  };

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    sampleAt(x, y);
  };

  const onCanvasKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const deltas: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const step = event.shiftKey ? 10 : 1;
    const baseX = cursor?.x ?? Math.floor(canvas.width / 2);
    const baseY = cursor?.y ?? Math.floor(canvas.height / 2);
    sampleAt(baseX + delta[0] * step, baseY + delta[1] * step);
  };

  const addSample = () => {
    if (!selected) return;
    setSamples((current) =>
      current.some((item) => item.hex === selected.hex)
        ? current
        : [selected, ...current].slice(0, MAX_SAMPLES),
    );
    toast({ title: "Color saved", description: `${selected.hex} added to your palette.`, variant: "success" });
  };

  const autoPalette = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const colors = extractPalette(canvas, 6);
    if (colors.length === 0) {
      setError("No colors could be sampled from that image.");
      return;
    }
    setPalette(colors);
    toast({ title: "Palette extracted", description: `${colors.length} dominant colors found.`, variant: "success" });
  };

  const chooseColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) setSelected(makeSwatch(rgb));
  };

  const copy = async (label: string, value: string) => {
    try {
      await copyTextToClipboard(value);
      toast({ title: `${label} copied`, description: value, variant: "success" });
    } catch {
      toast({ title: "Copy failed", description: "Your browser blocked clipboard access.", variant: "error" });
    }
  };

  const downloadPalette = () => {
    const source = samples.length ? samples.map((item) => item.hex) : palette;
    if (source.length === 0) {
      toast({ title: "Nothing to download", description: "Sample a color or extract a palette first.", variant: "error" });
      return;
    }
    downloadText(
      source.map((hex, index) => `${index + 1}. ${hex}`).join("\n"),
      "toladev-color-palette.txt",
    );
  };

  const reset = () => {
    setFileName("");
    setFileSize(0);
    setLoaded(false);
    setSelected(null);
    setCursor(null);
    setSamples([]);
    setPalette([]);
    setError(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const allSwatches = samples.length
    ? samples.map((item) => item.hex)
    : palette;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Image file"
          htmlFor="color-image"
          hint={`JPG, PNG or WebP up to ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}. Click the image to sample a pixel.`}
        >
          <Input
            id="color-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        <div className="overflow-hidden rounded-card border border-border bg-surface-muted p-3">
          <canvas
            ref={canvasRef}
            width={1}
            height={1}
            onClick={onCanvasClick}
            onKeyDown={onCanvasKeyDown}
            tabIndex={loaded ? 0 : -1}
            role="img"
            aria-label="Uploaded image. Click a pixel or use arrow keys to sample its color."
            className={`mx-auto block h-auto max-h-96 w-full rounded-control object-contain ${
              loaded ? "cursor-crosshair focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" : ""
            }`}
          />
          {!loaded ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Your image will appear here. Nothing is uploaded.
            </p>
          ) : null}
        </div>

        {loaded ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={autoPalette}>
              <Sparkles className="size-4" aria-hidden="true" />
              Extract palette
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        ) : null}

        {fileName ? (
          <p className="text-xs text-subtle-foreground">
            {fileName} · {formatBytes(fileSize)}
            {cursor ? ` · Pixel ${cursor.x}, ${cursor.y}` : ""}
          </p>
        ) : null}

        {error ? (
          <ErrorState title="Could not read that image" description={error} icon={Upload} />
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <Pipette className="size-4 text-subtle-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold">Selected color</h2>
          </div>
          {selected ? (
            <>
              <div
                className="mt-4 flex h-24 items-end justify-end rounded-control border border-border p-3"
                style={{ backgroundColor: selected.hex }}
              >
                <span className="rounded bg-surface/80 px-2 py-1 text-sm font-semibold text-foreground">
                  {selected.hex}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <ValueRow label="HEX" value={selected.hex} onCopy={() => copy("HEX", selected.hex)} />
                <ValueRow label="RGB" value={formatRgb(selected.rgb)} onCopy={() => copy("RGB", formatRgb(selected.rgb))} />
                <ValueRow label="HSL" value={formatHsl(selected.hsl)} onCopy={() => copy("HSL", formatHsl(selected.hsl))} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={addSample} disabled={!loaded}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Add to palette
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copy("CSS", `${selected.hex} · ${formatRgb(selected.rgb)} · ${formatHsl(selected.hsl)}`)}>
                  <Copy className="size-4" aria-hidden="true" />
                  Copy all
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Upload an image, then click any pixel to see its HEX, RGB and HSL values.
            </p>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Palette</h2>
            <Button variant="ghost" size="sm" onClick={downloadPalette} disabled={allSwatches.length === 0}>
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          </div>
          {allSwatches.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {allSwatches.map((hex, index) => (
                <button
                  key={`${hex}-${index}`}
                  type="button"
                  onClick={() => chooseColor(hex)}
                  title={`Select ${hex}`}
                  className="flex size-14 items-center justify-center rounded-control border border-border text-[10px] font-semibold text-foreground shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  style={{ backgroundColor: hex }}
                >
                  <span className="rounded bg-surface/80 px-1">{hex}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Sampled colors and the auto-extracted palette will show up here.
            </p>
          )}
        </div>

        {busy ? <p className="text-xs text-subtle-foreground">Loading image…</p> : null}
      </div>
    </div>
  );
}

function ValueRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2">
        <code className="rounded bg-surface-muted px-2 py-1 text-xs">{value}</code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label} value`}
          className="inline-flex size-7 items-center justify-center rounded-control text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Copy className="size-3.5" aria-hidden="true" />
        </button>
      </dd>
    </div>
  );
}
