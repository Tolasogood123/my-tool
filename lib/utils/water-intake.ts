/** Simple daily water-intake estimate. Not medical advice. */

export const WATER_DISCLAIMER =
  "Estimate only, not medical advice. Fluid needs depend on many factors including climate, health conditions, pregnancy, and medication. Follow guidance from a qualified health professional, and listen to your body's thirst cues.";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active";

const BASE_ML_PER_KG = 35;
const CUP_ML = 250;

const ACTIVITY_ML: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 300,
  moderate: 500,
  active: 700,
  "very-active": 1000,
};

export interface WaterInput {
  weightKg: number;
  activity: ActivityLevel;
  exerciseMinutes: number;
  hotClimate: boolean;
}

export interface WaterResult {
  baseMl: number;
  activityMl: number;
  climateMl: number;
  totalMl: number;
  liters: number;
  cups: number;
}

export function calculateWaterIntake(
  input: WaterInput,
): { result: WaterResult | null; error: string | null } {
  if (!Number.isFinite(input.weightKg) || input.weightKg < 25 || input.weightKg > 300) {
    return { result: null, error: "Weight must be between 25 and 300 kg." };
  }
  if (!(input.activity in ACTIVITY_ML)) {
    return { result: null, error: "Choose a valid activity level." };
  }
  if (!Number.isFinite(input.exerciseMinutes) || input.exerciseMinutes < 0 || input.exerciseMinutes > 600) {
    return { result: null, error: "Exercise time must be between 0 and 600 minutes." };
  }

  const baseMl = Math.round(input.weightKg * BASE_ML_PER_KG);
  const activityMl = ACTIVITY_ML[input.activity] + Math.round(input.exerciseMinutes * 10);
  const climateMl = input.hotClimate ? 500 : 0;
  const totalMl = baseMl + activityMl + climateMl;

  return {
    result: {
      baseMl,
      activityMl,
      climateMl,
      totalMl,
      liters: Math.round((totalMl / 1000) * 10) / 10,
      cups: Math.round(totalMl / CUP_ML),
    },
    error: null,
  };
}

/** Plain-text summary of a water-intake estimate. */
export function formatWaterReport(result: WaterResult): string {
  return [
    `Baseline (35 ml × body weight): ${result.baseMl} ml`,
    `Activity + exercise allowance: ${result.activityMl} ml`,
    `Hot-climate allowance: ${result.climateMl} ml`,
    `Estimated daily fluid target: ${result.totalMl} ml (${result.liters} L, ≈${result.cups} cups)`,
    "",
    WATER_DISCLAIMER,
  ].join("\n");
}
