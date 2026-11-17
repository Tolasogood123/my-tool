"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

function parseHex(value: string): [number, number, number] | null {
  const clean = value.trim().replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16)) as [number, number, number];
}

function luminance(rgb: [number, number, number]): number {
  const channels = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratioFor(foreground: string, background: string): number | null {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return null;
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function ColorContrastChecker() {
  const [foreground, setForeground] = useState("#1f2937");
  const [background, setBackground] = useState("#ffffff");

  const ratio = useMemo(() => ratioFor(foreground, background), [foreground, background]);

  const setColor = (which: "fg" | "bg", value: string) => {
    if (which === "fg") setForeground(value);
    else setBackground(value);
  };

  const swap = () => {
    setForeground(background);
    setBackground(foreground);
  };

  const checks = ratio
    ? [
        { label: "Normal text (AA)", target: 4.5 },
        { label: "Large text (AA)", target: 3 },
        { label: "Normal text (AAA)", target: 7 },
        { label: "Large text (AAA)", target: 4.5 },
        { label: "UI components (AA)", target: 3 },
      ].map((item) => ({ ...item, passes: ratio >= item.target }))
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Foreground color" htmlFor="cc-fg" hint="Text color">
            <div className="flex gap-2">
              <Input id="cc-fg" type="color" value={parseHex(foreground) ? foreground : "#000000"} onChange={(event) => setColor("fg", event.target.value)} className="h-10 w-14 p-1" />
              <Input aria-label="Foreground hex value" value={foreground} onChange={(event) => setColor("fg", event.target.value)} placeholder="#1f2937" className="font-mono text-xs" />
            </div>
          </Field>
          <Field label="Background color" htmlFor="cc-bg" hint="Surface color">
            <div className="flex gap-2">
              <Input id="cc-bg" type="color" value={parseHex(background) ? background : "#ffffff"} onChange={(event) => setColor("bg", event.target.value)} className="h-10 w-14 p-1" />
              <Input aria-label="Background hex value" value={background} onChange={(event) => setColor("bg", event.target.value)} placeholder="#ffffff" className="font-mono text-xs" />
            </div>
          </Field>
        </div>

        <Button variant="outline" onClick={swap}>
          <ArrowLeftRight className="size-4" aria-hidden="true" />
          Swap colors
        </Button>

        {ratio === null ? (
          <p role="alert" className="rounded-card border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
            Enter valid hex colors such as #1f2937 or #fff.
          </p>
        ) : null}

        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface px-4 py-3 text-sm">
              <span>{check.label}</span>
              <span className={check.passes ? "font-semibold text-success" : "font-semibold text-danger"}>
                {check.passes ? "Pass" : "Fail"} · {check.target}:1
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex min-h-48 flex-col items-center justify-center rounded-card border border-border p-8 text-center" style={{ backgroundColor: parseHex(background) ? background : "#ffffff", color: parseHex(foreground) ? foreground : "#000000" }}>
          <p className="text-2xl font-semibold">The quick brown fox</p>
          <p className="mt-2 text-sm">Readable text preview at normal size.</p>
          <p className="mt-4 text-xs">Large text preview · 24px</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">Contrast ratio</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums text-accent">
            {ratio ? `${ratio.toFixed(2)}:1` : "—"}
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-subtle-foreground">
            <Palette className="size-3.5" aria-hidden="true" />
            WCAG 2.1 relative luminance formula
          </p>
        </div>
      </div>
    </div>
  );
}
