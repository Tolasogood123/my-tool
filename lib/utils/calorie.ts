/** Mifflin-St Jeor calorie estimates. Estimates only, not medical advice. */

export const CALORIE_DISCLAIMER =
  "Estimate only, not medical advice. The Mifflin-St Jeor equation gives a rough resting metabolic rate; actual needs vary with genetics, body composition, hormones, and activity. For health or weight decisions, consult a qualified professional.";

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active";
export type Goal = "lose" | "maintain" | "gain";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

export interface CalorieInput {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  adjustment: number;
  target: number;
}

export function calculateCalories(
  input: CalorieInput,
): { result: CalorieResult | null; error: string | null } {
  if (input.sex !== "male" && input.sex !== "female") {
    return { result: null, error: "Choose a sex for the equation." };
  }
  if (!Number.isFinite(input.age) || input.age < 15 || input.age > 100) {
    return { result: null, error: "Age must be between 15 and 100 years." };
  }
  if (!Number.isFinite(input.weightKg) || input.weightKg < 25 || input.weightKg > 300) {
    return { result: null, error: "Weight must be between 25 and 300 kg." };
  }
  if (!Number.isFinite(input.heightCm) || input.heightCm < 100 || input.heightCm > 250) {
    return { result: null, error: "Height must be between 100 and 250 cm." };
  }
  if (!(input.activity in ACTIVITY_MULTIPLIERS)) {
    return { result: null, error: "Choose a valid activity level." };
  }
  if (!(input.goal in GOAL_ADJUSTMENTS)) {
    return { result: null, error: "Choose a valid goal." };
  }

  const base =
    10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  const bmr = input.sex === "male" ? base + 5 : base - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activity];
  const adjustment = GOAL_ADJUSTMENTS[input.goal];
  const target = tdee + adjustment;

  return {
    result: {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      adjustment,
      target: Math.round(target),
    },
    error: null,
  };
}

/** Plain-text summary of a calorie estimate. */
export function formatCalorieReport(result: CalorieResult): string {
  const goalText =
    result.adjustment === 0
      ? "maintain weight"
      : result.adjustment < 0
        ? "lose weight (≈500 kcal/day deficit)"
        : "gain weight (≈500 kcal/day surplus)";
  return [
    `BMR (Mifflin-St Jeor): ${result.bmr} kcal/day`,
    `Activity-adjusted TDEE: ${result.tdee} kcal/day`,
    `Goal: ${goalText}`,
    `Estimated daily target: ${result.target} kcal/day`,
    "",
    CALORIE_DISCLAIMER,
  ].join("\n");
}
