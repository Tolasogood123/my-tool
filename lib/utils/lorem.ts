/** Original client-side Lorem Ipsum generator. No server or API required. */

export type LoremMode = "paragraphs" | "sentences" | "words";

export const LOREM_CLASSIC =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "dolor", "reprehenderit", "in", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur",
  "pretium", "tincidunt", "nunc", "a", "nisl", "vestibulum", "cursus", "lectus",
  "integer", "posuere", "metus", "vitae", "tempus", "vivamus", "sagittis", "orci",
  "eget", "feugiat", "nullam", "viverra", "sapien", "nec", "sagittis", "mauris",
];

const LIMITS: Record<LoremMode, number> = {
  paragraphs: 100,
  sentences: 500,
  words: 2000,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord(): string {
  return WORDS[randomInt(0, WORDS.length - 1)];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A single generated sentence with natural-ish length and a trailing period. */
export function makeSentence(): string {
  const count = randomInt(6, 16);
  const pieces: string[] = [];
  for (let i = 0; i < count; i += 1) pieces.push(randomWord());
  return `${capitalize(pieces.join(" "))}.`;
}

export function generateWords(count: number): string {
  const safe = Math.max(1, Math.min(LIMITS.words, Math.floor(count) || 1));
  const pieces: string[] = [];
  for (let i = 0; i < safe; i += 1) pieces.push(randomWord());
  return pieces.join(" ");
}

export function generateSentences(count: number, startWithClassic = false): string {
  const safe = Math.max(1, Math.min(LIMITS.sentences, Math.floor(count) || 1));
  const pieces: string[] = [];
  if (startWithClassic) pieces.push(LOREM_CLASSIC);
  const remaining = Math.max(0, safe - pieces.length);
  for (let i = 0; i < remaining; i += 1) pieces.push(makeSentence());
  return pieces.join(" ");
}

export function generateParagraphs(count: number, startWithClassic = false): string {
  const safe = Math.max(1, Math.min(LIMITS.paragraphs, Math.floor(count) || 1));
  const paragraphs: string[] = [];
  for (let p = 0; p < safe; p += 1) {
    const sentenceCount = randomInt(4, 7);
    if (startWithClassic && p === 0) {
      paragraphs.push(LOREM_CLASSIC);
      continue;
    }
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i += 1) sentences.push(makeSentence());
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}

export function generateLorem(
  mode: LoremMode,
  count: number,
  startWithClassic = false,
): string {
  if (mode === "words") return generateWords(count);
  if (mode === "sentences") return generateSentences(count, startWithClassic);
  return generateParagraphs(count, startWithClassic);
}

/** Rough word count so the UI can report how much text was produced. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
