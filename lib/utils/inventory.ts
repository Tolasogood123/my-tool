/** Pure inventory math: safety stock, reorder point and economic order quantity. */

export interface InventoryInput {
  /** Total units sold per year (D). */
  annualDemand: number;
  /** Operating days per year used to derive average daily demand. */
  workingDays: number;
  /** Supplier lead time in days (L). */
  leadTimeDays: number;
  /** Z-score for the desired service level. */
  serviceLevelZ: number;
  /** Standard deviation of daily demand in units. */
  demandStdDevDaily: number;
  /** Standard deviation of lead time in days. */
  leadTimeStdDevDays: number;
  /** Fixed cost placed per purchase order (S). */
  orderingCost: number;
  /** Cost to hold one unit in stock for one year (H). */
  holdingCostPerUnitYear: number;
}

export interface InventoryResult {
  dailyDemand: number;
  leadTimeDemand: number;
  demandDuringLeadTimeStdDev: number;
  safetyStock: number;
  reorderPoint: number;
  eoq: number;
  ordersPerYear: number;
  cycleDays: number;
}

export const SERVICE_LEVELS = [
  { label: "90% — z ≈ 1.28", z: 1.2816 },
  { label: "95% — z ≈ 1.65", z: 1.6449 },
  { label: "97.5% — z ≈ 1.96", z: 1.96 },
  { label: "99% — z ≈ 2.33", z: 2.3263 },
] as const;

export const INVENTORY_FORMULAS = {
  dailyDemand: "d = D ÷ working days",
  leadTimeDemand: "Lead-time demand = d × L",
  safetyStock:
    "SS = z × √(L × σd² + d² × σL²)",
  reorderPoint: "ROP = (d × L) + SS",
  eoq: "EOQ = √(2 × D × S ÷ H)",
} as const;

/** Validates inventory inputs, returning a human-readable error or null. */
export function validateInventoryInput(input: InventoryInput): string | null {
  const values = [
    input.annualDemand,
    input.workingDays,
    input.leadTimeDays,
    input.serviceLevelZ,
    input.demandStdDevDaily,
    input.leadTimeStdDevDays,
    input.orderingCost,
    input.holdingCostPerUnitYear,
  ];
  if (!values.every(Number.isFinite)) return "All fields must be valid numbers.";
  if (input.annualDemand <= 0) return "Annual demand must be greater than zero.";
  if (input.workingDays <= 0 || input.workingDays > 366) {
    return "Working days per year must be between 1 and 366.";
  }
  if (input.leadTimeDays < 0) return "Lead time cannot be negative.";
  if (input.serviceLevelZ < 0) return "The service level z-score cannot be negative.";
  if (input.demandStdDevDaily < 0 || input.leadTimeStdDevDays < 0) {
    return "Standard deviations cannot be negative.";
  }
  if (input.orderingCost <= 0) return "Ordering cost per order must be greater than zero.";
  if (input.holdingCostPerUnitYear <= 0) {
    return "Holding cost per unit per year must be greater than zero.";
  }
  return null;
}

/**
 * Calculates the standard continuous-review inventory figures.
 * Safety stock combines demand variability and lead-time variability.
 */
export function calculateInventory(input: InventoryInput): InventoryResult {
  const error = validateInventoryInput(input);
  if (error) throw new Error(error);

  const dailyDemand = input.annualDemand / input.workingDays;
  const leadTimeDemand = dailyDemand * input.leadTimeDays;
  const demandDuringLeadTimeStdDev = Math.sqrt(
    input.leadTimeDays * input.demandStdDevDaily ** 2 +
      dailyDemand ** 2 * input.leadTimeStdDevDays ** 2,
  );
  const safetyStock = input.serviceLevelZ * demandDuringLeadTimeStdDev;
  const reorderPoint = leadTimeDemand + safetyStock;
  const eoq = Math.sqrt(
    (2 * input.annualDemand * input.orderingCost) / input.holdingCostPerUnitYear,
  );
  const ordersPerYear = input.annualDemand / eoq;

  return {
    dailyDemand,
    leadTimeDemand,
    demandDuringLeadTimeStdDev,
    safetyStock,
    reorderPoint,
    eoq,
    ordersPerYear,
    cycleDays: input.workingDays / ordersPerYear,
  };
}
