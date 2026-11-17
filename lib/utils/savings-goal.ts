/** Pure savings-goal projection with optional monthly compounding. */

export interface SavingsInputs {
  goal: number;
  current: number;
  monthlyContribution: number;
  annualRatePercent: number;
}

export interface SavingsResult {
  reachable: boolean;
  months: number;
  years: number;
  remainingMonths: number;
  totalContributed: number;
  interestEarned: number;
  finalBalance: number;
}

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
const MAX_MONTHS = 12000; // 1000 years safety cap

export function validateSavingsInputs(input: SavingsInputs): string | null {
  if (!Number.isFinite(input.goal) || input.goal <= 0) return "Enter a goal greater than zero.";
  if (!Number.isFinite(input.current) || input.current < 0) return "Current savings cannot be negative.";
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution < 0) return "Monthly contribution cannot be negative.";
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0 || input.annualRatePercent > 100) return "Annual rate must be between 0 and 100%.";
  return null;
}

/** Project month by month: interest is applied to the balance, then the deposit is added. */
export function calculateSavingsGoal(input: SavingsInputs): SavingsResult {
  const rate = input.annualRatePercent / 100 / 12;
  let balance = input.current;
  let contributed = 0;
  let interest = 0;
  let months = 0;

  while (balance < input.goal && months < MAX_MONTHS) {
    const before = balance;
    balance = before * (1 + rate) + input.monthlyContribution;
    const interestThisMonth = balance - before - input.monthlyContribution;
    interest += interestThisMonth;
    contributed += input.monthlyContribution;
    months += 1;
    if (input.monthlyContribution <= 0 && interestThisMonth <= 0) break;
  }

  const reachable = balance >= input.goal;

  return {
    reachable,
    months,
    years: Math.floor(months / 12),
    remainingMonths: months % 12,
    totalContributed: round2(contributed),
    interestEarned: round2(interest),
    finalBalance: round2(balance),
  };
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} ${rest === 1 ? "month" : "months"}`;
  if (rest === 0) return `${years} ${years === 1 ? "year" : "years"}`;
  return `${years} ${years === 1 ? "year" : "years"}, ${rest} ${rest === 1 ? "month" : "months"}`;
}
