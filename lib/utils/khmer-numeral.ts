/** Pure helpers for converting between ASCII and Khmer numeral digits. */

/**
 * The only mapping used here is the ten modern Khmer digits (U+17E0–U+17E9).
 * No claims are made about legacy or unassigned Unicode Khmer digit code points;
 * those are intentionally left untouched.
 */
export const ASCII_TO_KHMER: Record<string, string> = {
  "0": "០",
  "1": "១",
  "2": "២",
  "3": "៣",
  "4": "៤",
  "5": "៥",
  "6": "៦",
  "7": "៧",
  "8": "៨",
  "9": "៩",
};

export const KHMER_TO_ASCII: Record<string, string> = Object.fromEntries(
  Object.entries(ASCII_TO_KHMER).map(([ascii, khmer]) => [khmer, ascii]),
);

/** Replaces each ASCII digit with its Khmer counterpart; other characters pass through. */
export function asciiToKhmer(input: string): string {
  return input.replace(/[0-9]/g, (digit) => ASCII_TO_KHMER[digit]);
}

/** Replaces each modern Khmer digit with its ASCII counterpart; others pass through. */
export function khmerToAscii(input: string): string {
  return input.replace(/[០-៩]/g, (digit) => KHMER_TO_ASCII[digit] ?? digit);
}

/** True when the string contains at least one modern Khmer digit. */
export function containsKhmerDigits(input: string): boolean {
  return /[០-៩]/.test(input);
}
