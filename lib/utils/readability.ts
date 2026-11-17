/** Pure English readability heuristics (Flesch Reading Ease and grade level). */

export interface ReadabilityResult {
  words: number;
  sentences: number;
  syllables: number;
  score: number;
  grade: number;
  label: string;
  advice: string;
}

/** Heuristic syllable count for English words. Not accurate for other scripts. */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  const trimmed = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function labelFor(score: number): { label: string; advice: string } {
  if (score >= 90) return { label: "Very easy", advice: "Suitable for very young readers." };
  if (score >= 80) return { label: "Easy", advice: "Clear for most readers." };
  if (score >= 70) return { label: "Fairly easy", advice: "Good for general audience writing." };
  if (score >= 60) return { label: "Standard", advice: "Typical adult reading level." };
  if (score >= 50) return { label: "Fairly difficult", advice: "Consider shorter sentences and simpler words." };
  if (score >= 30) return { label: "Difficult", advice: "Split long sentences and replace complex terms." };
  return { label: "Very difficult", advice: "Simplify substantially for a general audience." };
}

export function analyzeReadability(text: string): {
  result: ReadabilityResult | null;
  error: string | null;
} {
  if (!text.trim()) return { result: null, error: "Paste some text to analyze." };

  const words = text.trim().split(/\s+/).filter((word) => /[a-zA-Z]/.test(word));
  if (words.length === 0) {
    return {
      result: null,
      error: "No English words found. This tool uses English syllable heuristics.",
    };
  }

  const sentences = Math.max(
    1,
    text.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length,
  );
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const wordsPerSentence = words.length / sentences;
  const syllablesPerWord = syllables / words.length;

  const score = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const { label, advice } = labelFor(score);

  return {
    result: {
      words: words.length,
      sentences,
      syllables,
      score: Math.max(0, Math.min(100, score)),
      grade: Math.max(0, grade),
      label,
      advice,
    },
    error: null,
  };
}

export function formatReadabilityReport(result: ReadabilityResult): string {
  return [
    `Flesch Reading Ease: ${result.score.toFixed(1)} (${result.label})`,
    `Flesch-Kincaid grade: ${result.grade.toFixed(1)}`,
    `Words: ${result.words}`,
    `Sentences: ${result.sentences}`,
    `Syllables: ${result.syllables}`,
    `Tip: ${result.advice}`,
  ].join("\n");
}
