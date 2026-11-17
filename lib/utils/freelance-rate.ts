/** Pure freelance/hourly rate math. All figures are annual unless noted. */

export interface RateInputs {
  targetSalary: number;
  annualExpenses: number;
  billableHoursPerWeek: number;
  weeksPerYear: number;
  weeksOff: number;
  taxBufferPercent: number;
  hoursPerDay: number;
}

export interface RateResult {
  workingWeeks: number;
  annualBillableHours: number;
  annualCostBase: number;
  taxBuffer: number;
  requiredRevenue: number;
  hourlyRate: number;
  dayRate: number;
  monthlyRevenue: number;
}

export const DEFAULT_RATE_INPUTS: RateInputs = {
  targetSalary: 60000,
  annualExpenses: 6000,
  billableHoursPerWeek: 25,
  weeksPerYear: 52,
  weeksOff: 4,
  taxBufferPercent: 20,
  hoursPerDay: 8,
};

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export function validateRateInputs(input: RateInputs): string | null {
  if (!Number.isFinite(input.targetSalary) || input.targetSalary < 0) return "Enter a valid target salary of zero or more.";
  if (!Number.isFinite(input.annualExpenses) || input.annualExpenses < 0) return "Enter valid annual expenses of zero or more.";
  if (!Number.isFinite(input.billableHoursPerWeek) || input.billableHoursPerWeek <= 0) return "Billable hours per week must be greater than zero.";
  if (input.billableHoursPerWeek > 80) return "Billable hours per week cannot exceed 80.";
  if (!Number.isFinite(input.weeksPerYear) || input.weeksPerYear <= 0 || input.weeksPerYear > 52) return "Weeks per year must be between 1 and 52.";
  if (!Number.isFinite(input.weeksOff) || input.weeksOff < 0 || input.weeksOff >= input.weeksPerYear) return "Weeks off must be zero or fewer than weeks per year.";
  if (!Number.isFinite(input.taxBufferPercent) || input.taxBufferPercent < 0 || input.taxBufferPercent > 100) return "Tax buffer must be between 0 and 100%.";
  if (!Number.isFinite(input.hoursPerDay) || input.hoursPerDay <= 0 || input.hoursPerDay > 24) return "Billing hours per day must be between 0 and 24.";
  return null;
}

/**
 * Required revenue = take-home pay + expenses + a tax buffer. Dividing that by
 * real billable hours (excluding time off) gives a sustainable hourly floor.
 */
export function calculateFreelanceRate(input: RateInputs): RateResult {
  const workingWeeks = input.weeksPerYear - input.weeksOff;
  const annualBillableHours = input.billableHoursPerWeek * workingWeeks;
  const annualCostBase = input.targetSalary + input.annualExpenses;
  const taxBuffer = annualCostBase * (input.taxBufferPercent / 100);
  const requiredRevenue = annualCostBase + taxBuffer;
  const hourlyRate = annualBillableHours > 0 ? requiredRevenue / annualBillableHours : 0;

  return {
    workingWeeks,
    annualBillableHours,
    annualCostBase: round2(annualCostBase),
    taxBuffer: round2(taxBuffer),
    requiredRevenue: round2(requiredRevenue),
    hourlyRate: round2(hourlyRate),
    dayRate: round2(hourlyRate * input.hoursPerDay),
    monthlyRevenue: round2(requiredRevenue / 12),
  };
}
