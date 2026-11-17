/** Pure helpers for composing multi-layer CSS box-shadow declarations. */

export interface ShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string; // hex
  opacity: number; // 0–100
  inset: boolean;
  enabled: boolean;
}

export function createShadowLayer(overrides: Partial<ShadowLayer> = {}): ShadowLayer {
  return {
    offsetX: 0,
    offsetY: 8,
    blur: 16,
    spread: 0,
    color: "#0f172a",
    opacity: 25,
    inset: false,
    enabled: true,
    ...overrides,
  };
}

export const DEFAULT_SHADOW_LAYERS: ShadowLayer[] = [
  createShadowLayer({ offsetY: 8, blur: 20, opacity: 18 }),
  createShadowLayer({ offsetY: 2, blur: 4, opacity: 12 }),
];

/** Converts a 3- or 6-digit hex colour plus a 0–100 opacity into an rgba() string. */
export function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.trim().replace(/^#/, "");
  const full = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  let r = 0;
  let g = 0;
  let b = 0;
  if (/^[0-9a-fA-F]{6}$/.test(full)) {
    r = Number.parseInt(full.slice(0, 2), 16);
    g = Number.parseInt(full.slice(2, 4), 16);
    b = Number.parseInt(full.slice(4, 6), 16);
  }
  const alpha = Math.max(0, Math.min(1, opacity / 100));
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(2))})`;
}

function layerToCss(layer: ShadowLayer): string {
  const parts = [
    `${layer.offsetX}px`,
    `${layer.offsetY}px`,
    `${layer.blur}px`,
    `${layer.spread}px`,
    hexToRgba(layer.color, layer.opacity),
  ];
  return `${layer.inset ? "inset " : ""}${parts.join(" ")}`;
}

/** Builds the value of a box-shadow property from all enabled layers. */
export function buildBoxShadow(layers: ShadowLayer[]): string {
  const active = layers.filter((layer) => layer.enabled).map(layerToCss);
  return active.length > 0 ? active.join(", ") : "none";
}

/** Builds a copy-ready CSS declaration. */
export function buildBoxShadowDeclaration(layers: ShadowLayer[]): string {
  return `box-shadow: ${buildBoxShadow(layers)};`;
}
