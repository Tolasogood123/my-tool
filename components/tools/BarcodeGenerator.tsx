"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { BarChart3, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { downloadDataUrl, downloadText } from "@/lib/utils/download";
import {
  barcodeToSvg,
  computeEan13CheckDigit,
  encodeCode128,
  encodeEan13,
  normalizeEan13,
  patternToRuns,
} from "@/lib/utils/barcode";
import type { BarcodeResult } from "@/lib/utils/barcode";

type Symbology = "CODE128" | "EAN13";

interface DrawOptions {
  moduleWidth: number;
  height: number;
  foreground: string;
  background: string;
  showText: boolean;
}

const QUIET_ZONE_MODULES = 10;

function drawBarcode(canvas: HTMLCanvasElement, result: BarcodeResult, options: DrawOptions) {
  const moduleWidth = Math.max(1, Math.floor(options.moduleWidth));
  const barHeight = Math.max(10, Math.floor(options.height));
  const textArea = options.showText ? 26 : 0;
  const width = (result.modules + QUIET_ZONE_MODULES * 2) * moduleWidth;
  const height = barHeight + textArea;

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.fillStyle = options.background;
  context.fillRect(0, 0, width, height);

  let offset = 0;
  context.fillStyle = options.foreground;
  for (const run of patternToRuns(result.pattern)) {
    if (run.bar) {
      context.fillRect((QUIET_ZONE_MODULES + offset) * moduleWidth, 0, run.count * moduleWidth, barHeight);
    }
    offset += run.count;
  }

  if (options.showText) {
    context.fillStyle = options.foreground;
    context.font = "14px monospace";
    context.textAlign = "center";
    context.fillText(result.displayText, width / 2, barHeight + 18);
  }
}

export function BarcodeGenerator() {
  const [symbology, setSymbology] = useState<Symbology>("CODE128");
  const [value, setValue] = useState("");
  const [moduleWidth, setModuleWidth] = useState("2");
  const [height, setHeight] = useState("120");
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#ffffff");
  const [showText, setShowText] = useState(true);
  const [result, setResult] = useState<(BarcodeResult & { codeSet?: "B" | "C" }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!result) {
      const context = canvas.getContext("2d");
      if (context) context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    try {
      drawBarcode(canvas, result, {
        moduleWidth: Number(moduleWidth) || 2,
        height: Number(height) || 120,
        foreground,
        background,
        showText,
      });
    } catch (cause) {
      queueMicrotask(() =>
        setError(cause instanceof Error ? cause.message : "Could not draw the barcode."),
      );
    }
  }, [result, moduleWidth, height, foreground, background, showText]);

  const generate = () => {
    setError(null);
    setResult(null);
    try {
      let encoded: BarcodeResult;
      if (symbology === "EAN13") {
        const clean = normalizeEan13(value);
        if (/^\d{12}$/.test(clean)) {
          const check = computeEan13CheckDigit(clean);
          const completed = `${clean}${check}`;
          setValue(completed);
          toast({
            title: "Check digit added",
            description: `Appended ${check} to make a valid EAN-13.`,
            variant: "info",
          });
          encoded = encodeEan13(completed);
        } else {
          encoded = encodeEan13(clean);
        }
      } else {
        encoded = encodeCode128(value);
      }
      setResult(encoded);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not encode that value.");
    }
  };

  const filenameBase = () => {
    const safe = (result?.displayText ?? "barcode").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 40);
    return `toladev-${(result?.symbology ?? "barcode").toLowerCase()}-${safe}`;
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    setBusy(true);
    try {
      downloadDataUrl(canvas.toDataURL("image/png"), `${filenameBase()}.png`);
      toast({ title: "PNG downloaded", variant: "success" });
    } finally {
      setBusy(false);
    }
  };

  const downloadSvg = () => {
    if (!result) return;
    const svg = barcodeToSvg(result, {
      moduleWidth: Number(moduleWidth) || 2,
      height: Number(height) || 120,
      foreground,
      background,
      showText,
    });
    downloadText(svg, `${filenameBase()}.svg`, "image/svg+xml;charset=utf-8");
    toast({ title: "SVG downloaded", variant: "success" });
  };

  const reset = () => {
    setSymbology("CODE128");
    setValue("");
    setModuleWidth("2");
    setHeight("120");
    setForeground("#0f172a");
    setBackground("#ffffff");
    setShowText(true);
    setResult(null);
    setError(null);
  };

  const onSymbologyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSymbology(event.target.value as Symbology);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Symbology" htmlFor="barcode-type">
          <Select id="barcode-type" value={symbology} onChange={onSymbologyChange}>
            <option value="CODE128">Code 128 — text or numbers</option>
            <option value="EAN13">EAN-13 — 13-digit retail code</option>
          </Select>
        </Field>

        <Field
          label={symbology === "EAN13" ? "EAN-13 number" : "Value to encode"}
          htmlFor="barcode-value"
          hint={
            symbology === "EAN13"
              ? "13 digits. A valid check digit is required; enter 12 digits and we will add it."
              : "Printable text and numbers. Even-length numeric values use the compact Code C set."
          }
        >
          <Input
            id="barcode-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={symbology === "EAN13" ? "5901234123457" : "SKU-12345"}
            spellCheck={false}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Module width (px)" htmlFor="barcode-module">
            <Input
              id="barcode-module"
              type="number"
              min={1}
              max={10}
              value={moduleWidth}
              onChange={(event) => setModuleWidth(event.target.value)}
            />
          </Field>
          <Field label="Bar height (px)" htmlFor="barcode-height">
            <Input
              id="barcode-height"
              type="number"
              min={20}
              max={600}
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
          </Field>
          <Field label="Bar colour" htmlFor="barcode-fg">
            <Input
              id="barcode-fg"
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              className="h-10 p-1"
            />
          </Field>
          <Field label="Background" htmlFor="barcode-bg">
            <Input
              id="barcode-bg"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-10 p-1"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showText}
            onChange={(event) => setShowText(event.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Show human-readable text below the bars
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <BarChart3 className="size-4" aria-hidden="true" />
            Generate barcode
          </Button>
          <Button variant="outline" onClick={downloadPng} disabled={!result || busy}>
            <Download className="size-4" aria-hidden="true" />
            Download PNG
          </Button>
          <Button variant="outline" onClick={downloadSvg} disabled={!result}>
            <Download className="size-4" aria-hidden="true" />
            Download SVG
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not create barcode" description={error} /> : null}

        {result ? (
          <p className="text-xs text-subtle-foreground">
            {result.symbology} · {result.modules} modules
            {result.symbology === "CODE128" && result.codeSet ? ` · Code Set ${result.codeSet}` : " · check digit verified"}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-border bg-surface p-6">
        <div className="flex w-full max-w-full items-center justify-center overflow-hidden rounded-card bg-surface-muted p-4">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={result ? `${result.symbology} barcode for ${result.displayText}` : "Barcode preview"}
            className="block h-auto max-w-full"
          />
        </div>
        <p className="mt-4 max-w-xs text-center text-xs text-muted-foreground">
          Encoded and drawn locally in your browser. Use a sufficiently dark bar colour on a light
          background for reliable scanning.
        </p>
      </div>
    </div>
  );
}
