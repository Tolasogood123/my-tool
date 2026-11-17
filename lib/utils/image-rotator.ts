/** Pure helpers for rotating an image with the Canvas API. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { canvasToBlob, loadImageFile } from "@/lib/utils/image";

export type RotateDegrees = 90 | 180 | 270;

export interface RotatedImage {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  degrees: RotateDegrees;
}

export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported file type. Choose a JPEG, PNG or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}

/** Rotate an image clockwise and return a PNG blob plus a preview object URL. */
export async function rotateImage(file: File, degrees: RotateDegrees): Promise<RotatedImage> {
  const loaded = await loadImageFile(file);
  try {
    const swaps = degrees === 90 || degrees === 270;
    const canvas = document.createElement("canvas");
    canvas.width = swaps ? loaded.height : loaded.width;
    canvas.height = swaps ? loaded.width : loaded.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(loaded.image, -loaded.width / 2, -loaded.height / 2);

    const blob = await canvasToBlob(canvas, "image/png");
    const safeBase = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";

    return {
      blob,
      url: URL.createObjectURL(blob),
      filename: `${safeBase}-rotated-${degrees}.png`,
      width: canvas.width,
      height: canvas.height,
      degrees,
    };
  } finally {
    URL.revokeObjectURL(loaded.url);
  }
}
