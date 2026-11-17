/** Pure Open Graph / Twitter meta tag generator. */

export interface OgInput {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  type: string;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Produces paste-ready meta tags with escaped attribute values. */
export function generateOgTags(input: OgInput): { tags: string; error: string | null } {
  if (!input.title.trim()) return { tags: "", error: "Enter a title for the preview." };

  const tags = [
    `<meta property="og:title" content="${escapeAttribute(input.title.trim())}" />`,
    input.description.trim()
      ? `<meta property="og:description" content="${escapeAttribute(input.description.trim())}" />`
      : "",
    input.url.trim()
      ? `<meta property="og:url" content="${escapeAttribute(input.url.trim())}" />`
      : "",
    input.imageUrl.trim()
      ? `<meta property="og:image" content="${escapeAttribute(input.imageUrl.trim())}" />`
      : "",
    input.siteName.trim()
      ? `<meta property="og:site_name" content="${escapeAttribute(input.siteName.trim())}" />`
      : "",
    `<meta property="og:type" content="${escapeAttribute(input.type || "website")}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join("\n");

  return { tags, error: null };
}
