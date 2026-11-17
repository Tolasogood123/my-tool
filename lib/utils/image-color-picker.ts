/** Pure colour math and canvas sampling helpers for the Image Color Picker. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function validateColorImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Unsupported file type. Choose a JPG, PNG, or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}

const toByte = (value: number) => Math.round(Math.min(255, Math.max(0, value)));

export function rgbToHex(r: number, g: number, b: number): string {
  const hex = [toByte(r), toByte(g), toByte(b)]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`.toUpperCase();
}

export function hexToRgb(hex: string): Rgb | null {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const value = parseInt(full, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHsl(r: number, g: number, b: number): Hsl {
  const red = toByte(r) / 255;
  const green = toByte(g) / 255;
  const blue = toByte(b) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case red:
        hue = ((green - blue) / delta) % 6;
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function formatRgb({ r, g, b }: Rgb): string {
  return `rgb(${toByte(r)}, ${toByte(g)}, ${toByte(b)})`;
}

export function formatHsl({ h, s, l }: Hsl): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Reads the RGB value of one pixel in canvas coordinate space. */
export function samplePixelFromCanvas(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
): Rgb | null {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const pixelX = Math.min(canvas.width - 1, Math.max(0, Math.floor(x)));
  const pixelY = Math.min(canvas.height - 1, Math.max(0, Math.floor(y)));
  const data = context.getImageData(pixelX, pixelY, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2] };
}

/** Finds the most common colour buckets in a canvas and returns distinct HEX swatches. */
export function extractPalette(canvas: HTMLCanvasElement, maxColors = 6): string[] {
  const context = canvas.getContext("2d");
  if (!context || canvas.width === 0 || canvas.height === 0) return [];

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  const totalPixels = canvas.width * canvas.height;
  const step = Math.max(1, Math.floor(totalPixels / 20000));

  for (let index = 0; index < data.length; index += 4 * step) {
    const alpha = data[index + 3];
    if (alpha < 128) continue;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { count: 0, r: 0, g: 0, b: 0 };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
  }

  const ordered = [...buckets.values()].sort((a, b) => b.count - a.count);
  const palette: string[] = [];
  for (const bucket of ordered) {
    if (palette.length >= maxColors) break;
    const hex = rgbToHex(
      bucket.r / bucket.count,
      bucket.g / bucket.count,
      bucket.b / bucket.count,
    );
    if (!palette.includes(hex)) palette.push(hex);
  }
  return palette;
}
