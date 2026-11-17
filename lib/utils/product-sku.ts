/** Pure product SKU generation with a uniqueness guarantee. */

export interface SkuOptions {
  prefix: string;
  category: string;
  separator: string;
  start: number;
  quantity: number;
  padding: number;
  suffix: string;
}

export interface SkuResult {
  skus: string[];
  error: string | null;
}

/** Normalises a code segment to uppercase A-Z, 0-9, hyphen and underscore. */
function sanitizeCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateSkus(options: SkuOptions): SkuResult {
  const { start, quantity, padding } = options;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    return { skus: [], error: "Quantity must be a whole number from 1 to 100." };
  }
  if (!Number.isInteger(start) || start < 0) {
    return {
      skus: [],
      error: "Start number must be a whole number of zero or more.",
    };
  }
  if (!Number.isInteger(padding) || padding < 1 || padding > 10) {
    return { skus: [], error: "Number padding must be between 1 and 10 digits." };
  }

  const prefix = sanitizeCode(options.prefix);
  const category = sanitizeCode(options.category);
  const suffix = sanitizeCode(options.suffix);
  const separator = options.separator || "-";

  const skus: string[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < quantity; index += 1) {
    const number = String(start + index).padStart(padding, "0");
    const parts = [prefix, category, number, suffix].filter((part) => part.length > 0);
    const sku = parts.join(separator);
    if (seen.has(sku)) {
      return {
        skus: [],
        error: `Duplicate SKU detected (${sku}). Adjust your pattern to keep codes unique.`,
      };
    }
    seen.add(sku);
    skus.push(sku);
  }

  return { skus, error: null };
}

export function skusToCsv(skus: string[]): string {
  const rows = ["Index,SKU"];
  skus.forEach((sku, index) => {
    const safe =
      /[",\r\n]/.test(sku) ? `"${sku.replace(/"/g, '""')}"` : sku;
    rows.push(`${index + 1},${safe}`);
  });
  return rows.join("\r\n");
}
