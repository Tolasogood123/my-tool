/** Pure CSV parsing and serialization (no dependencies). */

export type Delimiter = "," | ";" | "\t";

export interface CsvParseResult {
  rows: string[][];
  error: string | null;
}

/** Parses CSV text with quoted fields, escaped quotes and embedded newlines. */
export function parseCsv(input: string, delimiter: Delimiter): CsvParseResult {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      if (field !== "") {
        return { rows: [], error: `Unexpected quote in row ${rows.length + 1}.` };
      }
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (inQuotes) {
    return { rows: [], error: "A quoted field was never closed." };
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
  if (nonEmpty.length === 0) return { rows: [], error: "The CSV is empty." };
  return { rows: nonEmpty, error: null };
}

export function csvToJson(
  input: string,
  delimiter: Delimiter,
  firstRowHeaders: boolean,
): { json: string; error: string | null } {
  const { rows, error } = parseCsv(input, delimiter);
  if (error) return { json: "", error };

  if (!firstRowHeaders) {
    return { json: JSON.stringify(rows, null, 2), error: null };
  }

  const headers = rows[0].map((header, index) => header.trim() || `column_${index + 1}`);
  const seen = new Set<string>();
  const unique = headers.map((header) => {
    let name = header;
    let suffix = 2;
    while (seen.has(name)) name = `${header}_${suffix++}`;
    seen.add(name);
    return name;
  });

  const objects = rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    unique.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });

  return { json: JSON.stringify(objects, null, 2), error: null };
}

function escapeCsv(value: unknown, delimiter: Delimiter): string {
  const text =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  if (/["\r\n]/.test(text) || text.includes(delimiter)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function jsonToCsv(
  input: string,
  delimiter: Delimiter,
): { csv: string; error: string | null } {
  if (!input.trim()) return { csv: "", error: "Paste a JSON array first." };

  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch (cause) {
    return {
      csv: "",
      error: cause instanceof Error ? `Invalid JSON: ${cause.message}` : "Invalid JSON.",
    };
  }

  if (!Array.isArray(value)) {
    return { csv: "", error: "The JSON must be an array of objects or arrays." };
  }
  if (value.length === 0) return { csv: "", error: "The array is empty — nothing to export." };

  const isObjects = value.every(
    (item) => item !== null && typeof item === "object" && !Array.isArray(item),
  );
  const isArrays = value.every((item) => Array.isArray(item));

  if (!isObjects && !isArrays) {
    return {
      csv: "",
      error: "Use an array of objects with the same keys, or an array of arrays.",
    };
  }

  if (isObjects) {
    const objects = value as Record<string, unknown>[];
    const headers: string[] = [];
    for (const object of objects) {
      for (const key of Object.keys(object)) {
        if (!headers.includes(key)) headers.push(key);
      }
    }
    const lines = [
      headers.map((header) => escapeCsv(header, delimiter)).join(delimiter),
      ...objects.map((object) =>
        headers.map((header) => escapeCsv(object[header], delimiter)).join(delimiter),
      ),
    ];
    return { csv: lines.join("\n"), error: null };
  }

  const lines = (value as unknown[][]).map((row) =>
    row.map((cell) => escapeCsv(cell, delimiter)).join(delimiter),
  );
  return { csv: lines.join("\n"), error: null };
}
