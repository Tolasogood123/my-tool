/** Linear and quadratic equation solving with human-readable working steps. */

export type EquationKind = "linear" | "quadratic";

export interface SolveResult {
  roots: number[];
  discriminant: number | null;
  steps: string[];
  summary: string;
  nature: string;
  complex: string | null;
}

export interface EquationSolution {
  result: SolveResult | null;
  error: string | null;
}

/** Rounds a number for display while dropping trailing zeroes. */
export function formatNumber(value: number, decimals = 6): string {
  if (!Number.isFinite(value)) return String(value);
  const fixed = value.toFixed(decimals);
  const trimmed = fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
  if (trimmed === "" || trimmed === "-0") return "0";
  return trimmed;
}

/** Builds a readable equation such as "3x² + 4x − 5 = 0". */
export function formatEquation(kind: EquationKind, a: number, b: number, c = 0): string {
  const f = (value: number) => formatNumber(value);
  const term = (coefficient: number, variable: string, first: boolean): string => {
    if (coefficient === 0) return "";
    const magnitude = Math.abs(coefficient);
    const sign = coefficient < 0 ? "−" : first ? "" : "+";
    const body = magnitude === 1 && variable ? variable : `${f(magnitude)}${variable}`;
    return `${sign}${sign && !first ? " " : ""}${body}`;
  };

  const parts: string[] = [];
  if (kind === "quadratic") {
    const quadratic = term(a, "x²", true);
    if (quadratic) parts.push(quadratic);
    const linear = term(b, "x", parts.length === 0);
    if (linear) parts.push(linear);
    const constant = term(c, "", parts.length === 0);
    if (constant) parts.push(constant.trim());
  } else {
    const linear = term(a, "x", true);
    if (linear) parts.push(linear);
    const constant = term(b, "", parts.length === 0);
    if (constant) parts.push(constant.trim());
  }

  if (parts.length === 0) parts.push("0");
  return `${parts.join(" ")} = 0`;
}

function finite(...values: number[]): boolean {
  return values.every((value) => Number.isFinite(value));
}

function solveLinear(a: number, b: number, note?: string): EquationSolution {
  const f = (value: number) => formatNumber(value);
  const steps = note ? [note] : [];
  steps.push(`The equation is ${formatEquation("linear", a, b)}.`);

  if (a === 0 && b === 0) {
    steps.push("Both coefficients are zero, so the statement 0 = 0 is always true.");
    return {
      result: {
        roots: [],
        discriminant: null,
        steps,
        summary: "Infinitely many solutions — every value of x satisfies the equation.",
        nature: "Identity",
        complex: null,
      },
      error: null,
    };
  }
  if (a === 0) {
    steps.push(`This reduces to ${f(b)} = 0, which is false.`);
    return {
      result: {
        roots: [],
        discriminant: null,
        steps,
        summary: "No solution — the equation is inconsistent.",
        nature: "No solution",
        complex: null,
      },
      error: null,
    };
  }

  steps.push(`Subtract ${f(b)} from both sides: ${f(a)}x = ${f(-b)}.`);
  steps.push(`Divide by ${f(a)}: x = ${f(-b)} ÷ ${f(a)}.`);
  const root = -b / a;
  steps.push(`x = ${f(root)}.`);
  return {
    result: {
      roots: [root],
      discriminant: null,
      steps,
      summary: `One real solution: x = ${f(root)}.`,
      nature: "One real root",
      complex: null,
    },
    error: null,
  };
}

export function solveEquation(
  kind: EquationKind,
  a: number,
  b: number,
  c = 0,
): EquationSolution {
  if (!finite(a, b, c)) {
    return { result: null, error: "All coefficients must be valid numbers." };
  }
  if (kind === "linear") return solveLinear(a, b);

  const f = (value: number) => formatNumber(value);

  if (a === 0) {
    return solveLinear(b, c, "The x² coefficient is zero, so this is really a linear equation.");
  }

  const discriminant = b * b - 4 * a * c;
  const steps: string[] = [
    `Identify a = ${f(a)}, b = ${f(b)}, c = ${f(c)}.`,
    `Discriminant: D = b² − 4ac = (${f(b)})² − 4(${f(a)})(${f(c)}) = ${f(discriminant)}.`,
  ];

  if (discriminant > 1e-12) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    steps.push("D > 0, so there are two distinct real roots.");
    steps.push(`Quadratic formula: x = (−b ± √D) ÷ (2a) = (${f(-b)} ± √${f(discriminant)}) ÷ ${f(2 * a)}.`);
    steps.push(`x₁ = ${f(root1)}.`);
    steps.push(`x₂ = ${f(root2)}.`);
    return {
      result: {
        roots: [root1, root2],
        discriminant,
        steps,
        summary: `Two real roots: x = ${f(root1)} and x = ${f(root2)}.`,
        nature: "Two distinct real roots",
        complex: null,
      },
      error: null,
    };
  }

  if (Math.abs(discriminant) <= 1e-12) {
    const root = -b / (2 * a);
    steps.push("D = 0, so the parabola touches the x-axis at one repeated root.");
    steps.push(`x = −b ÷ (2a) = ${f(-b)} ÷ ${f(2 * a)} = ${f(root)}.`);
    return {
      result: {
        roots: [root],
        discriminant: 0,
        steps,
        summary: `One repeated real root: x = ${f(root)}.`,
        nature: "One repeated real root",
        complex: null,
      },
      error: null,
    };
  }

  const real = -b / (2 * a);
  const imaginary = Math.sqrt(-discriminant) / Math.abs(2 * a);
  const complex = `x = ${f(real)} ± ${f(imaginary)}i`;
  steps.push("D < 0, so the equation has no real roots — the graph never crosses the x-axis.");
  steps.push(`Over the complex numbers the roots are ${complex}.`);
  return {
    result: {
      roots: [],
      discriminant,
      steps,
      summary: `No real roots (D = ${f(discriminant)} < 0). ${complex}.`,
      nature: "No real roots",
      complex,
    },
    error: null,
  };
}
