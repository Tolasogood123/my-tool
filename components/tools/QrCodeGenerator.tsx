"use client";

import { useMemo, useState } from "react";
import { Download, QrCode, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { downloadDataUrl } from "@/lib/utils/download";

type ErrorLevel = "L" | "M" | "Q" | "H";

/** Converts the rendered QR <svg> into a PNG data URL in the browser. */
async function svgToPng(svg: SVGSVGElement, size: number): Promise<string> {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", String(size));
  copy.setAttribute("height", String(size));
  const serialized = new XMLSerializer().serializeToString(copy);
  const url = URL.createObjectURL(new Blob([serialized], { type: "image/svg+xml;charset=utf-8" }));

  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not render the QR code as an image."));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");
    context.drawImage(image, 0, 0, size, size);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function QrCodeGenerator() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState("512");
  const [level, setLevel] = useState<ErrorLevel>("M");
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#ffffff");
  const [applied, setApplied] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const previewSize = 220;
  const qrValue = applied;
  const contrastWarning = useMemo(() => {
    const luminance = (hex: string) => {
      const clean = hex.replace("#", "");
      if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
      const channels = [0, 2, 4].map((index) => {
        const channel = Number.parseInt(clean.slice(index, index + 2), 16) / 255;
        return channel <= 0.03928
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const a = luminance(foreground);
    const b = luminance(background);
    if (a === null || b === null) return "Enter 6-digit hex colors for a contrast check.";
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    return ratio < 3
      ? "Contrast is low. Use a dark foreground on a light background for reliable scanning."
      : null;
  }, [foreground, background]);

  const generate = () => {
    setError(null);
    if (!value.trim()) {
      setError("Enter a URL or text to encode first.");
      setApplied("");
      return;
    }
    if (value.length > 1200) {
      setError("That content is too long for a reliable QR code (1200 characters maximum).");
      setApplied("");
      return;
    }
    setApplied(value.trim());
  };

  const download = async () => {
    const svg = document.querySelector<SVGSVGElement>("#qr-preview svg");
    if (!svg) return;
    setBusy(true);
    try {
      const pngSize = Math.min(2048, Math.max(128, Number(size) || 512));
      const dataUrl = await svgToPng(svg, pngSize);
      downloadDataUrl(dataUrl, "toladev-qr-code.png");
      toast({ title: "QR code downloaded", variant: "success" });
    } catch (cause) {
      toast({
        title: "Download failed",
        description: cause instanceof Error ? cause.message : "Try again.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setValue("");
    setApplied("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Content" htmlFor="qr-value" hint="A link, plain text, Wi-Fi note, or short message.">
          <Input
            id="qr-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://example.com"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="PNG size (px)" htmlFor="qr-size">
            <Input
              id="qr-size"
              type="number"
              min={128}
              max={2048}
              step={64}
              value={size}
              onChange={(event) => setSize(event.target.value)}
            />
          </Field>
          <Field label="Error correction" htmlFor="qr-level">
            <Select
              id="qr-level"
              value={level}
              onChange={(event) => setLevel(event.target.value as ErrorLevel)}
            >
              <option value="L">Low (dense)</option>
              <option value="M">Medium</option>
              <option value="Q">High</option>
              <option value="H">Highest (sparse)</option>
            </Select>
          </Field>
          <Field label="Foreground" htmlFor="qr-fg">
            <Input
              id="qr-fg"
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              className="h-10 p-1"
            />
          </Field>
          <Field label="Background" htmlFor="qr-bg">
            <Input
              id="qr-bg"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-10 p-1"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <QrCode className="size-4" aria-hidden="true" />
            Generate
          </Button>
          <Button variant="outline" onClick={download} disabled={!qrValue || busy}>
            <Download className="size-4" aria-hidden="true" />
            {busy ? "Preparing…" : "Download PNG"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not create QR code" description={error} /> : null}
        {contrastWarning ? (
          <p role="status" className="text-xs font-medium text-warning">
            {contrastWarning}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-center justify-center rounded-card border border-border bg-surface p-8">
        <div
          id="qr-preview"
          className="flex size-60 items-center justify-center rounded-card border border-border bg-white p-3"
        >
          {qrValue ? (
            <QRCodeSVG
              value={qrValue}
              size={previewSize}
              level={level}
              fgColor={foreground}
              bgColor={background}
              marginSize={1}
              title="QR code preview"
            />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Your scannable QR code will appear here.
            </p>
          )}
        </div>
        <p className="mt-4 max-w-xs text-center text-xs text-muted-foreground">
          Generated locally in your browser. No QR service, no redirect, and no expiry.
        </p>
      </div>
    </div>
  );
}
