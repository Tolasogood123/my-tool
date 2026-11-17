"use client";

import { useMemo, useState } from "react";
import { Palette, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  DEFAULT_GRADIENT,
  RADIAL_POSITIONS,
  buildGradientCss,
  buildGradientDeclaration,
  sortStops,
  validateGradient,
} from "@/lib/utils/css-gradient";
import type { GradientConfig, GradientStop } from "@/lib/utils/css-gradient";

function cloneDefault(): GradientConfig {
  return {
    ...DEFAULT_GRADIENT,
    stops: DEFAULT_GRADIENT.stops.map((stop) => ({ ...stop })),
  };
}

function colorForPicker(color: string): string {
  const clean = color.trim().replace(/^#/, "");
  return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean) ? color : "#000000";
}

export function CssGradientGenerator() {
  const [config, setConfig] = useState<GradientConfig>(cloneDefault);

  const css = useMemo(() => buildGradientCss(config), [config]);
  const declaration = useMemo(() => buildGradientDeclaration(config), [config]);
  const error = validateGradient(config);

  const update = (patch: Partial<GradientConfig>) =>
    setConfig((current) => ({ ...current, ...patch }));

  const updateStop = (index: number, patch: Partial<GradientStop>) =>
    setConfig((current) => ({
      ...current,
      stops: current.stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop)),
    }));

  const addStop = () => {
    const stops = sortStops(config.stops);
    const last = stops[stops.length - 1];
    const first = stops[0];
    const midpoint = last && first ? Math.round((last.position + first.position) / 2) : 50;
    update({ stops: [...stops, { color: "#22d3ee", position: midpoint }] });
  };

  const removeStop = (index: number) =>
    setConfig((current) => ({
      ...current,
      stops: current.stops.filter((_, i) => i !== index),
    }));

  const reset = () => setConfig(cloneDefault());

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gradient type" htmlFor="gradient-type">
            <Select
              id="gradient-type"
              value={config.type}
              onChange={(event) => update({ type: event.target.value as GradientConfig["type"] })}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </Select>
          </Field>

          {config.type === "linear" ? (
            <Field label={`Angle: ${config.angle}°`} htmlFor="gradient-angle">
              <input
                id="gradient-angle"
                type="range"
                min={0}
                max={360}
                step={1}
                value={config.angle}
                onChange={(event) => update({ angle: Number(event.target.value) })}
                className="mt-3 w-full accent-[var(--accent)]"
              />
            </Field>
          ) : (
            <>
              <Field label="Shape" htmlFor="gradient-shape">
                <Select
                  id="gradient-shape"
                  value={config.shape}
                  onChange={(event) => update({ shape: event.target.value as GradientConfig["shape"] })}
                >
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                </Select>
              </Field>
              <Field label="Position" htmlFor="gradient-position">
                <Select
                  id="gradient-position"
                  value={config.radialPosition}
                  onChange={(event) => update({ radialPosition: event.target.value })}
                >
                  {RADIAL_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Colour stops</p>
            <Button size="sm" variant="outline" onClick={addStop}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add stop
            </Button>
          </div>

          <div className="space-y-3">
            {config.stops.map((stop, index) => (
              <div
                key={`${index}-${stop.position}`}
                className="rounded-control border border-border bg-surface p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="color"
                    aria-label={`Stop ${index + 1} colour picker`}
                    value={colorForPicker(stop.color)}
                    onChange={(event) => updateStop(index, { color: event.target.value })}
                    className="size-9 shrink-0 cursor-pointer rounded-control border border-border bg-surface p-1"
                  />
                  <Input
                    aria-label={`Stop ${index + 1} colour`}
                    value={stop.color}
                    onChange={(event) => updateStop(index, { color: event.target.value })}
                    className="min-w-0 flex-1 font-mono text-xs"
                    placeholder="#6366f1"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove stop ${index + 1}`}
                    onClick={() => removeStop(index)}
                    disabled={config.stops.length <= 2}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label
                    htmlFor={`stop-position-${index}`}
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    Position
                  </label>
                  <input
                    id={`stop-position-${index}`}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={stop.position}
                    onChange={(event) => updateStop(index, { position: Number(event.target.value) })}
                    className="min-w-0 flex-1 accent-[var(--accent)]"
                  />
                  <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums">
                    {Math.round(stop.position)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check your gradient" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div
          className="flex min-h-64 items-center justify-center rounded-card border border-border p-6"
          style={error ? undefined : { background: css }}
          aria-label="Live gradient preview"
        >
          <span className="rounded-full bg-surface/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
            Live preview
          </span>
        </div>

        <ToolOutput
          label="CSS declaration"
          value={error ? "" : declaration}
          filename="gradient.css"
          mimeType="text/css;charset=utf-8"
          rows={3}
        />

        <p className="flex items-center gap-2 text-xs text-subtle-foreground">
          <Palette className="size-3.5" aria-hidden="true" />
          Stops are sorted by position automatically. Paste the declaration into any CSS rule.
        </p>
      </div>
    </div>
  );
}
