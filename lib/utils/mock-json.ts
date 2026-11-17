/** Pure helpers for building a schema and generating clearly-fake, realistic-looking JSON rows. */

export type MockFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "email"
  | "name"
  | "uuid"
  | "sentence"
  | "enum";

export const MOCK_FIELD_TYPES: { value: MockFieldType; label: string }[] = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "name", label: "Full name" },
  { value: "uuid", label: "UUID" },
  { value: "sentence", label: "Sentence" },
  { value: "enum", label: "Enum (pick from list)" },
];

export interface SchemaField {
  name: string;
  type: MockFieldType;
  enumValues: string[];
}

export interface MockJsonResult {
  data: Record<string, unknown>[];
  error: string | null;
}

export const MAX_MOCK_ROWS = 100;

export function createSchemaField(name = ""): SchemaField {
  return { name, type: "string", enumValues: [] };
}

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie", "Avery", "Quinn"];
const LAST_NAMES = ["Demo", "Sample", "Example", "Test", "Placeholder", "Fictional"];
const WORDS = [
  "sample", "example", "demo", "placeholder", "fictional", "test",
  "temporary", "illustrative", "generic", "mock",
];
const SENTENCES = [
  "This is a sample sentence used only for demonstration purposes.",
  "All values shown here are fictional and contain no real information.",
  "Placeholder content helps designers preview layouts before real data arrives.",
  "The quick brown fox jumps over the lazy dog in this example.",
  "Developers use mock records to test interfaces without sensitive data.",
];

/** Small deterministic PRNG (mulberry32) so a given seed reproduces the same rows. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fakeUuid(random: () => number): string {
  const hex = "0123456789abcdef";
  const chunk = (length: number) =>
    Array.from({ length }, () => hex[Math.floor(random() * 16)]).join("");
  return `${chunk(8)}-${chunk(4)}-4${chunk(3)}-a${chunk(3)}-${chunk(12)}`;
}

function valueFor(field: SchemaField, index: number, random: () => number): unknown {
  switch (field.type) {
    case "number":
      return Math.floor(random() * 1000) + 1;
    case "boolean":
      return random() >= 0.5;
    case "date": {
      const start = Date.UTC(2024, 0, 1);
      const span = 3 * 365 * 24 * 60 * 60 * 1000;
      return new Date(start + Math.floor(random() * span)).toISOString().slice(0, 10);
    }
    case "email":
      return `user${index + 1}@example.test`;
    case "name": {
      const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
      const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
      return `${first} ${last} ${index + 1}`;
    }
    case "uuid":
      return fakeUuid(random);
    case "sentence":
      return SENTENCES[Math.floor(random() * SENTENCES.length)];
    case "enum": {
      const values = field.enumValues.map((value) => value.trim()).filter(Boolean);
      if (values.length === 0) return "N/A";
      return values[Math.floor(random() * values.length)];
    }
    case "string":
    default:
      return `${WORDS[Math.floor(random() * WORDS.length)]}-${index + 1}`;
  }
}

/** Validates a schema request and generates `count` rows, or an error message. */
export function generateMockData(
  fields: SchemaField[],
  count: number,
  seed = 42,
): MockJsonResult {
  if (!Number.isInteger(count) || count < 1 || count > MAX_MOCK_ROWS) {
    return { data: [], error: `Row count must be a whole number between 1 and ${MAX_MOCK_ROWS}.` };
  }
  if (fields.length === 0) {
    return { data: [], error: "Add at least one field to your schema." };
  }

  const names: string[] = [];
  for (const field of fields) {
    const name = field.name.trim();
    if (!name) return { data: [], error: "Every field needs a name." };
    if (names.includes(name)) {
      return { data: [], error: `Duplicate field name: "${name}".` };
    }
    names.push(name);
    if (field.type === "enum" && field.enumValues.map((v) => v.trim()).filter(Boolean).length === 0) {
      return { data: [], error: `Enum field "${name}" needs at least one option.` };
    }
  }

  const random = mulberry32(seed);
  const data: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i += 1) {
    const row: Record<string, unknown> = {};
    for (const field of fields) {
      row[field.name.trim()] = valueFor(field, i, random);
    }
    data.push(row);
  }
  return { data, error: null };
}

/** Serializes generated rows as pretty JSON. */
export function mockDataToJson(data: Record<string, unknown>[]): string {
  return JSON.stringify(data, null, 2);
}
