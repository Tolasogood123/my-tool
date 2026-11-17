/** Pure helper for writing numbers out in English words. */

const ONES: readonly string[] = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];

const TENS: readonly string[] = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

const SCALES: readonly string[] = [
  "", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion",
  "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion",
  "duodecillion", "tredecillion", "quattuordecillion", "quindecillion",
  "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion",
];

function spellBelowThousand(value: number): string {
  if (value < 20) return ONES[value];
  if (value < 100) {
    const tens = TENS[Math.floor(value / 10)];
    const rest = value % 10;
    return rest > 0 ? `${tens}-${ONES[rest]}` : tens;
  }
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  const head = `${ONES[hundreds]} hundred`;
  return rest > 0 ? `${head} ${spellBelowThousand(rest)}` : head;
}

/** Converts a bare integer string into words without losing precision. */
function spellInteger(integer: string): string {
  if (/^0+$/.test(integer)) return "zero";

  const padded = integer.padStart(Math.ceil(integer.length / 3) * 3, "0");
  const groups: number[] = [];
  for (let i = 0; i < padded.length; i += 3) {
    groups.push(Number.parseInt(padded.slice(i, i + 3), 10));
  }

  const words: string[] = [];
  groups.forEach((group, index) => {
    if (group === 0) return;
    const scaleIndex = groups.length - 1 - index;
    let phrase = spellBelowThousand(group);
    if (scaleIndex > 0 && scaleIndex < SCALES.length) {
      phrase += ` ${SCALES[scaleIndex]}`;
    } else if (scaleIndex >= SCALES.length) {
      phrase += ` times ten to the power of ${(scaleIndex * 3).toString()}`;
    }
    words.push(phrase);
  });

  return words.join(" ");
}

export interface NumberToWordsResult {
  words: string;
  error: string | null;
}

/**
 * Writes an integer or decimal number in English words. Accepts a sign, an
 * integer part, and an optional fractional part (spoken digit by digit).
 * Processing the value as text avoids floating-point precision loss.
 */
export function numberToWords(raw: string | number): NumberToWordsResult {
  const value = String(raw).trim();
  if (!value) {
    return { words: "", error: null };
  }
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return {
      words: "",
      error: "Enter a plain number such as 1234, -25, or 12.05. Commas and scientific notation are not supported.",
    };
  }

  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [integerPart, fractionPart] = unsigned.split(".");

  const isZeroInteger = /^0+$/.test(integerPart);
  const hasFraction = fractionPart !== undefined;
  const pieces: string[] = [];
  if (negative && (!isZeroInteger || hasFraction)) pieces.push("minus");

  if (fractionPart !== undefined) {
    pieces.push(spellInteger(integerPart));
    pieces.push("point");
    for (const digit of fractionPart) pieces.push(ONES[Number(digit)]);
  } else {
    pieces.push(spellInteger(integerPart));
  }

  return { words: pieces.join(" "), error: null };
}
