"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Scaling, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  DEFAULT_SHADOW_LAYERS,
  buildBoxShadow,
  buildBoxShadowDeclaration,
  createShadowLayer,
} from "@/lib/utils/box-shadow";
import type { ShadowLayer } from "@/lib/utils/box-shadow";

function cloneDefault(): ShadowLayer[] {
  return DEFAULT_SHADOW_LAYERS.map((layer) => ({ ...layer }));
}

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}

function LayerSlider({ id, label, value, min, max, onChange, suffix = "px" }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-[var(--accent)]"
      />
    </div>
  );
}

export function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>(cloneDefault);

  const css = useMemo(() => buildBoxShadow(layers), [layers]);
  const declaration = useMemo(() => buildBoxShadowDeclaration(layers), [layers]);

  const updateLayer = (index: number, patch: Partial<ShadowLayer>) =>
    setLayers((current) =>
      current.map((layer, i) => (i === index ? { ...layer, ...patch } : layer)),
    );

  const addLayer = () => setLayers((current) => [...current, createShadowLayer()]);

  const removeLayer = (index: number) =>
    setLayers((current) => current.filter((_, i) => i !== index));

  const reset = () => setLayers(cloneDefault());

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Shadow layers ({layers.length})</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={addLayer}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add layer
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        {layers.map((layer, index) => (
          <div key={index} className="rounded-card border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={layer.enabled}
                  onChange={(event) => updateLayer(index, { enabled: event.target.checked })}
                  className="size-4 accent-[var(--accent)]"
                />
                Layer {index + 1}
              </label>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Remove layer ${index + 1}`}
                onClick={() => removeLayer(index)}
                disabled={layers.length <= 1}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div
              className={`mt-4 grid gap-4 sm:grid-cols-2 ${layer.enabled ? "" : "opacity-50"}`}
            >
              <LayerSlider
                id={`shadow-x-${index}`}
                label="Offset X"
                value={layer.offsetX}
                min={-50}
                max={50}
                onChange={(value) => updateLayer(index, { offsetX: value })}
              />
              <LayerSlider
                id={`shadow-y-${index}`}
                label="Offset Y"
                value={layer.offsetY}
                min={-50}
                max={50}
                onChange={(value) => updateLayer(index, { offsetY: value })}
              />
              <LayerSlider
                id={`shadow-blur-${index}`}
                label="Blur"
                value={layer.blur}
                min={0}
                max={100}
                onChange={(value) => updateLayer(index, { blur: value })}
              />
              <LayerSlider
                id={`shadow-spread-${index}`}
                label="Spread"
                value={layer.spread}
                min={-50}
                max={50}
                onChange={(value) => updateLayer(index, { spread: value })}
              />
              <Field label={`Colour & opacity (${layer.opacity}%)`} htmlFor={`shadow-color-${index}`}>
                <div className="flex gap-2">
                  <input
                    id={`shadow-color-${index}`}
                    type="color"
                    aria-label={`Layer ${index + 1} colour`}
                    value={layer.color}
                    onChange={(event) => updateLayer(index, { color: event.target.value })}
                    className="size-10 shrink-0 cursor-pointer rounded-control border border-border bg-surface p-1"
                  />
                  <input
                    type="range"
                    aria-label={`Layer ${index + 1} opacity`}
                    min={0}
                    max={100}
                    step={1}
                    value={layer.opacity}
                    onChange={(event) => updateLayer(index, { opacity: Number(event.target.value) })}
                    className="min-w-0 flex-1 accent-[var(--accent)]"
                  />
                </div>
              </Field>
              <label className="flex items-center gap-2 self-center text-sm">
                <input
                  type="checkbox"
                  checked={layer.inset}
                  onChange={(event) => updateLayer(index, { inset: event.target.checked })}
                  className="size-4 accent-[var(--accent)]"
                />
                Inset shadow
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex min-h-64 items-center justify-center rounded-card border border-border bg-surface-muted p-8">
          <div
            className="flex h-32 w-48 items-center justify-center rounded-card bg-surface text-sm font-semibold text-foreground"
            style={{ boxShadow: css }}
          >
            Preview box
          </div>
        </div>

        <ToolOutput
          label="CSS declaration"
          value={declaration}
          filename="box-shadow.css"
          mimeType="text/css;charset=utf-8"
          rows={3}
        />

        <p className="flex items-center gap-2 text-xs text-subtle-foreground">
          <Scaling className="size-3.5" aria-hidden="true" />
          Uncheck a layer to mute it without deleting it. Layers stack in order, top first.
        </p>
      </div>
    </div>
  );
}
