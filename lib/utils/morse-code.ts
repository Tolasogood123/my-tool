/** Pure helpers for translating between text and International Morse code. */

/** International Morse code for Latin letters, digits, and common punctuation. */
export const MORSE_MAP: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([char, code]) => [code, char]),
);

export interface MorseEncodeResult {
  morse: string;
  /** Uppercase characters that had no Morse representation and were skipped. */
  unsupported: string[];
}

/**
 * Encodes text as Morse. Spaces become " / " word separators, letters are
 * separated by single spaces, and unsupported characters are reported honestly
 * rather than silently invented. Morse has no representation for most Unicode.
 */
export function textToMorse(text: string): MorseEncodeResult {
  const unsupported = new Set<string>();
  const tokens: string[] = [];
  let pendingSpace = false;

  for (const char of text.toUpperCase()) {
    if (/\s/.test(char)) {
      if (tokens.length > 0) pendingSpace = true;
      continue;
    }
    const code = MORSE_MAP[char];
    if (!code) {
      unsupported.add(char);
      continue;
    }
    if (pendingSpace) {
      tokens.push("/");
      pendingSpace = false;
    }
    tokens.push(code);
  }

  return { morse: tokens.join(" "), unsupported: [...unsupported] };
}

export interface MorseDecodeResult {
  text: string;
  /** Morse tokens that did not match any known code. */
  unknown: string[];
}

/** Decodes Morse back to text. "/" separates words; "□" marks unknown codes. */
export function morseToText(morse: string): MorseDecodeResult {
  const tokens = morse.trim().split(/\s+/).filter(Boolean);
  const unknown = new Set<string>();
  let text = "";

  for (const token of tokens) {
    if (token === "/" || token === "|") {
      text += " ";
      continue;
    }
    const letter = REVERSE_MAP[token];
    if (letter) {
      text += letter;
    } else {
      unknown.add(token);
      text += "□";
    }
  }

  return { text: text.replace(/\s+/g, " ").trim(), unknown: [...unknown] };
}

export interface MorseEvent {
  type: "tone" | "gap";
  durationMs: number;
}

/**
 * Builds a timing timeline with standard Morse proportions: dot = 1 unit,
 * dash = 3 units, intra-character gap = 1, letter gap = 3, word gap = 7.
 */
export function morseToTimeline(morse: string, dotMs: number): MorseEvent[] {
  const unit = Math.max(20, dotMs);
  const tokens = morse.trim().split(/\s+/).filter(Boolean);
  const events: MorseEvent[] = [];

  tokens.forEach((token, index) => {
    if (token === "/" || token === "|") {
      events.push({ type: "gap", durationMs: unit * 7 });
      return;
    }
    const symbols = token.split("");
    symbols.forEach((symbol, symbolIndex) => {
      if (symbolIndex > 0) events.push({ type: "gap", durationMs: unit });
      events.push({ type: "tone", durationMs: symbol === "-" ? unit * 3 : unit });
    });
    const next = tokens[index + 1];
    if (next && next !== "/" && next !== "|") {
      events.push({ type: "gap", durationMs: unit * 3 });
    }
  });

  return events;
}
