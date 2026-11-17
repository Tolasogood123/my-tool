/** Web Crypto hashing helpers for text and files. Browser-only, secure context required. */

export type HashAlgorithm = "SHA-256" | "SHA-1";

export const HASH_ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-1"];

function ensureCrypto(): void {
  if (typeof globalThis === "undefined" || !globalThis.crypto || !globalThis.crypto.subtle) {
    throw new Error("Web Crypto is unavailable. Use a secure context (HTTPS or localhost).");
  }
}

function bytesToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

async function digest(data: BufferSource, algorithm: HashAlgorithm): Promise<string> {
  ensureCrypto();
  const result = await globalThis.crypto.subtle.digest(algorithm, data);
  return bytesToHex(result);
}

/** Hash a UTF-8 string and return a lowercase hex digest. */
export async function hashText(text: string, algorithm: HashAlgorithm = "SHA-256"): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  return digest(encoded as BufferSource, algorithm);
}

/** Hash the raw bytes of a File and return a lowercase hex digest. */
export async function hashFile(file: File, algorithm: HashAlgorithm = "SHA-256"): Promise<string> {
  if (!file) throw new Error("Choose a file or enter some text first.");
  const buffer = await file.arrayBuffer();
  return digest(buffer, algorithm);
}

/** Short preview used in tight UI spaces. */
export function shortHash(hex: string, chars = 16): string {
  if (hex.length <= chars) return hex;
  return `${hex.slice(0, chars)}…`;
}
