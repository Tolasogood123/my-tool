/** Helpers for cropping or fitting an image into common social platform sizes. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { canvasToBlob, extensionForType } from "@/lib/utils/image";

export interface ResizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const SOCIAL_PRESETS: ResizePreset[] = [
  { id: "ig-post", label: "Instagram post · 1:1", width: 1080, height: 1080 },
  { id: "ig-reel-cover", label: "Instagram reel cover · 4:5", width: 1080, height: 1350 },
  { id: "story", label: "Instagram / Facebook story · 9:16", width: 1080, height: 1920 },
  { id: "fb-post", label: "Facebook post · 1.91:1", width: 1200, height: 630 },
  { id: "x-post", label: "X / Twitter post · 16:9", width: 1600, height: 900 },
  { id: "linkedin", label: "LinkedIn post · 1.91:1", width: 1200, height: 627 },
  { id: "pinterest", label: "Pinterest pin · 2:3", width: 1000, height: 1500 },
  { id: "youtube-thumb", label: "YouTube thumbnail · 16:9", width: 1280, height: 720 },
];

export type ResizeMode = "cover" | "contain";

export function validateSocialImage(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported file type. Choose a JPEG, PNG, or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}

export interface SourceRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/** Centered source crop that matches the target aspect ratio. */
export function coverSourceRect(
  srcW: number,
  srcH: number,
  targetW: number,
  targetH: number,
): SourceRect {
  if (srcW <= 0 || srcH <= 0 || targetW <= 0 || targetH <= 0) {
    return { sx: 0, sy: 0, sw: srcW, sh: srcH };
  }
  const targetRatio = targetW / targetH;
  if (srcW / srcH > targetRatio) {
    const sw = srcH * targetRatio;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  }
  const sh = srcW / targetRatio;
  return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
}

export interface DrawPlan extends SourceRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/** Full canvas draw geometry for either crop-to-fill or fit-with-padding. */
export function computeDrawPlan(
  srcW: number,
  srcH: number,
  targetW: number,
  targetH: number,
  mode: ResizeMode,
): DrawPlan {
  if (mode === "cover") {
    const crop = coverSourceRect(srcW, srcH, targetW, targetH);
    return { ...crop, dx: 0, dy: 0, dw: targetW, dh: targetH };
  }
  const scale = Math.min(targetW / srcW, targetH / srcH);
  const dw = srcW * scale;
  const dh = srcH * scale;
  return {
    sx: 0,
    sy: 0,
    sw: srcW,
    sh: srcH,
    dx: (targetW - dw) / 2,
    dy: (targetH - dh) / 2,
    dw,
    dh,
  };
}

export function normalizeHexColor(value: string, fallback = "#ffffff"): string {
  const color = value.trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ? color : fallback;
}

/** Clamps custom dimensions into a safe canvas range. */
export function clampDimension(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(16, Math.min(4096, Math.round(value)));
}

export async function renderResized(
  image: HTMLImageElement,
  targetW: number,
  targetH: number,
  mode: ResizeMode,
  background: string,
  type: "image/png" | "image/jpeg",
  quality: number,
  baseName: string,
): Promise<{ blob: Blob; url: string; filename: string }> {
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.fillStyle = normalizeHexColor(background);
  context.fillRect(0, 0, targetW, targetH);

  const plan = computeDrawPlan(
    image.naturalWidth,
    image.naturalHeight,
    targetW,
    targetH,
    mode,
  );
  context.drawImage(
    image,
    plan.sx,
    plan.sy,
    plan.sw,
    plan.sh,
    plan.dx,
    plan.dy,
    plan.dw,
    plan.dh,
  );

  const blob = await canvasToBlob(canvas, type, quality);
  const safeBase = baseName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: `${safeBase}-${targetW}x${targetH}.${extensionForType(type)}`,
  };
}
