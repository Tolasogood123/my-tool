/** Pure VAT calculations. Rates are supplied by the user; no jurisdiction assumptions. */

export type VatMode = "add" | "remove";

export interface VatResult {
  net: number;
  vat: number;
  gross: number;
  rate: number;
}

export function calculateVat(
  mode: VatMode,
  amount: number,
  rate: number,
): { result: VatResult | null; error: string | null } {
  if (!Number.isFinite(amount) || amount < 0) {
    return { result: null, error: "Enter a valid amount of zero or more." };
  }
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    return { result: null, error: "VAT rate must be between 0 and 100%." };
  }

  if (mode === "add") {
    const vat = amount * (rate / 100);
    return { result: { net: amount, vat, gross: amount + vat, rate }, error: null };
  }

  const net = amount / (1 + rate / 100);
  return {
    result: { net, vat: amount - net, gross: amount, rate },
    error: null,
  };
}
