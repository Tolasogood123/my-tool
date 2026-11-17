import type { Tool } from "@/types/tool";

/** Stage 3, Round 1 tools: text comparison, regex testing and timestamps. */
export const stage3Round1Tools: Tool[] = [
  {
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    description:
      "Compare two pieces of text line by line in your browser. See additions, removals and unchanged lines with line numbers, then copy or download the diff.",
    category: "developer",
    keywords: ["text diff checker", "compare text online", "line diff", "text comparison", "diff tool"],
    icon: "FileDiff",
    status: "ready",
    popularity: 81,
    addedAt: "2026-11-17",
    related: ["word-counter", "text-case-converter", "markdown-editor"],
    content: {
      what: "The Text Diff Checker compares two texts with a longest-common-subsequence algorithm and shows exactly which lines were added, removed, or left unchanged. Each row includes its original and changed line numbers, and the result can be copied as a plain unified diff or downloaded as a text file. All comparison happens on your device.",
      howTo: [
        "Paste the original text into the left box and the edited text into the right box.",
        "Click Compare text. The diff appears below with + for additions and − for removals.",
        "Check the added, removed, and unchanged counts at the top of the result.",
        "Copy the diff into a code review or download it as a .txt file.",
      ],
      example:
        "Original: 'hello / world'. Changed: 'hello / there / world'. The result shows 'hello' unchanged, '+ there' added, and 'world' unchanged, with 1 added and 0 removed lines.",
      benefits: [
        "Spot small edits that are easy to miss when reading two texts side by side.",
        "Line numbers make it simple to refer to a specific change in a review.",
        "Plain-text output works in issues, chat, and code review tools.",
        "No upload: private drafts and code stay in your browser.",
      ],
      faqs: [
        {
          q: "How does it decide what changed?",
          a: "It uses a longest-common-subsequence algorithm on whole lines. Identical lines are matched first, then remaining lines are shown as additions or removals in order.",
        },
        {
          q: "Can it compare whole documents?",
          a: "Each side is limited to 500 lines so the comparison stays fast and memory-safe in the browser. Split a very large document into sections before comparing.",
        },
        {
          q: "Does it compare word by word?",
          a: "No, it compares lines. A line with one changed word is reported as one removed line and one added line, which is the behavior developers expect from a standard diff.",
        },
        {
          q: "Are my texts uploaded anywhere?",
          a: "No. The comparison runs entirely in JavaScript in your browser, and nothing is sent to a server.",
        },
      ],
    },
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions live in your browser. Check matches, indices and capture groups, toggle common flags, and copy or download the results instantly.",
    category: "developer",
    keywords: ["regex tester", "regular expression tester", "regex checker", "regex matcher", "test regex online"],
    icon: "Regex",
    status: "ready",
    popularity: 83,
    addedAt: "2026-11-17",
    related: ["json-validator", "text-diff-checker", "word-counter"],
    content: {
      what: "The Regex Tester runs your pattern against sample text and lists every match with its position, length, numbered groups, and named groups. You can toggle the g, i, m, s, and u flags, and invalid patterns produce a readable error instead of an empty screen. All matching happens locally in your browser.",
      howTo: [
        "Type a regular expression into the pattern field, without the surrounding slashes.",
        "Select the flags you need, such as g to find all matches or i to ignore case.",
        "Paste the text you want to test and click Test regex.",
        "Review the match list, then copy or download the results.",
      ],
      example:
        "Pattern ([a-z]+)-(\\d+) with the g flag on 'ab-12 cd-34' finds two matches: 'ab-12' with groups ['ab','12'] and 'cd-34' with groups ['cd','34'].",
      benefits: [
        "Debug a pattern before putting it into code or a configuration file.",
        "Capture groups and named groups are shown for each match.",
        "Invalid patterns return a clear error message immediately.",
        "Nothing is uploaded, so logs and sample data stay private.",
      ],
      faqs: [
        {
          q: "Do I need to type the surrounding slashes?",
          a: "No. Enter only the pattern body. For example, use \\d+ rather than /\\d+/g, and select the g flag separately.",
        },
        {
          q: "Why is my pattern matching zero-length strings?",
          a: "Anchors like ^ and $ can match an empty position. The tester advances past zero-length matches so it cannot loop forever, and it reports each one with its index.",
        },
        {
          q: "Is there a limit on matches?",
          a: "Yes. The tester stops after 200 matches and tells you that the list was truncated. Narrow the pattern or shorten the text to see the rest.",
        },
        {
          q: "Can a slow pattern freeze my browser?",
          a: "Patterns with nested quantifiers can be slow. Input is capped at 20,000 characters and 500 pattern characters to reduce the risk. For production regexes, still test with representative data before deploying.",
        },
      ],
    },
  },
  {
    slug: "unix-timestamp-converter",
    title: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps in seconds or milliseconds to readable dates, or dates back to timestamps. See ISO, UTC, local time and relative time instantly.",
    category: "developer",
    keywords: ["unix timestamp converter", "epoch time converter", "timestamp to date", "date to epoch", "unix time"],
    icon: "Clock3",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-17",
    related: ["days-between-dates", "age-calculator", "simple-interest-calculator"],
    content: {
      what: "The Unix Timestamp Converter translates between epoch values and human-readable dates. It accepts seconds or milliseconds, including negative values for dates before 1970, and shows the ISO 8601 string, UTC and local representations, plus how far the date is from today. The reverse mode turns a date and time into both seconds and milliseconds.",
      howTo: [
        "Choose Timestamp → date to decode a number, or Date → timestamp to encode one.",
        "Enter the timestamp and pick seconds or milliseconds, or select a date and time.",
        "Click Convert to see the full result.",
        "Copy or download the report with every representation included.",
      ],
      example:
        "The timestamp 1700000000 seconds converts to 2023-11-14T22:13:20.000Z. A timestamp of 0 converts to 1970-01-01T00:00:00.000Z, and -1 converts to 1969-12-31T23:59:59.000Z.",
      benefits: [
        "Debug API responses and log entries that use epoch timestamps.",
        "See seconds and milliseconds side by side to avoid unit mistakes.",
        "Handles dates before 1970 and far-future dates within JavaScript's range.",
        "Runs in the browser with no server and no stored data.",
      ],
      faqs: [
        {
          q: "What is a Unix timestamp?",
          a: "It is the number of seconds elapsed since 1 January 1970 00:00:00 UTC, ignoring leap seconds. Milliseconds use the same epoch but count thousandths of a second.",
        },
        {
          q: "How do I know if I have seconds or milliseconds?",
          a: "Current timestamps in seconds have about 10 digits, while milliseconds have about 13. You can switch units in the tool and compare the resulting date.",
        },
        {
          q: "Why does the local time differ from UTC?",
          a: "The UTC value is the same everywhere. The local value follows your device's time zone setting, which is why two people can see different local times for the same timestamp.",
        },
        {
          q: "What happens with very large numbers?",
          a: "JavaScript dates support roughly ±8.64 × 10^15 milliseconds, about 275,760 years from the epoch. Larger values produce a clear range error instead of an invalid date.",
        },
      ],
    },
  },
];
