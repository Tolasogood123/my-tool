/** Pure SRT <-> WebVTT conversion with timestamp validation.
 *
 * Text is treated as UTF-8 JavaScript strings throughout, so non-Latin
 * scripts such as Khmer are preserved byte-for-byte in the output. */

export type SubtitleFormat = "srt" | "vtt";
export type ConversionDirection = "srt-to-vtt" | "vtt-to-srt";

interface RawCue {
  identifier: string;
  start: string;
  end: string;
  settings: string;
  text: string[];
}

export interface ValidationResult {
  format: SubtitleFormat | null;
  cueCount: number;
  errors: string[];
  warnings: string[];
}

const TIMESTAMP = "(\\d{1,3}:\\d{2}:\\d{2}[,.]\\d{3}|\\d{1,3}:\\d{2}[,.]\\d{3})";
const CUE_REGEX = new RegExp(
  `^\\s*${TIMESTAMP}\\s*-->\\s*${TIMESTAMP}([^\\r\\n]*)$`,
);

/** Detects the format from a WEBVTT header or comma-based SRT timings. */
export function detectFormat(text: string): SubtitleFormat | null {
  const trimmed = text.replace(/^\uFEFF/, "").trimStart();
  if (/^WEBVTT(\s|$)/i.test(trimmed)) return "vtt";
  if (/\d{1,3}:\d{2}:\d{2},\d{3}\s*-->/.test(text)) return "srt";
  if (/\d{1,3}:\d{2}:\d{2}\.\d{3}\s*-->/.test(text)) return "vtt";
  return null;
}

/** Parses HH:MM:SS,mmm / HH:MM:SS.mmm / MM:SS.mmm into milliseconds. */
export function parseTimestamp(value: string): number | null {
  const cleaned = value.trim().replace(",", ".");
  const parts = cleaned.split(":");
  if (parts.length < 2 || parts.length > 3) return null;

  const tail = parts[parts.length - 1].split(".");
  if (tail.length !== 2) return null;
  const minutes = Number(parts[parts.length - 2]);
  const seconds = Number(tail[0]);
  const millis = Number(tail[1]);
  const hours = parts.length === 3 ? Number(parts[0]) : 0;

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    !Number.isFinite(millis)
  ) {
    return null;
  }
  if (minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
  if (tail[1].length !== 3) return null;
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

/** Formats milliseconds as a subtitle timestamp in the target format. */
export function formatTimestamp(ms: number, format: SubtitleFormat): string {
  const safe = Math.max(0, Math.round(ms));
  const hours = Math.floor(safe / 3_600_000);
  const minutes = Math.floor((safe % 3_600_000) / 60_000);
  const seconds = Math.floor((safe % 60_000) / 1000);
  const millis = safe % 1000;
  const separator = format === "srt" ? "," : ".";
  return (
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}${separator}${String(millis).padStart(3, "0")}`
  );
}

function parseCues(text: string): RawCue[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const cues: RawCue[] = [];
  let i = 0;

  while (i < lines.length) {
    const match = CUE_REGEX.exec(lines[i]);
    if (!match) {
      i++;
      continue;
    }

    const previous = lines[i - 1]?.trim() ?? "";
    const identifier = /^\d+$/.test(previous) ? previous : "";

    const textLines: string[] = [];
    i++;
    while (i < lines.length && lines[i].trim() !== "") {
      textLines.push(lines[i]);
      i++;
    }
    while (i < lines.length && lines[i].trim() === "") i++;

    cues.push({
      identifier,
      start: match[1],
      end: match[2],
      settings: (match[3] ?? "").trim(),
      text: textLines,
    });
  }
  return cues;
}

/** Validates cue timings. Khmer and other scripts are not altered. */
export function validateSubtitle(text: string): ValidationResult {
  const format = detectFormat(text);
  const cues = parseCues(text);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!text.trim()) {
    return { format: null, cueCount: 0, errors: ["The subtitle input is empty."], warnings };
  }
  if (!format) {
    errors.push("Could not detect SRT or WebVTT format. Check the file header and timings.");
  }
  if (cues.length === 0) {
    errors.push("No subtitle cues with a start and end timestamp were found.");
  }

  let previousEnd = -1;
  cues.forEach((cue, index) => {
    const start = parseTimestamp(cue.start);
    const end = parseTimestamp(cue.end);
    const label = `Cue ${index + 1}`;
    if (start === null) errors.push(`${label}: invalid start timestamp "${cue.start}".`);
    if (end === null) errors.push(`${label}: invalid end timestamp "${cue.end}".`);
    if (start !== null && end !== null) {
      if (end <= start) errors.push(`${label}: end time must be after start time.`);
      if (start < previousEnd) {
        warnings.push(`${label}: starts before the previous cue ends; some players may overlap them.`);
      }
      previousEnd = end;
    }
    if (cue.text.length === 0) warnings.push(`${label}: no caption text found.`);
  });

  return { format, cueCount: cues.length, errors, warnings };
}

/** Converts subtitle text in either direction, preserving UTF-8 caption text. */
export function convertSubtitle(
  text: string,
  direction: ConversionDirection,
): { output: string; cueCount: number } {
  const cues = parseCues(text);
  if (cues.length === 0) {
    throw new Error("No valid subtitle cues were found to convert.");
  }
  const target: SubtitleFormat = direction === "srt-to-vtt" ? "vtt" : "srt";
  const blocks: string[] = [];

  cues.forEach((cue, index) => {
    const start = parseTimestamp(cue.start);
    const end = parseTimestamp(cue.end);
    if (start === null || end === null) {
      throw new Error(
        `Cue ${index + 1} has an invalid timestamp (${cue.start} --> ${cue.end}).`,
      );
    }
    if (end <= start) {
      throw new Error(`Cue ${index + 1} ends before or at its start time.`);
    }

    const timing =
      `${formatTimestamp(start, target)} --> ${formatTimestamp(end, target)}` +
      (target === "vtt" && cue.settings ? ` ${cue.settings}` : "");
    const identifier = target === "vtt" ? cue.identifier : String(index + 1);
    blocks.push(
      identifier
        ? `${identifier}\n${timing}\n${cue.text.join("\n")}`.trimEnd()
        : `${timing}\n${cue.text.join("\n")}`.trimEnd(),
    );
  });

  const output =
    target === "vtt" ? `WEBVTT\n\n${blocks.join("\n\n")}\n` : `${blocks.join("\n\n")}\n`;
  return { output, cueCount: cues.length };
}

export function subtitleBaseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "subtitles"
  );
}
