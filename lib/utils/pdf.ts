import { MAX_PDF_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "./format";
import { downloadBlob } from "./download";

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Unsupported file type. Please choose a PDF file.";
  }
  if (file.size === 0) {
    return "That file is empty. Please choose another PDF.";
  }
  if (file.size > MAX_PDF_UPLOAD_BYTES) {
    return `That file is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_PDF_UPLOAD_BYTES)}.`;
  }
  return null;
}

export function downloadPdf(bytes: Uint8Array, filename: string): void {
  // Copy into a fresh ArrayBuffer so the Blob owns its memory.
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  downloadBlob(new Blob([buffer], { type: "application/pdf" }), filename);
}
