/** Pure helpers for composing CSS linear and radial gradients from colour stops. */

export type GradientType = "linear" | "radial";
export type RadialShape = "circle" | "ellipse";

export interface GradientStop {
  color: string;
  position: number; // 0–100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // degrees, linear only
  shape: RadialShape; // radial only
  radialPosition: string; // radial only, e.g. "center" or "top left"
  stops: GradientStop[];
}

export const RADIAL_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
] as const;

export const DEFAULT_GRADIENT: GradientConfig = {
  type: "linear",
  angle: 135,
  shape: "circle",
  radialPosition: "center",
  stops: [
    { color: "#6366f1", position: 0 },
    { color: "#ec4899", position: 100 },
  ],
};

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** True when the value looks like a usable CSS colour (hex, rgb, hsl, or a named colour). */
export function isValidColor(value: string): boolean {
  const clean = value.trim();
  if (!clean) return false;
  if (HEX.test(clean)) return true;
  if (/^(rgb|rgba|hsl|hsla)\(/i.test(clean)) return true;
  return /^[a-zA-Z]+$/.test(clean);
}

/** Sorts stops by position so the generated CSS is stable and monotonic. */
export function sortStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

function stopToCss(stop: GradientStop): string {
  const position = Math.max(0, Math.min(100, Math.round(stop.position)));
  return `${stop.color.trim()} ${position}%`;
}

/** Builds the gradient function string, e.g. "linear-gradient(135deg, #f00 0%, #00f 100%)". */
export function buildGradientCss(config: GradientConfig): string {
  const stops = sortStops(config.stops).map(stopToCss);
  if (stops.length === 0) return "none";

  if (config.type === "radial") {
    return `radial-gradient(${config.shape} at ${config.radialPosition}, ${stops.join(", ")})`;
  }
  const angle = ((config.angle % 360) + 360) % 360;
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
}

/** Builds a copy-ready CSS declaration. */
export function buildGradientDeclaration(config: GradientConfig): string {
  return `background: ${buildGradientCss(config)};`;
}

/** Returns an error message for an invalid configuration, or null when it is valid. */
export function validateGradient(config: GradientConfig): string | null {
  if (config.stops.length < 2) return "Add at least two colour stops.";
  for (const stop of config.stops) {
    if (!isValidColor(stop.color)) return `"${stop.color}" is not a valid colour.`;
    if (!Number.isFinite(stop.position) || stop.position < 0 || stop.position > 100) {
      return "Every stop position must be between 0% and 100%.";
    }
  }
  return null;
}
