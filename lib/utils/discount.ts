/** Pure discount calculations. */

export type DiscountMode = "amount" | "reverse";

export interface DiscountResult {
  original: number;
  discount: number;
  finalPrice: number;
  saved: number;
}

export function calculateDiscount(
  mode: DiscountMode,
  first: number,
  percent: number,
): { result: DiscountResult | null; error: string | null } {
  if (!Number.isFinite(first) || first < 0) {
    return { result: null, error: "Enter a valid price of zero or more." };
  }
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    return { result: null, error: "Discount must be between 0 and 100%." };
  }

  if (mode === "amount") {
    const saved = first * (percent / 100);
    return {
      result: { original: first, discount: percent, finalPrice: first - saved, saved },
      error: null,
    };
  }

  if (percent === 100) {
    return { result: null, error: "A 100% discount cannot be reversed from a sale price." };
  }
  const original = first / (1 - percent / 100);
  const saved = original - first;
  return {
    result: { original, discount: percent, finalPrice: first, saved },
    error: null,
  };
}
