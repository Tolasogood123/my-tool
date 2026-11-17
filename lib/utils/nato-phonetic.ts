/** Pure helpers for the NATO phonetic (ICAO) spelling alphabet. */

export interface NatoEntry {
  letter: string;
  word: string;
}

/** The 26 code words of the international NATO / ICAO spelling alphabet. */
export const NATO_ALPHABET: readonly NatoEntry[] = [
  { letter: "A", word: "Alfa" },
  { letter: "B", word: "Bravo" },
  { letter: "C", word: "Charlie" },
  { letter: "D", word: "Delta" },
  { letter: "E", word: "Echo" },
  { letter: "F", word: "Foxtrot" },
  { letter: "G", word: "Golf" },
  { letter: "H", word: "Hotel" },
  { letter: "I", word: "India" },
  { letter: "J", word: "Juliett" },
  { letter: "K", word: "Kilo" },
  { letter: "L", word: "Lima" },
  { letter: "M", word: "Mike" },
  { letter: "N", word: "November" },
  { letter: "O", word: "Oscar" },
  { letter: "P", word: "Papa" },
  { letter: "Q", word: "Quebec" },
  { letter: "R", word: "Romeo" },
  { letter: "S", word: "Sierra" },
  { letter: "T", word: "Tango" },
  { letter: "U", word: "Uniform" },
  { letter: "V", word: "Victor" },
  { letter: "W", word: "Whiskey" },
  { letter: "X", word: "X-ray" },
  { letter: "Y", word: "Yankee" },
  { letter: "Z", word: "Zulu" },
];

const LOOKUP: Record<string, string> = Object.fromEntries(
  NATO_ALPHABET.map((entry) => [entry.letter, entry.word]),
);

/**
 * Converts letters in a string to their NATO words. Non-letter characters
 * (spaces, digits, punctuation) are passed through unchanged, because the
 * standard alphabet only defines words for A-Z.
 */
export function textToNato(text: string): string {
  let out = "";
  for (const char of text) {
    const upper = char.toUpperCase();
    if (LOOKUP[upper]) {
      out += `${LOOKUP[upper]} `;
    } else if (/\s/.test(char)) {
      out += " ";
    } else {
      out += char;
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

/** Counts the A-Z letters that will be converted in a string. */
export function countLetters(text: string): number {
  let count = 0;
  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) count += 1;
  }
  return count;
}
