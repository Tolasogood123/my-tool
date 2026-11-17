/** Pure conversion helpers for the Unit Converter. No React, no network. */

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "time";

export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  /** Multiplier that converts 1 of this unit into the category base unit. Unused for temperature. */
  factor?: number;
}

export interface CategoryDef {
  id: UnitCategory;
  label: string;
  base: string;
  units: UnitDef[];
}

/**
 * All factors are exact SI-derived constants where one exists. Base units are
 * meter (length), kilogram (weight), square meter (area), liter (volume) and
 * second (time). Temperature is handled separately with exact affine formulas.
 */
export const UNIT_CATEGORIES: CategoryDef[] = [
  {
    id: "length",
    label: "Length",
    base: "meter",
    units: [
      { id: "km", label: "Kilometer", symbol: "km", factor: 1000 },
      { id: "m", label: "Meter", symbol: "m", factor: 1 },
      { id: "cm", label: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "mm", label: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "mi", label: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "yd", label: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "ft", label: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "in", label: "Inch", symbol: "in", factor: 0.0254 },
      { id: "nmi", label: "Nautical mile", symbol: "nmi", factor: 1852 },
    ],
  },
  {
    id: "weight",
    label: "Weight / Mass",
    base: "kilogram",
    units: [
      { id: "t", label: "Metric tonne", symbol: "t", factor: 1000 },
      { id: "kg", label: "Kilogram", symbol: "kg", factor: 1 },
      { id: "g", label: "Gram", symbol: "g", factor: 0.001 },
      { id: "mg", label: "Milligram", symbol: "mg", factor: 0.000001 },
      { id: "lb", label: "Pound", symbol: "lb", factor: 0.45359237 },
      { id: "oz", label: "Ounce", symbol: "oz", factor: 0.028349523125 },
      { id: "st", label: "Stone", symbol: "st", factor: 6.35029318 },
      { id: "uston", label: "US ton (short)", symbol: "ton", factor: 907.18474 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    base: "celsius",
    units: [
      { id: "c", label: "Celsius", symbol: "°C" },
      { id: "f", label: "Fahrenheit", symbol: "°F" },
      { id: "k", label: "Kelvin", symbol: "K" },
    ],
  },
  {
    id: "area",
    label: "Area",
    base: "square meter",
    units: [
      { id: "km2", label: "Square kilometer", symbol: "km²", factor: 1_000_000 },
      { id: "ha", label: "Hectare", symbol: "ha", factor: 10_000 },
      { id: "m2", label: "Square meter", symbol: "m²", factor: 1 },
      { id: "cm2", label: "Square centimeter", symbol: "cm²", factor: 0.0001 },
      { id: "mi2", label: "Square mile", symbol: "mi²", factor: 2_589_988.110336 },
      { id: "ac", label: "Acre", symbol: "ac", factor: 4046.8564224 },
      { id: "yd2", label: "Square yard", symbol: "yd²", factor: 0.83612736 },
      { id: "ft2", label: "Square foot", symbol: "ft²", factor: 0.09290304 },
      { id: "in2", label: "Square inch", symbol: "in²", factor: 0.00064516 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    base: "liter",
    units: [
      { id: "m3", label: "Cubic meter", symbol: "m³", factor: 1000 },
      { id: "l", label: "Liter", symbol: "L", factor: 1 },
      { id: "ml", label: "Milliliter", symbol: "mL", factor: 0.001 },
      { id: "gal", label: "US gallon", symbol: "gal", factor: 3.785411784 },
      { id: "qt", label: "US quart", symbol: "qt", factor: 0.946352946 },
      { id: "pt", label: "US pint", symbol: "pt", factor: 0.473176473 },
      { id: "cup", label: "US cup", symbol: "cup", factor: 0.2365882365 },
      { id: "floz", label: "US fluid ounce", symbol: "fl oz", factor: 0.0295735295625 },
      { id: "imp gal", label: "Imperial gallon", symbol: "imp gal", factor: 4.54609 },
      { id: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", factor: 0.01478676478125 },
      { id: "tsp", label: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892159375 },
    ],
  },
  {
    id: "time",
    label: "Time",
    base: "second",
    units: [
      { id: "wk", label: "Week", symbol: "wk", factor: 604800 },
      { id: "d", label: "Day", symbol: "d", factor: 86400 },
      { id: "h", label: "Hour", symbol: "h", factor: 3600 },
      { id: "min", label: "Minute", symbol: "min", factor: 60 },
      { id: "s", label: "Second", symbol: "s", factor: 1 },
      { id: "ms", label: "Millisecond", symbol: "ms", factor: 0.001 },
      { id: "mo", label: "Month (avg.)", symbol: "mo", factor: 2_629_746 },
      { id: "yr", label: "Year (Gregorian avg.)", symbol: "yr", factor: 31_556_952 },
    ],
  },
];

export function getCategories(): CategoryDef[] {
  return UNIT_CATEGORIES;
}

export function getUnits(category: UnitCategory): UnitDef[] {
  return UNIT_CATEGORIES.find((item) => item.id === category)?.units ?? [];
}

export function getUnit(category: UnitCategory, id: string): UnitDef | undefined {
  return getUnits(category).find((unit) => unit.id === id);
}

// --- Temperature (exact affine conversions via Celsius as the base) ---

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}
export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}
export function celsiusToKelvin(c: number): number {
  return c + 273.15;
}
export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

function temperatureToCelsius(value: number, unit: string): number {
  if (unit === "f") return fahrenheitToCelsius(value);
  if (unit === "k") return kelvinToCelsius(value);
  return value; // Celsius
}

function celsiusToUnit(celsius: number, unit: string): number {
  if (unit === "f") return celsiusToFahrenheit(celsius);
  if (unit === "k") return celsiusToKelvin(celsius);
  return celsius;
}

/** Convert a numeric value from one unit to another inside a category. */
export function convertUnit(
  category: UnitCategory,
  value: number,
  fromId: string,
  toId: string,
): number {
  if (!Number.isFinite(value)) return Number.NaN;
  if (fromId === toId) return value;

  if (category === "temperature") {
    return celsiusToUnit(temperatureToCelsius(value, fromId), toId);
  }

  const from = getUnit(category, fromId);
  const to = getUnit(category, toId);
  if (!from || !to || from.factor === undefined || to.factor === undefined) {
    return Number.NaN;
  }
  const baseValue = value * from.factor;
  return baseValue / to.factor;
}

/** Clean floating-point noise (e.g. 0.30000000000000004) for display. */
export function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  return String(Number(value.toPrecision(12)));
}
