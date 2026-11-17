/** Pure canvas helpers for cropping passport photos and building print sheets. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { canvasToBlob } from "@/lib/utils/image";

/** Pixel sizes below are calibrated for 300 DPI, the standard for photo printing. */
export interface PassportSize {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
}

export const PASSPORT_SIZES: PassportSize[] = [
  { id: "us-2x2", label: "US 2 × 2 in (51 × 51 mm)", widthMm: 51, heightMm: 51, widthPx: 600, heightPx: 600 },
  { id: "schengen-35x45", label: "Schengen / EU 35 × 45 mm", widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: "uk-35x45", label: "UK 35 × 45 mm", widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: "canada-50x70", label: "Canada 50 × 70 mm", widthMm: 50, heightMm: 70, widthPx: 591, heightPx: 827 },
  { id: "china-33x48", label: "China 33 × 48 mm", widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567 },
  { id: "india-35x45", label: "India 35 × 45 mm", widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: "australia-35x45", label: "Australia 35 × 45 mm", widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
];

export interface PhotoRenderOptions {
  background: string;
  zoom: number;
  /** Percentage of each dimension reserved as a border filled with `background`. */
  padding?: number;
}

export interface SheetRenderOptions extends PhotoRenderOptions {
  columns: number;
  rows: number;
  paper: "a4" | "letter";
  guides: boolean;
}

const PAPER_PIXELS: Record<"a4" | "letter", { width: number; height: number }> = {
  a4: { width: 2480, height: 3508 },
  letter: { width: 2550, height: 3300 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function validatePhotoImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Unsupported file type. Choose a JPG, PNG, or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}

/** Returns a centered source rectangle matching the target aspect ratio, with optional zoom. */
export function centerCropRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  zoom = 1,
): { sx: number; sy: number; sw: number; sh: number } {
  const ratio = targetWidth / targetHeight;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (sourceWidth / sourceHeight > ratio) cropWidth = sourceHeight * ratio;
  else cropHeight = sourceWidth / ratio;

  const safeZoom = clamp(zoom, 1, 3);
  cropWidth = Math.max(1, cropWidth / safeZoom);
  cropHeight = Math.max(1, cropHeight / safeZoom);

  return {
    sx: (sourceWidth - cropWidth) / 2,
    sy: (sourceHeight - cropHeight) / 2,
    sw: cropWidth,
    sh: cropHeight,
  };
}

/** Renders one passport photo to a canvas at the preset's pixel size. */
export function renderPassportPhoto(
  image: HTMLImageElement,
  size: PassportSize,
  options: PhotoRenderOptions,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size.widthPx;
  canvas.height = size.heightPx;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.fillStyle = options.background || "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const crop = centerCropRect(
    image.naturalWidth,
    image.naturalHeight,
    size.widthPx,
    size.heightPx,
    options.zoom,
  );
  const paddingPercent = clamp(options.padding ?? 0, 0, 20) / 100;
  const drawWidth = size.widthPx * (1 - paddingPercent);
  const drawHeight = size.heightPx * (1 - paddingPercent);
  const offsetX = (size.widthPx - drawWidth) / 2;
  const offsetY = (size.heightPx - drawHeight) / 2;
  context.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );
  return canvas;
}

/** Lays out a grid of photos on an A4 or US Letter sheet at 300 DPI. */
export function renderPrintSheet(
  image: HTMLImageElement,
  size: PassportSize,
  options: SheetRenderOptions,
): HTMLCanvasElement {
  const paper = PAPER_PIXELS[options.paper];
  const canvas = document.createElement("canvas");
  canvas.width = paper.width;
  canvas.height = paper.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const columns = clamp(Math.trunc(options.columns), 1, 6);
  const rows = clamp(Math.trunc(options.rows), 1, 8);
  const margin = 60;
  const gap = 24;
  const cellWidth = (canvas.width - margin * 2) / columns;
  const cellHeight = (canvas.height - margin * 2) / rows;
  const scale = Math.min(
    1,
    (cellWidth - gap) / size.widthPx,
    (cellHeight - gap) / size.heightPx,
  );
  const photoWidth = Math.max(1, size.widthPx * scale);
  const photoHeight = Math.max(1, size.heightPx * scale);

  const single = renderPassportPhoto(image, size, options);
  if (options.guides) {
    context.strokeStyle = "#CBD5E1";
    context.lineWidth = 2;
    context.setLineDash([8, 8]);
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = margin + column * cellWidth + (cellWidth - photoWidth) / 2;
      const y = margin + row * cellHeight + (cellHeight - photoHeight) / 2;
      context.drawImage(single, x, y, photoWidth, photoHeight);
      if (options.guides) context.strokeRect(x - 2, y - 2, photoWidth + 4, photoHeight + 4);
    }
  }

  return canvas;
}

export function photoCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return canvasToBlob(canvas, "image/png");
}
