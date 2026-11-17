/** Pure amortized loan calculations. */

export interface LoanResult {
  principal: number;
  annualRate: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  months: number;
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number,
): { result: LoanResult | null; error: string | null } {
  if (!Number.isFinite(principal) || principal <= 0) {
    return { result: null, error: "Loan amount must be greater than zero." };
  }
  if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
    return { result: null, error: "Annual rate must be between 0 and 100%." };
  }
  if (!Number.isFinite(years) || years <= 0 || years > 100) {
    return { result: null, error: "Term must be between 0 and 100 years." };
  }

  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const totalPaid = monthlyPayment * months;

  return {
    result: {
      principal,
      annualRate,
      monthlyPayment,
      totalPaid,
      totalInterest: totalPaid - principal,
      months,
    },
    error: null,
  };
}
