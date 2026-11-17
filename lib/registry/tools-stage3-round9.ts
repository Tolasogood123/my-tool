import type { Tool } from "@/types/tool";

/** Stage 3, Round 9: only Readability Score is new; the other two already exist. */
export const stage3Round9Tools: Tool[] = [
  {
    slug: "readability-score",
    title: "Readability Score",
    description:
      "Check how easy your English text is to read with Flesch Reading Ease and grade level scores. Get word, sentence and syllable counts plus practical advice.",
    category: "language-accessibility",
    keywords: ["readability score", "flesch reading ease", "grade level calculator", "text difficulty checker", "reading level tester"],
    icon: "BookOpen",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-21",
    related: ["word-counter", "keyword-density-checker", "ai-writing-assistant"],
    content: {
      what: "The Readability Score tool applies the Flesch Reading Ease and Flesch-Kincaid grade formulas to English text. It counts words, sentences and syllables, then suggests whether the text is easy or difficult for a general audience. The calculation runs live in your browser as you type.",
      howTo: [
        "Paste or type an English article or paragraph.",
        "Watch the reading ease score and grade level update.",
        "Check the word, sentence and syllable counts.",
        "Copy or download the short report for your notes.",
      ],
      example:
        "The sentence 'The cat sat on the mat. The dog ran fast.' contains 10 words and 10 syllables across 2 sentences, giving a very high ease score near 100.",
      benefits: [
        "Find sentences that are too long for your audience.",
        "Compare drafts against a target reading level.",
        "Transparent counts and formulas rather than a black-box score.",
        "No text is uploaded or stored.",
      ],
      faqs: [
        {
          q: "What does a high Flesch score mean?",
          a: "A higher score (roughly 90–100) means easier reading. Scores around 60 are typical for adult writing, and below 30 is very difficult.",
        },
        {
          q: "Does it work for Khmer or other languages?",
          a: "No. The syllable heuristic is English-only. Non-English text is rejected with a clear message; use the Word Counter for language-aware counting.",
        },
        {
          q: "Is the syllable count perfect?",
          a: "No. Syllables are estimated with a rule-based heuristic, so unusual words may be counted differently. Treat the score as a guideline, not an exact measurement.",
        },
        {
          q: "Does a good score mean good writing?",
          a: "Not necessarily. Readability measures sentence and word complexity, not accuracy, structure, or persuasiveness. Use it alongside your own editing.",
        },
      ],
    },
  },
];
