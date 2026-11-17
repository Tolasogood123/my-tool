import type { Tool } from "@/types/tool";

/** Stage 3, Round 2 tools. */
export const stage3Round2Tools: Tool[] = [
  {
    slug: "csv-to-json",
    title: "CSV to JSON",
    description:
      "Convert CSV data to JSON in your browser. Support commas, semicolons or tabs, quoted fields, and optional headers, then copy or download the result.",
    category: "developer",
    keywords: ["csv to json", "convert csv to json", "csv parser", "csv json converter", "spreadsheet to json"],
    icon: "Braces",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-18",
    related: ["json-to-csv", "json-formatter", "json-validator"],
    content: {
      what: "The CSV to JSON converter parses delimited text and produces either an array of objects (using the first row as headers) or an array of arrays. Quoted fields, escaped quotes and line breaks inside quotes are handled correctly. Duplicate header names are made unique, and the output is generated locally with no upload.",
      howTo: [
        "Paste CSV text or the contents of a spreadsheet export.",
        "Choose the delimiter: comma, semicolon, or tab.",
        "Keep 'First row contains headers' checked when the first row names your columns.",
        "Click Convert, then copy or download the JSON.",
      ],
      example:
        "CSV 'name,age\\n\"Kim, Sokha\",21' with headers becomes [{\"name\":\"Kim, Sokha\",\"age\":\"21\"}].",
      benefits: [
        "Turn spreadsheet exports into data usable by APIs and scripts.",
        "Handles commas inside quoted names without breaking columns.",
        "Choice of delimiter covers common regional exports.",
        "Private by design: parsing happens entirely on your device.",
      ],
      faqs: [
        {
          q: "Are values converted to numbers?",
          a: "No. CSV has no type information, so all values remain strings. Convert them in your code after import if you need numbers or booleans.",
        },
        {
          q: "What happens to duplicate column names?",
          a: "The converter keeps every column by appending a numeric suffix, such as name_2, so no data is silently lost.",
        },
        {
          q: "Can it read line breaks inside a cell?",
          a: "Yes. Fields wrapped in double quotes may contain newlines and the delimiter. A doubled quote (\"\") represents a literal quote.",
        },
        {
          q: "Why did I get an 'unclosed quote' error?",
          a: "A quoted field must end with a closing quote before the next delimiter or line break. Check the reported row and fix the missing quote.",
        },
      ],
    },
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV",
    description:
      "Turn a JSON array into a clean CSV file in your browser. Handles nested values, commas, quotes and newlines, with copy and download built in.",
    category: "developer",
    keywords: ["json to csv", "convert json to csv", "json csv exporter", "array to csv", "csv generator"],
    icon: "FileJson",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-18",
    related: ["csv-to-json", "json-formatter", "json-validator"],
    content: {
      what: "The JSON to CSV converter accepts an array of objects or an array of arrays and writes a properly escaped CSV file. For objects, the first line contains the union of all keys found in the records; missing values become empty cells. For arrays, each inner array becomes one row. Conversion happens entirely in the browser.",
      howTo: [
        "Paste a JSON array of objects or arrays into the input box.",
        "Choose the delimiter used by your target spreadsheet.",
        "Click Convert to JSON to CSV and review the preview.",
        "Copy the CSV or download it as a .csv file.",
      ],
      example:
        'JSON [{"name":"Kim, Sokha","age":21}] becomes CSV name,age followed by "Kim, Sokha",21.',
      benefits: [
        "Prepare API data for spreadsheets and accounting software.",
        "Correct escaping for commas, quotes and embedded newlines.",
        "Works with records that have different sets of keys.",
        "No server round trip and no stored data.",
      ],
      faqs: [
        {
          q: "What happens to nested objects?",
          a: "Nested objects and arrays are serialized as compact JSON inside a single cell, so no structure is lost even though CSV is flat.",
        },
        {
          q: "Why are my columns in a surprising order?",
          a: "Columns follow the order in which keys first appear across your records. Reorder the keys in your JSON if you need a specific layout.",
        },
        {
          q: "Does it support nested arrays of arrays?",
          a: "Yes, as long as the top-level value is an array and every row is itself an array. Mixed object and array rows are rejected with a clear error.",
        },
        {
          q: "Which delimiter should I choose?",
          a: "Use comma for most English-language spreadsheets and semicolon for many European locales that use commas as decimal separators.",
        },
      ],
    },
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode a JSON Web Token to inspect its header and payload in your browser. Clearly marked as decode-only: it never verifies the signature.",
    category: "security-privacy",
    keywords: ["jwt decoder", "decode jwt token", "inspect jwt", "jwt payload viewer", "json web token decoder"],
    icon: "KeyRound",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-18",
    related: ["base64-encoder-decoder", "json-formatter", "password-generator"],
    content: {
      what: "The JWT Decoder splits a token into its three parts, decodes the base64url header and payload, and prints them as readable JSON. It also reports iat and exp claims in human form and whether exp is in the past. This tool deliberately does not verify the signature — a decoded token is not proof of identity or authenticity.",
      howTo: [
        "Paste a JWT in header.payload.signature form.",
        "Click Decode token to read the header and payload.",
        "Check the issued-at and expires-at claims.",
        "Copy or download the decoded report for debugging.",
      ],
      example:
        "A token with payload {\"sub\":\"1234567890\",\"exp\":4102444800} shows sub = 1234567890 and expires at 2100-01-01 00:00:00 UTC.",
      benefits: [
        "Debug authentication payloads without sending them to a website.",
        "See time-based claims converted to readable dates.",
        "Clear warning that the signature was not checked.",
        "Handles Unicode claims and malformed tokens with friendly errors.",
      ],
      faqs: [
        {
          q: "Does this verify the token signature?",
          a: "No. It only decodes the first two segments. Anyone can craft a token with arbitrary contents, so never treat the displayed claims as trusted identity data.",
        },
        {
          q: "Why does decoding fail for my token?",
          a: "A JWT needs exactly three dot-separated parts, and the first two must be valid base64url-encoded JSON objects. Check that you copied the full token.",
        },
        {
          q: "Are expired tokens rejected?",
          a: "The tool reports whether the exp claim is in the past but still shows the payload. Verification and rejection belong in your application's server-side auth layer.",
        },
        {
          q: "Is my token sent anywhere?",
          a: "No. Decoding happens in your browser with standard Web APIs, and nothing is uploaded. Still, avoid pasting production access tokens into any tool you do not control.",
        },
      ],
    },
  },
];
