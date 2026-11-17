/** Pure weighted-grade computation for assessed coursework. */

export interface AssessmentInput {
  name: string;
  score: number;
  weight: number;
}

export interface GradeResult {
  currentGrade: number;
  countedWeight: number;
  contributions: number[];
}

export function calculateGrade(rows: AssessmentInput[]): {
  result: GradeResult | null;
  error: string | null;
} {
  if (rows.length === 0) return { result: null, error: "Add at least one assessment." };

  let weightedPoints = 0;
  let countedWeight = 0;

  for (const [index, row] of rows.entries()) {
    const label = row.name.trim() || `Assessment ${index + 1}`;
    if (!Number.isFinite(row.score) || row.score < 0 || row.score > 100) {
      return { result: null, error: `${label}: score must be between 0 and 100.` };
    }
    if (!Number.isFinite(row.weight) || row.weight < 0 || row.weight > 100) {
      return { result: null, error: `${label}: weight must be between 0 and 100.` };
    }
    weightedPoints += row.score * (row.weight / 100);
    countedWeight += row.weight;
  }

  if (countedWeight === 0) {
    return { result: null, error: "Total weight must be greater than zero." };
  }

  return {
    result: {
      currentGrade: weightedPoints / (countedWeight / 100),
      countedWeight,
      contributions: rows.map((row) => row.score * (row.weight / 100)),
    },
    error: null,
  };
}
