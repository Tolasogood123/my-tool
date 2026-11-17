/** Pure robots.txt generator. */

export interface RobotsInput {
  allow: string;
  disallow: string;
  sitemap: string;
  crawlDelay: string;
}

export function generateRobots(input: RobotsInput): { text: string; error: string | null } {
  const disallowed = input.disallow
    .split(/[\n,]+/)
    .map((path) => path.trim())
    .filter(Boolean);
  const allowed = input.allow
    .split(/[\n,]+/)
    .map((path) => path.trim())
    .filter(Boolean);
  const delay = Number(input.crawlDelay);

  if (input.crawlDelay.trim() && (!Number.isFinite(delay) || delay < 0)) {
    return { text: "", error: "Crawl delay must be zero or a positive number." };
  }

  const lines = ["User-agent: *"];
  allowed.forEach((path) => lines.push(`Allow: ${path}`));
  disallowed.forEach((path) => lines.push(`Disallow: ${path}`));
  if (input.crawlDelay.trim()) lines.push(`Crawl-delay: ${delay}`);
  if (input.sitemap.trim()) lines.push(`Sitemap: ${input.sitemap.trim()}`);

  return { text: lines.join("\n"), error: null };
}
