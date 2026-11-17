/**
 * Client-side favicon generation: render an image or emoji to several square
 * PNG sizes and pack the small sizes into an ICO container. No dependencies.
 */

import { canvasToBlob, loadImageFile } from "@/lib/utils/image";

export type FaviconSource =
  | { kind: "emoji"; emoji: string; background: string }
  | { kind: "image"; file: File };

export const FAVICON_PNG_SIZES = [16, 32, 48, 64, 180] as const;
export const FAVICON_ICO_SIZES = [16, 32, 48] as const;

export interface PngIcon {
  size: number;
  blob: Blob;
  url: string;
  filename: string;
}

export interface FaviconResult {
  pngs: PngIcon[];
  ico: { blob: Blob; url: string; filename: string } | null;
}

export function validateEmoji(value: string): string | null {
  if (!value.trim()) return "Enter an emoji to render.";
  if (value.trim().length > 8) return "Use one or two emoji characters (8 characters maximum).";
  return null;
}

async function renderPng(source: FaviconSource, size: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  if (source.kind === "emoji") {
    context.fillStyle = source.background || "#ffffff";
    context.fillRect(0, 0, size, size);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${Math.floor(size * 0.76)}px "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji",sans-serif`;
    context.fillText(source.emoji, size / 2, size / 2 + size * 0.04);
  } else {
    const loaded = await loadImageFile(source.file);
    try {
      const crop = Math.min(loaded.width, loaded.height);
      const sx = (loaded.width - crop) / 2;
      const sy = (loaded.height - crop) / 2;
      context.drawImage(loaded.image, sx, sy, crop, crop, 0, 0, size, size);
    } finally {
      URL.revokeObjectURL(loaded.url);
    }
  }

  return canvasToBlob(canvas, "image/png");
}

/** Build a standard ICO container from PNG-encoded entries (PNG-in-ICO). */
function buildIco(entries: { size: number; data: ArrayBuffer }[]): Blob {
  const header = new Uint8Array(6);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(0, 0, true); // reserved
  headerView.setUint16(2, 1, true); // type: icon
  headerView.setUint16(4, entries.length, true);

  const directory = new Uint8Array(16 * entries.length);
  const dirView = new DataView(directory.buffer);
  let offset = 6 + directory.length;

  entries.forEach((entry, index) => {
    const o = index * 16;
    const dim = entry.size >= 256 ? 0 : entry.size;
    directory[o] = dim;
    directory[o + 1] = dim;
    directory[o + 2] = 0; // palette
    directory[o + 3] = 0; // reserved
    dirView.setUint16(o + 4, 1, true); // color planes
    dirView.setUint16(o + 6, 32, true); // bits per pixel
    dirView.setUint32(o + 8, entry.data.byteLength, true);
    dirView.setUint32(o + 12, offset, true);
    offset += entry.data.byteLength;
  });

  return new Blob(
    [new Blob([header]), new Blob([directory]), ...entries.map((entry) => new Blob([entry.data]))],
    { type: "image/x-icon" },
  );
}

/** Render every requested size and assemble the ICO. Caller revokes the object URLs. */
export async function generateFavicon(
  source: FaviconSource,
  pngSizes: readonly number[] = FAVICON_PNG_SIZES,
  icoSizes: readonly number[] = FAVICON_ICO_SIZES,
): Promise<FaviconResult> {
  if (source.kind === "emoji") {
    const error = validateEmoji(source.emoji);
    if (error) throw new Error(error);
  }

  const blobs = new Map<number, Blob>();
  for (const size of [...new Set([...pngSizes, ...icoSizes])]) {
    blobs.set(size, await renderPng(source, size));
  }

  const pngs: PngIcon[] = pngSizes.map((size) => {
    const blob = blobs.get(size)!;
    return {
      size,
      blob,
      url: URL.createObjectURL(blob),
      filename: `favicon-${size}x${size}.png`,
    };
  });

  const icoEntries: { size: number; data: ArrayBuffer }[] = [];
  for (const size of icoSizes) {
    const blob = blobs.get(size);
    if (blob) icoEntries.push({ size, data: await blob.arrayBuffer() });
  }
  const icoBlob = icoEntries.length ? buildIco(icoEntries) : null;

  return {
    pngs,
    ico: icoBlob
      ? { blob: icoBlob, url: URL.createObjectURL(icoBlob), filename: "favicon.ico" }
      : null,
  };
}
