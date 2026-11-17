/** Pure helpers for comparing volumetric and actual shipping weight. */

export interface ShippingInput {
  /** Longest side in centimetres. */
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  /** Scale weight in kilograms. */
  actualWeightKg: number;
  /** Carrier rate in currency units per chargeable kilogram. */
  ratePerKg: number;
  /** Volumetric divisor (cm³ per kg). Common values: 5000 or 6000. */
  divisor: number;
}

export interface ShippingResult {
  volumeCm3: number;
  volumetricWeightKg: number;
  actualWeightKg: number;
  chargeableWeightKg: number;
  basis: "actual" | "volumetric" | "equal";
  estimatedCost: number;
}

/** Validates the shipping inputs, returning a human-readable error or null. */
export function validateShippingInput(input: ShippingInput): string | null {
  const { lengthCm, widthCm, heightCm, actualWeightKg, ratePerKg, divisor } = input;
  if (![lengthCm, widthCm, heightCm, actualWeightKg, ratePerKg, divisor].every(Number.isFinite)) {
    return "All fields must be valid numbers.";
  }
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) {
    return "Length, width and height must each be greater than zero.";
  }
  if (actualWeightKg < 0) return "Actual weight cannot be negative.";
  if (ratePerKg < 0) return "The rate per kilogram cannot be negative.";
  if (divisor <= 0) return "The volumetric divisor must be greater than zero.";
  return null;
}

/**
 * Calculates volumetric weight, chargeable weight and the estimated cost.
 * Volumetric weight = (L × W × H) / divisor.
 * Chargeable weight = the greater of volumetric and actual weight.
 */
export function calculateShippingCost(input: ShippingInput): ShippingResult {
  const error = validateShippingInput(input);
  if (error) throw new Error(error);

  const volumeCm3 = input.lengthCm * input.widthCm * input.heightCm;
  const volumetricWeightKg = volumeCm3 / input.divisor;
  const actualWeightKg = input.actualWeightKg;

  let basis: ShippingResult["basis"] = "equal";
  if (actualWeightKg > volumetricWeightKg) basis = "actual";
  else if (volumetricWeightKg > actualWeightKg) basis = "volumetric";

  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);
  const estimatedCost = chargeableWeightKg * input.ratePerKg;

  return {
    volumeCm3,
    volumetricWeightKg,
    actualWeightKg,
    chargeableWeightKg,
    basis,
    estimatedCost,
  };
}
