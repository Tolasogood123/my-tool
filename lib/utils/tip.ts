/** Pure tip and split-bill calculations. */

export interface SplitResult {
  subtotal: number;
  tipPercent: number;
  tip: number;
  total: number;
  people: number;
  perPerson: number;
}

export function calculateSplit(
  subtotal: number,
  tipPercent: number,
  people: number,
): { result: SplitResult | null; error: string | null } {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return { result: null, error: "Enter a valid bill amount of zero or more." };
  }
  if (!Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) {
    return { result: null, error: "Tip must be between 0 and 100%." };
  }
  if (!Number.isInteger(people) || people < 1 || people > 100) {
    return { result: null, error: "Number of people must be a whole number from 1 to 100." };
  }

  const tip = subtotal * (tipPercent / 100);
  const total = subtotal + tip;
  return {
    result: {
      subtotal,
      tipPercent,
      tip,
      total,
      people,
      perPerson: total / people,
    },
    error: null,
  };
}
