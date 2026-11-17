/** Pure helpers for appending UTM campaign parameters to a URL. */

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export const EMPTY_UTM: UtmParams = {
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

export const UTM_MEDIUM_PRESETS = [
  "email",
  "social",
  "organic-social",
  "cpc",
  "referral",
  "display",
  "affiliate",
] as const;

export function validateUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Enter the page URL you want to track.";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "Enter a full URL including https://, for example https://example.com/page.";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only http and https URLs can carry UTM parameters.";
  }
  if (!url.hostname) return "That URL has no hostname.";
  return null;
}

/** Returns a URL with filled fields encoded via URL/URLSearchParams. */
export function buildUtmUrl(
  raw: string,
  params: UtmParams,
): { url: string; error: string | null } {
  const error = validateUrl(raw);
  if (error) return { url: "", error };

  const url = new URL(raw.trim());
  const fields: Array<[string, string]> = [
    ["utm_source", params.source],
    ["utm_medium", params.medium],
    ["utm_campaign", params.campaign],
    ["utm_term", params.term],
    ["utm_content", params.content],
  ];

  for (const [key, value] of fields) {
    const trimmed = value.trim();
    if (trimmed) url.searchParams.set(key, trimmed);
    else url.searchParams.delete(key);
  }

  return { url: url.toString(), error: null };
}

/** Reads existing UTM values from a tracked URL so they can be edited. */
export function parseUtmParams(raw: string): UtmParams {
  try {
    const url = new URL(raw.trim());
    return {
      source: url.searchParams.get("utm_source") ?? "",
      medium: url.searchParams.get("utm_medium") ?? "",
      campaign: url.searchParams.get("utm_campaign") ?? "",
      term: url.searchParams.get("utm_term") ?? "",
      content: url.searchParams.get("utm_content") ?? "",
    };
  } catch {
    return { ...EMPTY_UTM };
  }
}
