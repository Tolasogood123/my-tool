import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/constants/limits";
import { formatBytes } from "./format";

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Unsupported file type. Please choose a JPG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That file is ${formatBytes(file.size)}. The maximum size is ${formatBytes(
      MAX_IMAGE_UPLOAD_BYTES,
    )}.`;
  }
  if (file.size === 0) {
    return "That file is empty. Please choose another image.";
  }
  return null;
}

export function sanitizeFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-");
  return cleaned.replace(/^-|-$/g, "") || "file";
}
