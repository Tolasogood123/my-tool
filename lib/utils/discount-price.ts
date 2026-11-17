/** Pure helpers for turning a bulk price list into a discounted price list. */

export type DiscountType = "percent" | "fixed";

export interface PriceItem {
  name: string;
  originalPrice: number;
}

export interface DiscountedItem extends PriceItem {
  discountAmount: number;
  salePrice: number;
}

export interface ParsedPriceList {
  items: PriceItem[];
  errors: string[];
}

/** Parses "Product, 19.99" lines (comma or tab separated). */
export function parsePriceList(input: string): ParsedPriceList {
  const items: PriceItem[] = [];
  const errors: string[] = [];

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;
    const parts = line.includes("\t") ? line.split("\t") : line.split(",");
    const name = (parts[0] ?? "").trim();
    const priceText = (parts[1] ?? "").trim();

    if (!name) {
      errors.push(`Line ${index + 1}: missing product name.`);
      return;
    }
    if (parts.length < 2 || !priceText) {
      errors.push(`Line ${index + 1}: missing price for "${name}".`);
      return;
    }

    const price = Number(priceText);
    if (!Number.isFinite(price) || price < 0) {
      errors.push(`Line ${index + 1}: "${priceText}" is not a valid price.`);
      return;
    }

    items.push({ name, originalPrice: price });
  });

  if (items.length === 0 && errors.length === 0) {
    errors.push("Add at least one product line, for example: T-Shirt, 19.99");
  }
  return { items, errors };
}

/** Validates a discount value for the chosen type. */
export function validateDiscount(type: DiscountType, value: number): string | null {
  if (!Number.isFinite(value)) return "Enter a valid discount value.";
  if (type === "percent" && (value < 0 || value > 100)) {
    return "A percentage discount must be between 0% and 100%.";
  }
  if (type === "fixed" && value < 0) return "A fixed discount cannot be negative.";
  return null;
}

/**
 * Applies a percentage or fixed discount to each item, rounding money to
 * two decimals. Fixed discounts never reduce a price below zero.
 */
export function applyDiscount(
  items: PriceItem[],
  type: DiscountType,
  value: number,
): DiscountedItem[] {
  const error = validateDiscount(type, value);
  if (error) throw new Error(error);

  return items.map((item) => {
    const rawDiscount = type === "percent" ? item.originalPrice * (value / 100) : value;
    const discountAmount = Math.round(Math.min(rawDiscount, item.originalPrice) * 100) / 100;
    const salePrice = Math.round((item.originalPrice - discountAmount) * 100) / 100;
    return { ...item, discountAmount, salePrice };
  });
}

function escapeCsvCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Serializes the discounted list to CSV with a header row. */
export function discountedItemsToCsv(items: DiscountedItem[], type: DiscountType, value: number): string {
  const label = type === "percent" ? `${value}% off` : `${value.toFixed(2)} off`;
  const rows: (string | number)[][] = [
    ["Product", "Original Price", `Discount (${label})`, "Sale Price"],
    ...items.map((item) => [
      item.name,
      item.originalPrice.toFixed(2),
      item.discountAmount.toFixed(2),
      item.salePrice.toFixed(2),
    ]),
  ];
  const total = items.reduce((sum, item) => sum + item.salePrice, 0);
  rows.push([]);
  rows.push(["Total sale value", "", "", total.toFixed(2)]);
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
