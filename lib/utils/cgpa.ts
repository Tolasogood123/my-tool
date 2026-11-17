/** Pure CGPA computation across semesters. */

export interface SemesterInput {
  name: string;
  credits: number;
  sgpa: number;
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
  points: number;
  semesters: number;
}

export function calculateCgpa(rows: SemesterInput[]): {
  result: CgpaResult | null;
  error: string | null;
} {
  if (rows.length === 0) return { result: null, error: "Add at least one semester." };

  let totalCredits = 0;
  let points = 0;

  for (const [index, row] of rows.entries()) {
    const label = row.name.trim() || `Semester ${index + 1}`;
    if (!Number.isFinite(row.credits) || row.credits <= 0) {
      return { result: null, error: `${label}: credits must be greater than zero.` };
    }
    if (!Number.isFinite(row.sgpa) || row.sgpa < 0 || row.sgpa > 4) {
      return { result: null, error: `${label}: SGPA must be between 0 and 4.` };
    }
    totalCredits += row.credits;
    points += row.credits * row.sgpa;
  }

  return {
    result: {
      cgpa: points / totalCredits,
      totalCredits,
      points,
      semesters: rows.length,
    },
    error: null,
  };
}
