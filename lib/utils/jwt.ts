/** JWT decoding only — signature verification is deliberately NOT performed. */

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signatureLength: number;
  expiresAt: string | null;
  issuedAt: string | null;
  expired: boolean | null;
}

function decodeSegment(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function parseObject(segment: string, label: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = JSON.parse(decodeSegment(segment));
  } catch {
    throw new Error(`The JWT ${label} is not valid UTF-8 JSON.`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`The JWT ${label} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

function formatClaim(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace("T", " ").replace(".000Z", " UTC");
}

/** Decodes header/payload and reports time claims without checking the signature. */
export function decodeJwt(token: string): { decoded: DecodedJwt | null; error: string | null } {
  const trimmed = token.trim();
  if (!trimmed) return { decoded: null, error: "Paste a JWT first." };

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      decoded: null,
      error: "A JWT must have three parts separated by dots: header.payload.signature.",
    };
  }

  try {
    const header = parseObject(parts[0], "header");
    const payload = parseObject(parts[1], "payload");
    const nowSeconds = Date.now() / 1000;

    return {
      decoded: {
        header,
        payload,
        signatureLength: parts[2].length,
        expiresAt: formatClaim(payload.exp),
        issuedAt: formatClaim(payload.iat),
        expired: typeof payload.exp === "number" ? payload.exp < nowSeconds : null,
      },
      error: null,
    };
  } catch (cause) {
    return {
      decoded: null,
      error: cause instanceof Error ? cause.message : "Could not decode this token.",
    };
  }
}

export function formatJwtReport(decoded: DecodedJwt): string {
  return [
    "HEADER",
    JSON.stringify(decoded.header, null, 2),
    "PAYLOAD",
    JSON.stringify(decoded.payload, null, 2),
    `Signature length (not verified): ${decoded.signatureLength} characters`,
    `Issued at: ${decoded.issuedAt ?? "not present"}`,
    `Expires at: ${decoded.expiresAt ?? "not present"}`,
  ].join("\n");
}
