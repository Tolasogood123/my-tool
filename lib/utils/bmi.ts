/** Pure Body Mass Index math. Educational only — never a medical diagnosis. */

export type BmiSystem = "metric" | "imperial";

export type BmiCategoryId = "underweight" | "healthy" | "overweight" | "obese";

export interface BmiCategory {
  id: BmiCategoryId;
  label: string;
  range: string;
}

export interface BmiResult {
  value: number;
  category: BmiCategory;
  healthyWeightMin: number;
  healthyWeightMax: number;
  system: BmiSystem;
}

/** 1 lb = 0.45359237 kg (exact international avoirdupois pound). */
export function poundsToKg(pounds: number): number {
  return pounds * 0.45359237;
}

/** 1 inch = 0.0254 m (exact). */
export function inchesToMeters(inches: number): number {
  return inches * 0.0254;
}

export function feetAndInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

const CATEGORIES: BmiCategory[] = [
  { id: "underweight", label: "Underweight", range: "Below 18.5" },
  { id: "healthy", label: "Healthy range", range: "18.5 – 24.9" },
  { id: "overweight", label: "Overweight", range: "25.0 – 29.9" },
  { id: "obese", label: "Obese", range: "30.0 and above" },
];

export function bmiCategory(value: number): BmiCategory {
  if (!Number.isFinite(value) || value <= 0) return CATEGORIES[0];
  if (value < 18.5) return CATEGORIES[0];
  if (value < 25) return CATEGORIES[1];
  if (value < 30) return CATEGORIES[2];
  return CATEGORIES[3];
}

/**
 * @param weight kilograms (metric) or pounds (imperial)
 * @param height meters (metric) or inches (imperial)
 */
export function calculateBmi(
  weight: number,
  height: number,
  system: BmiSystem,
): BmiResult {
  if (!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0) {
    throw new Error("Enter a positive weight and height.");
  }
  const value = system === "metric" ? weight / height ** 2 : (703 * weight) / height ** 2;
  const heightMeters = system === "metric" ? height : inchesToMeters(height);
  const healthyWeightMin = 18.5 * heightMeters ** 2;
  const healthyWeightMax = 24.9 * heightMeters ** 2;

  return {
    value,
    category: bmiCategory(value),
    healthyWeightMin,
    healthyWeightMax,
    system,
  };
}

export const BMI_DISCLAIMER =
  "BMI is a simple screening ratio, not a medical diagnosis. It ignores muscle mass, bone density, age, sex and ethnicity. Talk to a qualified health professional about your individual situation.";
