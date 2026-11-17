/**
 * Pure, dependency-free barcode encoders.
 *
 * Implements:
 *  - Code 128 (Code Set B for printable ASCII, Code Set C for all-digit pairs)
 *  - EAN-13 (including check-digit computation and validation)
 *
 * Both encoders return a module pattern string ("1" = bar, "0" = space) that
 * the UI draws to canvas (PNG preview) or serializes to SVG. No external
 * barcode library is used.
 */

export type BarcodeSymbology = "CODE128" | "EAN13";

export interface BarcodeResult {
  pattern: string;
  displayText: string;
  symbology: BarcodeSymbology;
  modules: number;
}

/* ------------------------------------------------------------------ */
/* Code 128                                                            */
/* ------------------------------------------------------------------ */

/**
 * Code 128 bar/space widths for symbol values 0..106. Each entry alternates
 * bar, space, bar, space, bar, space (the stop symbol has seven elements).
 * Every non-stop pattern is 11 modules wide; the stop pattern is 13.
 */
const CODE128_PATTERNS: readonly string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213",
  "122312", "132212", "221213", "221312", "231212", "112232", "122132",
  "122231", "113222", "123122", "123221", "223211", "221132", "221231",
  "213212", "223112", "312131", "311222", "321122", "321221", "312212",
  "322112", "322211", "212123", "212321", "232121", "111323", "131123",
  "131321", "112313", "132113", "132311", "211313", "231113", "231311",
  "112133", "112331", "132131", "113123", "113321", "133121", "313121",
  "211331", "231131", "213113", "213311", "213131", "311123", "311321",
  "331121", "312113", "312311", "332111", "314111", "221411", "431111",
  "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114",
  "413111", "241112", "134111", "111242", "121142", "121241", "114212",
  "124112", "124211", "411212", "421112", "421211", "212141", "214121",
  "412121", "111143", "111341", "131141", "114113", "114311", "411113",
  "411311", "113141", "114131", "311141", "411131", "211412", "211214",
  "211232", "2331112",
];

const START_B = 104;
const START_C = 105;
const STOP = 106;

/** Expands a run-length pattern ("212222") into a module string ("110110..."). */
function widthsToModules(widths: string): string {
  let modules = "";
  let bar = true;
  for (const digit of widths) {
    const count = Number(digit);
    modules += (bar ? "1" : "0").repeat(count);
    bar = !bar;
  }
  return modules;
}

function valuesToPattern(values: number[]): string {
  return values.map((value) => widthsToModules(CODE128_PATTERNS[value])).join("");
}

export interface Code128Result extends BarcodeResult {
  codeSet: "B" | "C";
  checksum: number;
}

/**
 * Encodes a value as Code 128.
 *  - An even-length run of digits uses Code Set C (one symbol per digit pair).
 *  - Everything else uses Code Set B, which covers printable ASCII 32..126.
 */
export function encodeCode128(text: string): Code128Result {
  const value = text.trim();
  if (!value) throw new Error("Enter a value to encode.");

  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 32 || code > 126) {
      throw new Error("Code 128 here supports printable ASCII characters only (spaces through ~).");
    }
  }

  let codeSet: "B" | "C";
  let data: number[];

  if (/^\d+$/.test(value) && value.length >= 2 && value.length % 2 === 0) {
    codeSet = "C";
    data = [];
    for (let index = 0; index < value.length; index += 2) {
      data.push(Number(value.slice(index, index + 2)));
    }
  } else {
    codeSet = "B";
    data = Array.from(value, (char) => char.charCodeAt(0) - 32);
  }

  const start = codeSet === "C" ? START_C : START_B;
  let weighted = start;
  data.forEach((symbol, index) => {
    weighted += symbol * (index + 1);
  });
  const checksum = weighted % 103;
  const pattern = valuesToPattern([start, ...data, checksum, STOP]);

  return {
    pattern,
    displayText: value,
    symbology: "CODE128",
    modules: pattern.length,
    codeSet,
    checksum,
  };
}

/* ------------------------------------------------------------------ */
/* EAN-13                                                              */
/* ------------------------------------------------------------------ */

const EAN13_PARITY: readonly string[] = [
  "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
  "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL",
];

const EAN13_L: readonly string[] = [
  "0001101", "0011001", "0010011", "0111101", "0100011",
  "0110001", "0101111", "0111011", "0110111", "0001011",
];

const EAN13_G: readonly string[] = [
  "0100111", "0110011", "0011011", "0100001", "0011101",
  "0111001", "0000101", "0010001", "0001001", "0010111",
];

const EAN13_R: readonly string[] = [
  "1110010", "1100110", "1101100", "1000010", "1011100",
  "1001110", "1010000", "1000100", "1001000", "1110100",
];

const EAN13_START = "101";
const EAN13_CENTER = "01010";
const EAN13_END = "101";

/** Removes spaces and hyphens so users can paste formatted numbers. */
export function normalizeEan13(input: string): string {
  return input.replace(/[\s-]/g, "");
}

/** Computes the EAN-13 check digit for a 12-digit base, or null if invalid. */
export function computeEan13CheckDigit(base12: string): number | null {
  if (!/^\d{12}$/.test(base12)) return null;
  let sum = 0;
  for (let index = 0; index < 12; index += 1) {
    const digit = Number(base12[index]);
    sum += digit * (index % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

/** Returns true when a 13-digit value has a correct EAN-13 check digit. */
export function validateEan13(input: string): boolean {
  const code = normalizeEan13(input);
  if (!/^\d{13}$/.test(code)) return false;
  return computeEan13CheckDigit(code.slice(0, 12)) === Number(code[12]);
}

/** Encodes a validated EAN-13 number into its 95-module pattern. */
export function encodeEan13(input: string): BarcodeResult {
  const code = normalizeEan13(input);
  if (!/^\d{13}$/.test(code)) {
    throw new Error("EAN-13 needs exactly 13 digits (spaces and hyphens are ignored).");
  }
  if (!validateEan13(code)) {
    const expected = computeEan13CheckDigit(code.slice(0, 12));
    throw new Error(`Check digit is invalid. For ${code.slice(0, 12)} the check digit should be ${expected}.`);
  }

  const parity = EAN13_PARITY[Number(code[0])];
  let pattern = EAN13_START;

  for (let index = 0; index < 6; index += 1) {
    const digit = Number(code[index + 1]);
    pattern += parity[index] === "L" ? EAN13_L[digit] : EAN13_G[digit];
  }

  pattern += EAN13_CENTER;

  for (let index = 0; index < 6; index += 1) {
    const digit = Number(code[index + 7]);
    pattern += EAN13_R[digit];
  }

  pattern += EAN13_END;

  return {
    pattern,
    displayText: code,
    symbology: "EAN13",
    modules: pattern.length,
  };
}

/* ------------------------------------------------------------------ */
/* Shared rendering helpers                                            */
/* ------------------------------------------------------------------ */

export interface BarRun {
  bar: boolean;
  count: number;
}

/** Groups a module string into alternating bar/space runs. */
export function patternToRuns(pattern: string): BarRun[] {
  const runs: BarRun[] = [];
  if (!pattern) return runs;
  let current = pattern[0] === "1";
  let count = 0;
  for (const moduleChar of pattern) {
    const isBar = moduleChar === "1";
    if (isBar === current) {
      count += 1;
    } else {
      runs.push({ bar: current, count });
      current = isBar;
      count = 1;
    }
  }
  runs.push({ bar: current, count });
  return runs;
}

export interface BarcodeSvgOptions {
  moduleWidth?: number;
  height?: number;
  foreground?: string;
  background?: string;
  showText?: boolean;
  quietZoneModules?: number;
  fontSize?: number;
}

/** Builds a standalone SVG string for the encoded barcode. */
export function barcodeToSvg(result: BarcodeResult, options: BarcodeSvgOptions = {}): string {
  const moduleWidth = Math.max(1, Math.floor(options.moduleWidth ?? 2));
  const barHeight = Math.max(10, Math.floor(options.height ?? 100));
  const foreground = options.foreground ?? "#0f172a";
  const background = options.background ?? "#ffffff";
  const showText = options.showText ?? true;
  const quiet = Math.max(0, Math.floor(options.quietZoneModules ?? 10));
  const fontSize = Math.max(6, Math.floor(options.fontSize ?? 14));
  const textArea = showText ? fontSize + 14 : 0;

  const totalModules = result.modules + quiet * 2;
  const width = totalModules * moduleWidth;
  const height = barHeight + textArea;

  let moduleOffset = 0;
  const bars = patternToRuns(result.pattern)
    .map((run) => {
      const x = (quiet + moduleOffset) * moduleWidth;
      moduleOffset += run.count;
      if (!run.bar) return "";
      return `<rect x="${x}" y="0" width="${run.count * moduleWidth}" height="${barHeight}" fill="${foreground}"/>`;
    })
    .filter(Boolean)
    .join("");

  const label = showText
    ? `<text x="${(width / 2).toFixed(1)}" y="${barHeight + fontSize + 2}" font-family="monospace" font-size="${fontSize}" text-anchor="middle" fill="${foreground}">${escapeXml(result.displayText)}</text>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(result.symbology)} barcode">`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${background}"/>`,
    bars,
    label,
    "</svg>",
  ].join("");
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
