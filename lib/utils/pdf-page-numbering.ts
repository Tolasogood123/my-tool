/** Pure helpers for stamping page numbers onto a PDF with pdf-lib. */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export type PageNumberFormat =
  | "decimal"
  | "roman-lower"
  | "roman-upper"
  | "alpha-lower"
  | "alpha-upper"
  | "x-of-y";

export interface PageNumberOptions {
  position: PageNumberPosition;
  format: PageNumberFormat;
  fontSize: number;
  margin: number;
  startNumber: number;
  prefix: string;
  suffix: string;
  colorHex: string;
  skipFirst: boolean;
}

export const DEFAULT_PAGE_NUMBER_OPTIONS: PageNumberOptions = {
  position: "bottom-center",
  format: "decimal",
  fontSize: 11,
  margin: 36,
  startNumber: 1,
  prefix: "",
  suffix: "",
  colorHex: "#000000",
  skipFirst: false,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function validatePdfForNumbering(file: File): string | null {
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

/** Converts #RGB or #RRGGBB into pdf-lib's 0–1 RGB components. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return { r: 0, g: 0, b: 0 };
  const value = parseInt(full, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

const ROMAN_NUMERALS: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** 1 -> I, 4 -> IV, 1994 -> MCMXCIV. */
export function toRoman(value: number): string {
  let remaining = Math.max(1, Math.trunc(value));
  let result = "";
  for (const [amount, symbol] of ROMAN_NUMERALS) {
    while (remaining >= amount) {
      result += symbol;
      remaining -= amount;
    }
  }
  return result;
}

/** 1 -> A, 26 -> Z, 27 -> AA. */
export function toAlpha(value: number): string {
  let remaining = Math.max(1, Math.trunc(value));
  let result = "";
  while (remaining > 0) {
    remaining -= 1;
    result = String.fromCharCode(65 + (remaining % 26)) + result;
    remaining = Math.floor(remaining / 26);
  }
  return result;
}

export function formatPageNumber(
  number: number,
  total: number,
  format: PageNumberFormat,
): string {
  switch (format) {
    case "roman-lower":
      return toRoman(number).toLowerCase();
    case "roman-upper":
      return toRoman(number);
    case "alpha-lower":
      return toAlpha(number).toLowerCase();
    case "alpha-upper":
      return toAlpha(number);
    case "x-of-y":
      return `${number} / ${total}`;
    case "decimal":
    default:
      return String(number);
  }
}

export function buildPageLabel(
  number: number,
  total: number,
  options: PageNumberOptions,
): string {
  return `${options.prefix}${formatPageNumber(number, total, options.format)}${options.suffix}`;
}

/** Loads a PDF, draws the configured label on every page and returns the saved bytes. */
export async function numberPages(
  bytes: Uint8Array,
  options: PageNumberOptions,
): Promise<Uint8Array> {
  const document = await PDFDocument.load(bytes, { ignoreEncryption: false });
  const font = await document.embedFont(StandardFonts.Helvetica);
  const color = hexToRgb(options.colorHex);
  const fontSize = clamp(options.fontSize, 6, 72);
  const margin = clamp(options.margin, 0, 200);
  const start = Number.isFinite(options.startNumber)
    ? Math.trunc(options.startNumber)
    : 1;
  const total = document.getPageCount();
  const pages = document.getPages();

  for (let index = 0; index < pages.length; index += 1) {
    if (options.skipFirst && index === 0) continue;

    const page = pages[index];
    const { width, height } = page.getSize();
    const label = buildPageLabel(start + index, total, options);
    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x = margin;
    if (options.position.endsWith("center")) x = (width - textWidth) / 2;
    else if (options.position.endsWith("right")) x = width - margin - textWidth;

    const y = options.position.startsWith("top")
      ? height - margin - fontSize
      : margin;

    page.drawText(label, {
      x: Math.max(0, x),
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }

  return document.save();
}
