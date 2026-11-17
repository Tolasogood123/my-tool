/** APA 7 and MLA 9 citation formatting from structured form fields. */

export type CitationStyle = "apa" | "mla";
export type SourceType = "website" | "book" | "journal";

export interface CitationInput {
  authors: string;
  title: string;
  container: string;
  publisher: string;
  year: string;
  month: string;
  day: string;
  accessed: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  url: string;
  edition: string;
}

export const emptyCitation: CitationInput = {
  authors: "",
  title: "",
  container: "",
  publisher: "",
  year: "",
  month: "",
  day: "",
  accessed: "",
  volume: "",
  issue: "",
  pages: "",
  doi: "",
  url: "",
  edition: "",
};

const MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];
const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function normalizeMonth(value: string): string {
  const month = value.trim();
  if (!month) return "";
  if (/^\d{1,2}$/.test(month)) {
    const number = Number(month);
    return number >= 1 && number <= 12 ? MONTHS[number - 1] : "";
  }
  const index = MONTH_KEYS.indexOf(month.toLowerCase().slice(0, 3));
  return index >= 0 ? MONTHS[index] : month;
}

function parseAuthors(raw: string): string[] {
  return raw
    .split(/\s+and\s+|\s*&\s*|\s*;\s*/i)
    .map((author) => author.trim())
    .filter(Boolean);
}

function splitName(full: string): { last: string; rest: string } {
  const name = full.trim();
  if (name.includes(",")) {
    const pieces = name.split(",");
    return { last: pieces[0].trim(), rest: pieces.slice(1).join(" ").trim() };
  }
  const pieces = name.split(/\s+/);
  const last = pieces.pop() ?? "";
  return { last, rest: pieces.join(" ") };
}

function apaName(full: string): string {
  const { last, rest } = splitName(full);
  const initials = rest
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}.`)
    .join(" ");
  return initials ? `${last}, ${initials}` : last;
}

function mlaName(full: string): string {
  const { last, rest } = splitName(full);
  return rest ? `${last}, ${rest}` : last;
}

function joinAuthors(input: CitationInput, style: CitationStyle): string {
  const authors = parseAuthors(input.authors);
  if (authors.length === 0) return "";
  if (style === "apa") {
    if (authors.length === 1) return apaName(authors[0]);
    if (authors.length === 2) return `${apaName(authors[0])}, & ${apaName(authors[1])}`;
    return `${apaName(authors[0])}, et al.`;
  }
  if (authors.length === 1) return `${mlaName(authors[0])}.`;
  if (authors.length === 2) return `${mlaName(authors[0])}, and ${authors[1].trim()}.`;
  return `${mlaName(authors[0])}, et al.`;
}

/** Ensures a segment ends with a full stop for clean bibliography lines. */
function sentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function doiLink(doi: string): string {
  const value = doi.trim().replace(/^doi:\s*/i, "");
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://doi.org/${value}`;
}

function apaDate(input: CitationInput): string {
  const year = input.year.trim() || "n.d.";
  const month = normalizeMonth(input.month);
  const day = input.day.trim().replace(/^(0)(?=\d)/, "");
  if (month && day) return `${year}, ${month} ${day}`;
  if (month) return `${year}, ${month}`;
  return year;
}

function mlaDate(input: CitationInput): string {
  const year = input.year.trim();
  const month = normalizeMonth(input.month);
  const day = input.day.trim().replace(/^(0)(?=\d)/, "");
  if (year && month && day) return `${day} ${month} ${year}`;
  if (year && month) return `${month} ${year}`;
  return year;
}

function mlaAccess(input: CitationInput): string {
  const value = input.accessed.trim();
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `Accessed ${Number(match[3])} ${MONTHS[Number(match[2]) - 1]} ${match[1]}.`;
  }
  return `Accessed ${value}.`;
}

/** Returns a validation message when a required field is missing. */
export function validateCitationInput(input: CitationInput, sourceType: SourceType): string | null {
  if (!input.authors.trim()) return "Add at least one author (for example: Smith, John).";
  if (!input.title.trim()) return "Add a title for the source.";
  if (sourceType === "journal" && !input.container.trim()) return "Add the journal name for a journal article.";
  if (sourceType === "website" && !input.url.trim() && !input.doi.trim()) {
    return "Add a URL or DOI for a website source.";
  }
  if (sourceType === "book" && !input.year.trim()) return "Add the publication year for a book.";
  return null;
}

/** Builds the full reference-list entry in the chosen style. */
export function buildCitation(input: CitationInput, style: CitationStyle, sourceType: SourceType): string {
  const authors = joinAuthors(input, style);
  const title = input.title.trim();
  const container = input.container.trim();
  const url = input.url.trim();
  const doi = doiLink(input.doi);
  const link = doi || url;

  if (style === "apa") {
    if (sourceType === "website") {
      let line = `${authors} (${apaDate(input)}). ${sentence(title)}`;
      if (container) line += ` ${sentence(container)}`;
      if (link) line += ` ${link}`;
      return line.trim();
    }
    if (sourceType === "book") {
      const edition = input.edition.trim() ? ` (${input.edition.trim()} ed.)` : "";
      let line = `${authors} (${input.year.trim() || "n.d."}). ${sentence(title + edition)}`;
      if (input.publisher.trim()) line += ` ${sentence(input.publisher)}`;
      if (doi) line += ` ${doi}`;
      return line.trim();
    }
    const volume = input.volume.trim();
    const issue = input.issue.trim() ? `(${input.issue.trim()})` : "";
    const pages = input.pages.trim() ? `, ${input.pages.trim().replace(/-/g, "–")}` : "";
    const cleanContainer = container.replace(/[.,]+$/, "");
    let line = `${authors} (${input.year.trim() || "n.d."}). ${sentence(title)}`;
    if (volume) {
      line += ` ${cleanContainer}, ${volume}${issue}${pages}.`;
    } else {
      line += ` ${sentence(cleanContainer)}`;
    }
    if (doi) line += ` ${doi}`;
    return line.trim();
  }

  // MLA 9
  if (sourceType === "website") {
    let line = `${authors} ${title ? `“${title}.”` : ""}`;
    if (container) line += ` ${container.replace(/[.,]+$/, "")},`;
    const published = mlaDate(input);
    if (published) line += ` ${published},`;
    if (link) line += ` ${link}.`;
    const accessed = mlaAccess(input);
    if (accessed) line += ` ${accessed}`;
    return line.replace(/\s+/g, " ").trim();
  }
  if (sourceType === "book") {
    const edition = input.edition.trim() ? `${input.edition.trim()} ed., ` : "";
    let line = `${authors} ${title ? `“${title}.”` : ""} ${edition}`;
    if (input.publisher.trim()) line += `${input.publisher.trim()}, `;
    if (input.year.trim()) line += `${input.year.trim()}.`;
    return sentence(line);
  }
  let line = `${authors} ${title ? `“${title}.”` : ""} ${container.replace(/[.,]+$/, "")},`;
  const volume = input.volume.trim() ? `vol. ${input.volume.trim()}, ` : "";
  const issue = input.issue.trim() ? `no. ${input.issue.trim()}, ` : "";
  const pages = input.pages.trim() ? `pp. ${input.pages.trim().replace(/-/g, "–")}, ` : "";
  line += ` ${volume}${issue}${pages}${input.year.trim()}.`;
  if (doi) line += ` ${doi}`;
  return line.replace(/\s+/g, " ").trim();
}

/** Builds the short parenthetical citation used in the body of a paper. */
export function buildInTextCitation(input: CitationInput, style: CitationStyle): string {
  const authors = parseAuthors(input.authors);
  const last = authors.length > 0 ? splitName(authors[0]).last : "Author";
  const year = input.year.trim() || "n.d.";
  if (style === "apa") return `(${last}, ${year})`;
  const pages = input.pages.trim() ? ` ${input.pages.trim().replace(/-/g, "–")}` : "";
  return `(${last}${pages})`;
}
