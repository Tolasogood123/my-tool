/** Pure marketplace fee and net-payout calculations.
 *  Every fee rate is supplied by the user; no marketplace rates are hardcoded. */

export interface FeeLine {
  id: string;
  label: string;
  percent: number;
}

export interface FeeBreakdown {
  label: string;
  percent: number;
  amount: number;
}

export interface MarketplaceFeeResult {
  salePrice: number;
  fees: FeeBreakdown[];
  totalPercent: number;
  totalPercentFees: number;
  fixedFees: number;
  totalFees: number;
  netPayout: number;
  effectiveFeeRate: number;
}

export function calculateMarketplaceFees(
  salePrice: number,
  feeLines: FeeLine[],
  fixedFees: number,
): { result: MarketplaceFeeResult | null; error: string | null } {
  if (!Number.isFinite(salePrice) || salePrice <= 0) {
    return { result: null, error: "Enter a sale price greater than zero." };
  }
  if (!Number.isFinite(fixedFees) || fixedFees < 0) {
    return { result: null, error: "Enter fixed fees of zero or more." };
  }

  const fees: FeeBreakdown[] = [];
  let totalPercent = 0;
  for (const line of feeLines) {
    const label = line.label.trim() || "Unnamed fee";
    if (!Number.isFinite(line.percent) || line.percent < 0 || line.percent > 100) {
      return {
        result: null,
        error: `Fee "${label}" must be between 0% and 100%.`,
      };
    }
    totalPercent += line.percent;
    fees.push({
      label,
      percent: line.percent,
      amount: salePrice * (line.percent / 100),
    });
  }

  const totalPercentFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalFees = totalPercentFees + fixedFees;
  const netPayout = salePrice - totalFees;

  return {
    result: {
      salePrice,
      fees,
      totalPercent,
      totalPercentFees,
      fixedFees,
      totalFees,
      netPayout,
      effectiveFeeRate: (totalFees / salePrice) * 100,
    },
    error: null,
  };
}
