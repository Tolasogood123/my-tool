export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

export const MAX_TEXT_INPUT_CHARS = 500_000;
export const MAX_PDF_UPLOAD_BYTES = 20 * 1024 * 1024;
