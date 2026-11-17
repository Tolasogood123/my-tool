/** Pure helpers for the Instagram grid planner. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

export interface GridImage {
  id: string;
  /** Object URL created by the browser; revoke it when removed or on unmount. */
  url: string;
  name: string;
  size: number;
}

export function validateGridImage(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported file type. Choose a JPEG, PNG, or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}

/** Returns a new array with one item moved by offset, never mutating the input. */
export function moveItem<T>(items: readonly T[], index: number, offset: number): T[] {
  const target = index + offset;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) {
    return [...items];
  }
  const next = [...items];
  const moved = next[index];
  next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

/** Splits a flat list into rows for the three-column preview. */
export function chunkRows<T>(items: readonly T[], columns = 3): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}
