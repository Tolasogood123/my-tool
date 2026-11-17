/**
 * Safe, token-based SQL pretty printer. It scans the input character by
 * character (respecting strings, quoted identifiers and comments) instead of
 * doing blind regular-expression replacement, so literals are never rewritten.
 */

export type KeywordCase = "upper" | "lower" | "preserve";

export interface SqlFormatOptions {
  keywordCase?: KeywordCase;
  indentSize?: number;
}

export interface Token {
  type: "word" | "number" | "string" | "quoted" | "comment" | "op" | "punct";
  value: string;
}

const TWO_CHAR_OPS = new Set([
  "<=", ">=", "<>", "!=", "||", "::", "->", "=>", "==", "<<", ">>", ":=",
]);
const OP_CHARS = new Set("+-*/%=<>!|&^~?:.@".split(""));
const PUNCT = new Set([",", ";", "(", ")", "[", "]"]);

function isWhitespace(c: string): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v";
}
function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}
function isWordStart(c: string): boolean {
  return /[A-Za-z_]/.test(c) || c === "$" || c === "#";
}
function isWordPart(c: string): boolean {
  return /[A-Za-z0-9_$#]/.test(c);
}

/** Turn a SQL string into typed tokens without losing literal contents. */
export function tokenizeSql(input: string): Token[] {
  const tokens: Token[] = [];
  const n = input.length;
  let i = 0;

  while (i < n) {
    const c = input[i];
    if (isWhitespace(c)) {
      i += 1;
      continue;
    }

    // Line comment
    if (c === "-" && input[i + 1] === "-") {
      let j = i + 2;
      while (j < n && input[j] !== "\n") j += 1;
      tokens.push({ type: "comment", value: input.slice(i, j) });
      i = j;
      continue;
    }

    // Block comment
    if (c === "/" && input[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(input[j] === "*" && input[j + 1] === "/")) j += 1;
      j = j < n ? j + 2 : n;
      tokens.push({ type: "comment", value: input.slice(i, j) });
      i = j;
      continue;
    }

    // Single-quoted string with doubled '' escapes
    if (c === "'") {
      let j = i + 1;
      let value = "'";
      while (j < n) {
        if (input[j] === "'") {
          if (input[j + 1] === "'") {
            value += "''";
            j += 2;
            continue;
          }
          value += "'";
          j += 1;
          break;
        }
        value += input[j];
        j += 1;
      }
      tokens.push({ type: "string", value });
      i = j;
      continue;
    }

    // Double-quoted or backtick identifier (doubled quote escapes)
    if (c === '"' || c === "`") {
      const quote = c;
      let j = i + 1;
      let value = quote;
      while (j < n) {
        if (input[j] === quote) {
          if (input[j + 1] === quote) {
            value += quote + quote;
            j += 2;
            continue;
          }
          value += quote;
          j += 1;
          break;
        }
        value += input[j];
        j += 1;
      }
      tokens.push({ type: "quoted", value });
      i = j;
      continue;
    }

    // SQL Server [bracketed] identifier
    if (c === "[") {
      let j = i + 1;
      while (j < n && input[j] !== "]") j += 1;
      j = j < n ? j + 1 : n;
      tokens.push({ type: "quoted", value: input.slice(i, j) });
      i = j;
      continue;
    }

    // Number (digits, optional decimal point, optional exponent)
    if (isDigit(c) || (c === "." && isDigit(input[i + 1] ?? ""))) {
      let j = i;
      while (j < n && (isDigit(input[j]) || input[j] === ".")) j += 1;
      if ((input[j] === "e" || input[j] === "E") && (isDigit(input[j + 1] ?? "") || input[j + 1] === "+" || input[j + 1] === "-")) {
        j += 1;
        if (input[j] === "+" || input[j] === "-") j += 1;
        while (j < n && isDigit(input[j])) j += 1;
      }
      tokens.push({ type: "number", value: input.slice(i, j) });
      i = j;
      continue;
    }

    // Word / identifier / keyword
    if (isWordStart(c)) {
      let j = i + 1;
      while (j < n && isWordPart(input[j])) j += 1;
      tokens.push({ type: "word", value: input.slice(i, j) });
      i = j;
      continue;
    }

    // Two-character operator
    const pair = input.slice(i, i + 2);
    if (TWO_CHAR_OPS.has(pair)) {
      tokens.push({ type: "op", value: pair });
      i += 2;
      continue;
    }

    // Punctuation
    if (PUNCT.has(c)) {
      tokens.push({ type: "punct", value: c });
      i += 1;
      continue;
    }

    // Single-character operator or fallback
    if (OP_CHARS.has(c)) {
      tokens.push({ type: "op", value: c });
      i += 1;
      continue;
    }

    tokens.push({ type: "op", value: c });
    i += 1;
  }

  return tokens;
}

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "NULL", "IS", "IN", "LIKE", "BETWEEN",
  "AS", "DISTINCT", "ALL", "TOP", "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER",
  "CROSS", "ON", "USING", "GROUP", "ORDER", "BY", "HAVING", "LIMIT", "OFFSET", "FETCH",
  "NEXT", "ROWS", "ONLY", "ASC", "DESC", "UNION", "EXCEPT", "INTERSECT", "INSERT", "INTO",
  "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "VIEW", "INDEX", "ALTER", "DROP",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "DEFAULT", "CONSTRAINT",
  "CASE", "WHEN", "THEN", "ELSE", "END", "WITH", "RECURSIVE", "RETURNING", "EXISTS",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "CAST", "TRUE", "FALSE", "INTERVAL",
  "OVER", "PARTITION", "INT", "INTEGER", "VARCHAR", "TEXT", "DATE", "TIMESTAMP", "BOOLEAN",
]);

/** Keywords that begin a new visual clause when seen at the top parenthesis depth. */
const NEWLINE_BEFORE = new Set([
  "FROM", "WHERE", "GROUP", "ORDER", "HAVING", "LIMIT", "OFFSET", "FETCH", "UNION",
  "EXCEPT", "INTERSECT", "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "OUTER",
  "ON", "USING", "SET", "VALUES", "WHERE", "AND", "OR", "RETURNING", "WINDOW",
]);

function applyCase(word: string, keywordCase: KeywordCase): string {
  if (!KEYWORDS.has(word.toUpperCase())) return word;
  if (keywordCase === "upper") return word.toUpperCase();
  if (keywordCase === "lower") return word.toLowerCase();
  return word;
}

/**
 * Format SQL into an indented, keyword-cased string. Strings, comments and
 * quoted identifiers are preserved byte-for-byte apart from casing keywords.
 */
export function formatSql(input: string, options: SqlFormatOptions = {}): string {
  if (!input.trim()) return "";
  const tokens = tokenizeSql(input);
  const keywordCase = options.keywordCase ?? "upper";
  const size = Math.max(0, Math.min(8, Math.floor(options.indentSize ?? 2)));
  const indentUnit = " ".repeat(size);

  const lines: string[] = [];
  let parts: string[] = [];
  let level = 0;
  let parenDepth = 0;

  const flush = () => {
    if (parts.length > 0) {
      lines.push(indentUnit.repeat(level) + parts.join(" ").trimEnd());
      parts = [];
    }
  };

  const push = (value: string) => {
    if (parts.length === 0) {
      parts.push(value);
      return;
    }
    const prev = parts[parts.length - 1];
    let needsSpace = true;
    if ([",", ";", ")", ".", "::"].includes(value)) needsSpace = false;
    else if (prev === "(" || prev === "." || prev === "::") needsSpace = false;
    else if (value === "(" && prev && /[A-Za-z0-9_$#\)\]]$/.test(prev) && !KEYWORDS.has(prev.toUpperCase())) needsSpace = false;
    if (needsSpace) parts.push(value);
    else parts[parts.length - 1] = (parts[parts.length - 1] ?? "") + value;
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const v = token.value;

    if (token.type === "word") {
      const word = applyCase(v, keywordCase);
      // Skip the BY in GROUP BY / ORDER BY — the newline was triggered by GROUP/ORDER.
      const prevRaw = parts.length ? parts[parts.length - 1].split(/\s+/).pop() : "";
      const isByContinuation = word.toUpperCase() === "BY" && ["GROUP", "ORDER", "PARTITION"].includes(prevRaw?.toUpperCase() ?? "");
      if (!isByContinuation && parenDepth === 0 && NEWLINE_BEFORE.has(word.toUpperCase())) {
        flush();
      }
      push(word);
      continue;
    }

    if (token.type === "comment") {
      flush();
      lines.push(indentUnit.repeat(level) + v);
      continue;
    }

    if (token.type === "string" || token.type === "quoted") {
      push(v);
      continue;
    }

    if (token.type === "number") {
      push(v);
      continue;
    }

    // punctuation / operators
    if (v === "(") {
      push(v);
      parenDepth += 1;
      level += 1;
      continue;
    }
    if (v === ")") {
      level = Math.max(0, level - 1);
      parenDepth = Math.max(0, parenDepth - 1);
      push(v);
      continue;
    }
    if (v === ",") {
      push(v);
      if (parenDepth === 0) flush();
      continue;
    }
    if (v === ";") {
      push(v);
      flush();
      lines.push("");
      continue;
    }

    push(v);
  }

  flush();

  // Collapse 3+ blank lines into one and trim edges.
  const cleaned: string[] = [];
  for (const line of lines) {
    if (line === "" && cleaned[cleaned.length - 1] === "") continue;
    cleaned.push(line);
  }
  while (cleaned.length && cleaned[cleaned.length - 1] === "") cleaned.pop();
  while (cleaned.length && cleaned[0] === "") cleaned.shift();

  return cleaned.join("\n");
}
