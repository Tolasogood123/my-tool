/** Pure line-based diff logic for the Text Diff Checker. */

export type DiffType = "equal" | "added" | "removed";

export interface DiffLine {
  type: DiffType;
  text: string;
  leftLine: number | null;
  rightLine: number | null;
}

export interface DiffResult {
  lines: DiffLine[];
  added: number;
  removed: number;
  unchanged: number;
  totalLines: number;
}

export const MAX_DIFF_LINES = 500;

function splitLines(value: string): string[] {
  const normalized = value.replace(/\r\n?/g, "\n");
  // A trailing newline does not create an extra meaningful line.
  if (normalized.endsWith("\n")) return normalized.slice(0, -1).split("\n");
  return normalized === "" ? [] : normalized.split("\n");
}

/** Returns an error message when either side is too large to diff safely. */
export function validateDiffInput(before: string, after: string): string | null {
  const left = splitLines(before);
  const right = splitLines(after);
  if (left.length > MAX_DIFF_LINES || right.length > MAX_DIFF_LINES) {
    return `Each side must be ${MAX_DIFF_LINES} lines or fewer. Split very large documents before comparing.`;
  }
  return null;
}

/**
 * Longest-Common-Subsequence line diff. For equal lines we advance both
 * sides, for removals only the left side, and for additions only the right.
 */
export function diffLines(before: string, after: string): DiffResult {
  const left = splitLines(before);
  const right = splitLines(after);
  const rows = left.length;
  const cols = right.length;

  // lcs[i][j] = LCS length of left.slice(i) and right.slice(j)
  const lcs: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );

  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      lcs[i][j] =
        left[i] === right[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < rows && j < cols) {
    if (left[i] === right[j]) {
      lines.push({ type: "equal", text: left[i], leftLine: i + 1, rightLine: j + 1 });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push({ type: "removed", text: left[i], leftLine: i + 1, rightLine: null });
      i += 1;
    } else {
      lines.push({ type: "added", text: right[j], leftLine: null, rightLine: j + 1 });
      j += 1;
    }
  }

  while (i < rows) {
    lines.push({ type: "removed", text: left[i], leftLine: i + 1, rightLine: null });
    i += 1;
  }
  while (j < cols) {
    lines.push({ type: "added", text: right[j], leftLine: null, rightLine: j + 1 });
    j += 1;
  }

  const added = lines.filter((line) => line.type === "added").length;
  const removed = lines.filter((line) => line.type === "removed").length;

  return {
    lines,
    added,
    removed,
    unchanged: lines.length - added - removed,
    totalLines: lines.length,
  };
}

/** Plain-text unified format, suitable for copying into code review or a file. */
export function formatUnifiedDiff(result: DiffResult): string {
  return result.lines
    .map((line) => {
      const marker = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${marker} ${line.text}`;
    })
    .join("\n");
}
