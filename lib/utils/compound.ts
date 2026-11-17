/** Pure compound interest calculations. */

export type Compounding = "annually" | "monthly" | "daily";

const PERIODS: Record<Compounding, number> = {
  annually: 1,
  monthly: 12,
  daily: 365,
};

export interface CompoundResult {
  principal: number;
  rate: number;
  years: number;
  compounding: Compounding;
  finalAmount: number;
  interest: number;
  periods: number;
}

export function calculateCompound(
  principal: number,
  rate: number,
  years: number,
  compounding: Compounding,
): { result: CompoundResult | null; error: string | null } {
  if (!Number.isFinite(principal) || principal < 0) {
    return { result: null, error: "Enter a valid starting amount of zero or more." };
  }
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    return { result: null, error: "Annual rate must be between 0 and 100%." };
  }
  if (!Number.isFinite(years) || years <= 0 || years > 200) {
    return { result: null, error: "Time must be greater than zero and at most 200 years." };
  }

  const periodsPerYear = PERIODS[compounding];
  const periods = periodsPerYear * years;
  const finalAmount = principal * Math.pow(1 + rate / 100 / periodsPerYear, periods);

  return {
    result: {
      principal,
      rate,
      years,
      compounding,
      finalAmount,
      interest: finalAmount - principal,
      periods,
    },
    error: null,
  };
}
