/** Pure e-commerce profit and margin calculations. */

export interface EcommerceProfitResult {
  revenue: number;
  cogs: number;
  shipping: number;
  ads: number;
  fees: number;
  returns: number;
  totalCosts: number;
  profit: number;
  margin: number;
  costRatio: number;
}

export function calculateEcommerceProfit(
  revenue: number,
  cogs: number,
  shipping: number,
  ads: number,
  fees: number,
  returns: number,
): { result: EcommerceProfitResult | null; error: string | null } {
  const values: Record<string, number> = {
    revenue,
    "cost of goods": cogs,
    shipping,
    advertising: ads,
    fees,
    returns,
  };
  for (const [label, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      return {
        result: null,
        error: `Enter a valid ${label} amount of zero or more.`,
      };
    }
  }

  const totalCosts = cogs + shipping + ads + fees + returns;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const costRatio = revenue > 0 ? (totalCosts / revenue) * 100 : 0;

  return {
    result: {
      revenue,
      cogs,
      shipping,
      ads,
      fees,
      returns,
      totalCosts,
      profit,
      margin,
      costRatio,
    },
    error: null,
  };
}
