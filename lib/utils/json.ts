export interface JsonErrorInfo {
  message: string;
  line: number;
  column: number;
  position: number;
}

/** Parses JSON and converts parser messages into a readable line/column error. */
export function parseJson(input: string): {
  value: unknown;
  error: JsonErrorInfo | null;
} {
  try {
    return { value: JSON.parse(input), error: null };
  } catch (cause) {
    const raw = cause instanceof Error ? cause.message : "Invalid JSON";
    const match = raw.match(/position\s+(\d+)/i);
    const position = match ? Number(match[1]) : 0;
    const before = input.slice(0, position);
    const lines = before.split("\n");

    return {
      value: undefined,
      error: {
        message: raw,
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
        position,
      },
    };
  }
}

export interface JsonStats {
  keys: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  arrays: number;
  maxDepth: number;
  duplicates: string[];
}

/** Computes simple structural statistics without mutating the parsed value. */
export function getJsonStats(value: unknown): JsonStats {
  const stats: JsonStats = {
    keys: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    arrays: 0,
    maxDepth: 0,
    duplicates: [],
  };

  const walk = (node: unknown, depth: number, path: string) => {
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    if (Array.isArray(node)) {
      stats.arrays += 1;
      node.forEach((item, index) => walk(item, depth + 1, `${path}[${index}]`));
      return;
    }

    if (node !== null && typeof node === "object") {
      const seen = new Set<string>();
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        stats.keys += 1;
        if (seen.has(key)) {
          stats.duplicates.push(`${path || "root"}.${key}`);
        }
        seen.add(key);
        walk(child, depth + 1, `${path}.${key}`);
      }
      return;
    }

    if (typeof node === "string") stats.strings += 1;
    else if (typeof node === "number") stats.numbers += 1;
    else if (typeof node === "boolean") stats.booleans += 1;
    else if (node === null) stats.nulls += 1;
  };

  walk(value, 0, "");
  return stats;
}
