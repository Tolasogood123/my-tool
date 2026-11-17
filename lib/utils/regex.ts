/** Pure regex testing logic with safe match iteration. */

export interface RegexMatch {
  index: number;
  text: string;
  groups: string[];
  named: Record<string, string | undefined>;
  length: number;
}

export interface RegexResult {
  matches: RegexMatch[];
  count: number;
  truncated: boolean;
  durationMs: number;
}

export const MAX_PATTERN_CHARS = 500;
export const MAX_TEST_TEXT_CHARS = 20_000;
export const MAX_MATCHES = 200;

export function validateRegexInput(
  pattern: string,
  text: string,
): string | null {
  if (!pattern.trim()) return "Enter a pattern first. The pattern is empty.";
  if (pattern.length > MAX_PATTERN_CHARS) {
    return `The pattern must be ${MAX_PATTERN_CHARS} characters or fewer.`;
  }
  if (!text) return "Enter some text to test against.";
  if (text.length > MAX_TEST_TEXT_CHARS) {
    return `Test text must be ${MAX_TEST_TEXT_CHARS} characters or fewer.`;
  }
  return null;
}

/** Runs a user pattern and returns matches or a friendly error message. */
export function runRegex(
  pattern: string,
  flags: string,
  text: string,
): { result: RegexResult | null; error: string | null } {
  const validationError = validateRegexInput(pattern, text);
  if (validationError) return { result: null, error: validationError };

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (cause) {
    return {
      result: null,
      error: cause instanceof Error
        ? `Invalid pattern: ${cause.message}`
        : "Invalid regular expression.",
    };
  }

  const matches: RegexMatch[] = [];
  const started = performance.now();
  let truncated = false;

  try {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        text: match[0],
        length: match[0].length,
        groups: match.slice(1).map((value) => value ?? ""),
        named: Object.fromEntries(
          Object.entries(match.groups ?? {}).map(([key, value]) => [key, value]),
        ),
      });

      if (matches.length >= MAX_MATCHES) {
        truncated = true;
        break;
      }
      // Zero-length matches would otherwise loop forever with the g flag.
      if (match[0] === "") regex.lastIndex += 1;
      if (!regex.global && !regex.sticky) break;
    }
  } catch (cause) {
    return {
      result: null,
      error: cause instanceof Error ? cause.message : "The pattern could not be run.",
    };
  }

  return {
    result: {
      matches,
      count: matches.length,
      truncated,
      durationMs: Math.max(0, performance.now() - started),
    },
    error: null,
  };
}

export function formatRegexResult(
  result: RegexResult,
  pattern: string,
  flags: string,
): string {
  const header = `/${pattern}/${flags} — ${result.count} match${result.count === 1 ? "" : "es"}${
    result.truncated ? ` (first ${MAX_MATCHES} shown)` : ""
  }`;

  const rows = result.matches.map((match, index) => {
    const groups = [
      ...match.groups.map((value, groupIndex) => `  group ${groupIndex + 1}: ${value}`),
      ...Object.entries(match.named).map(([name, value]) => `  named ${name}: ${value ?? ""}`),
    ];
    return [`#${index + 1} at index ${match.index}: "${match.text}"`, ...groups].join("\n");
  });

  return [header, ...rows].join("\n");
}
