/** Pure canvas helpers for image conversion, cropping and metadata stripping. */

import {
  canvasToBlob,
  extensionForType,
  loadImageFile,
} from "@/lib/utils/image";

export interface ImageOutput {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  filename: string;
}

function outputName(name: string, suffix: string, type: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
  return `${base || "image"}-${suffix}.${extensionForType(type)}`;
}

/** Re-encodes an image into another browser-supported format. */
export async function convertImage(
  file: File,
  type: string,
  quality: number,
): Promise<ImageOutput> {
  const loaded = await loadImageFile(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = loaded.width;
    canvas.height = loaded.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");
    context.drawImage(loaded.image, 0, 0);
    const blob = await canvasToBlob(canvas, type, quality);
    return {
      blob,
      url: URL.createObjectURL(blob),
      width: loaded.width,
      height: loaded.height,
      filename: outputName(file.name, "converted", type),
    };
  } finally {
    URL.revokeObjectURL(loaded.url);
  }
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Validates a crop rectangle against the source image dimensions. */
export function validateCrop(crop: CropRect, width: number, height: number): string | null {
  const values = [crop.x, crop.y, crop.width, crop.height];
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    return "Crop values must be zero or greater.";
  }
  if (crop.width < 1 || crop.height < 1) {
    return "Crop width and height must be at least 1 pixel.";
  }
  if (crop.x + crop.width > width || crop.y + crop.height > height) {
    return `The crop must fit inside the image (${width} × ${height} px).`;
  }
  return null;
}

/** Crops an image to the given pixel rectangle. */
export async function cropImage(
  file: File,
  crop: CropRect,
  type: string,
  quality: number,
): Promise<ImageOutput> {
  const loaded = await loadImageFile(file);
  try {
    const validationError = validateCrop(crop, loaded.width, loaded.height);
    if (validationError) throw new Error(validationError);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.width);
    canvas.height = Math.round(crop.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");
    context.drawImage(
      loaded.image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const blob = await canvasToBlob(canvas, type, quality);
    return {
      blob,
      url: URL.createObjectURL(blob),
      width: canvas.width,
      height: canvas.height,
      filename: outputName(file.name, "cropped", type),
    };
  } finally {
    URL.revokeObjectURL(loaded.url);
  }
}

/**
 * Re-encodes an image through canvas. This removes most embedded metadata
 * (including common EXIF blocks) because canvas only keeps pixel data.
 */
export async function stripImageMetadata(
  file: File,
  type: string,
  quality: number,
): Promise<ImageOutput> {
  return convertImage(file, type, quality);
}
