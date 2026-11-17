/** Pure JPG/PNG-to-PDF logic using pdf-lib (runs in the browser). */

import { PDFDocument } from "pdf-lib";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

export const MAX_IMAGES_PER_PDF = 10;
const MAX_PAGE_POINTS = 2000;

export function validatePdfImages(files: File[]): string | null {
  if (files.length === 0) return "Choose at least one JPG or PNG image.";
  if (files.length > MAX_IMAGES_PER_PDF) {
    return `Choose at most ${MAX_IMAGES_PER_PDF} images per PDF.`;
  }
  for (const file of files) {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return `"${file.name}" is not a JPG or PNG image.`;
    }
    if (file.size === 0) return `"${file.name}" is empty.`;
    if (file.size > MAX_PDF_UPLOAD_BYTES) {
      return `"${file.name}" is ${formatBytes(file.size)}; the limit is ${formatBytes(MAX_PDF_UPLOAD_BYTES)}.`;
    }
  }
  return null;
}

/** Embeds each image as one PDF page sized to the image. */
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const validationError = validatePdfImages(files);
  if (validationError) throw new Error(validationError);

  const document = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image =
      file.type === "image/png"
        ? await document.embedPng(bytes)
        : await document.embedJpg(bytes);

    // Cap very large images so PDF viewers stay responsive.
    const scale = Math.min(1, MAX_PAGE_POINTS / Math.max(image.width, image.height));
    const width = image.width * scale;
    const height = image.height * scale;
    const page = document.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return document.save();
}
