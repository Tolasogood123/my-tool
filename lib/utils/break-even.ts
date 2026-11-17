/** Pure break-even analysis calculations. */

export interface BreakEvenResult {
  fixedCost: number;
  variableCostPerUnit: number;
  sellingPrice: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  breakEvenUnitsExact: number;
  breakEvenUnits: number;
  breakEvenRevenueExact: number;
  breakEvenRevenue: number;
}

/**
 * Break-even units = fixed cost / (selling price - variable cost per unit).
 * Whole-unit figures round up, because a fraction of a unit cannot be sold.
 */
export function calculateBreakEven(
  fixedCost: number,
  variableCostPerUnit: number,
  sellingPrice: number,
): { result: BreakEvenResult | null; error: string | null } {
  if (!Number.isFinite(fixedCost) || fixedCost < 0) {
    return { result: null, error: "Enter a valid fixed cost of zero or more." };
  }
  if (!Number.isFinite(variableCostPerUnit) || variableCostPerUnit < 0) {
    return {
      result: null,
      error: "Enter a valid variable cost per unit of zero or more.",
    };
  }
  if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
    return { result: null, error: "Enter a selling price greater than zero." };
  }

  const contributionMargin = sellingPrice - variableCostPerUnit;
  if (contributionMargin <= 0) {
    return {
      result: null,
      error:
        "The selling price must be higher than the variable cost per unit. Otherwise every sale loses money and there is no break-even point.",
    };
  }

  const breakEvenUnitsExact = fixedCost / contributionMargin;
  const breakEvenUnits = Math.ceil(breakEvenUnitsExact);

  return {
    result: {
      fixedCost,
      variableCostPerUnit,
      sellingPrice,
      contributionMargin,
      contributionMarginRatio: (contributionMargin / sellingPrice) * 100,
      breakEvenUnitsExact,
      breakEvenUnits,
      breakEvenRevenueExact: breakEvenUnitsExact * sellingPrice,
      breakEvenRevenue: breakEvenUnits * sellingPrice,
    },
    error: null,
  };
}
