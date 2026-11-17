/** Pure helpers for drawing a text watermark over a PDF with pdf-lib. */

import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

export type WatermarkPlacement =
  | "center"
  | "diagonal"
  | "tiled"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface WatermarkOptions {
  text: string;
  opacity: number;
  rotation: number;
  fontSize: number;
  colorHex: string;
  bold: boolean;
  placement: WatermarkPlacement;
}

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  text: "DRAFT",
  opacity: 0.25,
  rotation: -45,
  fontSize: 48,
  colorHex: "#808080",
  bold: true,
  placement: "diagonal",
};

const EDGE_MARGIN = 24;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function validatePdfForWatermark(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Unsupported file type. Choose a PDF file.";
  }
  if (file.size === 0) return "That file is empty. Choose another PDF.";
  if (file.size > MAX_PDF_UPLOAD_BYTES) {
    return `That PDF is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_PDF_UPLOAD_BYTES)}.`;
  }
  return null;
}

/** Reads the page count of a PDF already validated by the component. */
export async function readPdfPageCount(bytes: Uint8Array): Promise<number> {
  const document = await PDFDocument.load(bytes, { ignoreEncryption: false });
  return document.getPageCount();
}

export function validateWatermarkText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return "Enter the watermark text.";
  if (trimmed.length > 120) return "Keep the watermark text under 120 characters.";
  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return { r: 0.5, g: 0.5, b: 0.5 };
  const value = parseInt(full, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

/** Loads a PDF, draws the watermark on each page and returns the saved bytes. */
export async function drawWatermark(
  bytes: Uint8Array,
  options: WatermarkOptions,
): Promise<Uint8Array> {
  const textError = validateWatermarkText(options.text);
  if (textError) throw new Error(textError);

  const document = await PDFDocument.load(bytes, { ignoreEncryption: false });
  const font = await document.embedFont(
    options.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica,
  );
  const color = hexToRgb(options.colorHex);
  const opacity = clamp(options.opacity, 0.02, 1);
  const rotation = clamp(options.rotation, -180, 180);
  const fontSize = clamp(options.fontSize, 8, 200);
  const text = options.text.replace(/[\r\n]+/g, " ").trim();
  const textWidth = font.widthOfTextAtSize(text, fontSize);

  for (const page of document.getPages()) {
    const { width, height } = page.getSize();
    const base = {
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    };

    if (options.placement === "tiled") {
      const stepX = Math.max(textWidth + fontSize * 2, 140);
      const stepY = Math.max(fontSize * 5, 80);
      for (let y = -stepY; y < height + stepY; y += stepY) {
        for (let x = -stepX; x < width + stepX; x += stepX) {
          page.drawText(text, { ...base, x, y });
        }
      }
      continue;
    }

    let x: number;
    let y: number;

    switch (options.placement) {
      case "top-left":
        x = EDGE_MARGIN;
        y = height - EDGE_MARGIN - fontSize;
        break;
      case "top-right":
        x = width - EDGE_MARGIN - textWidth;
        y = height - EDGE_MARGIN - fontSize;
        break;
      case "bottom-left":
        x = EDGE_MARGIN;
        y = EDGE_MARGIN;
        break;
      case "bottom-right":
        x = width - EDGE_MARGIN - textWidth;
        y = EDGE_MARGIN;
        break;
      case "center":
      case "diagonal":
      default:
        x = (width - textWidth) / 2;
        y = (height - fontSize) / 2;
        break;
    }

    page.drawText(text, { ...base, x, y });
  }

  return document.save();
}
