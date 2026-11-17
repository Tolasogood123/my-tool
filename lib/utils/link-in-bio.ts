/** Pure helpers for a self-contained, safe link-in-bio HTML page. */

export interface BioLink {
  id: string;
  label: string;
  url: string;
}

export interface BioProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  theme: "light" | "dark";
  accentColor: string;
  links: BioLink[];
}

/** Encodes every character that could break out of HTML text or an attribute. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allows only http(s), mailto, tel, and same-site relative URLs. Anything with
 * a script-like scheme returns an empty string so it can never reach an href.
 */
export function sanitizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("#")) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "mailto:" ||
      url.protocol === "tel:"
    ) {
      return url.toString();
    }
  } catch {
    // An unparseable string is not a usable link.
  }
  return "";
}

/** Accepts only #rgb or #rrggbb so a color cannot inject extra CSS. */
export function sanitizeColor(value: string, fallback = "#6366f1"): string {
  const color = value.trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ? color : fallback;
}

/** Builds a complete HTML document with no external scripts, fonts, or styles. */
export function generateBioHtml(profile: BioProfile): string {
  const name = profile.name.trim() || "My links";
  const handle = profile.handle.trim().replace(/^@/, "");
  const bio = profile.bio.trim();
  const accent = sanitizeColor(profile.accentColor);
  const theme = profile.theme === "dark" ? "dark" : "light";
  const avatar = sanitizeUrl(profile.avatarUrl);

  const lines: string[] = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>${escapeHtml(name)}</title>`,
    "  <style>",
    "    :root{--bg:#f4f4f5;--card:#ffffff;--text:#18181b;--muted:#71717a;--border:#e4e4e7;--accent:#6366f1}",
    '    [data-theme="dark"]{--bg:#09090b;--card:#18181b;--text:#fafafa;--muted:#a1a1aa;--border:#3f3f46}',
    "    *{box-sizing:border-box}",
    "    body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}",
    "    main{max-width:480px;margin:40px auto;padding:0 16px}",
    "    .card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px 20px;text-align:center}",
    "    .avatar{width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid var(--accent)}",
    "    h1{margin:16px 0 2px;font-size:1.4rem;line-height:1.25}",
    "    .handle{margin:0;color:var(--muted);font-size:.9rem}",
    "    .bio{margin:12px 0 24px;color:var(--muted);font-size:.95rem;line-height:1.5;white-space:pre-line}",
    "    .links{display:grid;gap:10px}",
    "    .link{display:block;padding:14px 16px;border-radius:12px;background:var(--card);border:1px solid var(--border);color:var(--text);text-decoration:none;font-weight:600}",
    "    .link:hover,.link:focus{border-color:var(--accent);outline:none}",
    "    footer{margin-top:24px;color:var(--muted);font-size:.75rem}",
    "  </style>",
    "</head>",
    `<body data-theme="${theme}" style="--accent:${accent}">`,
    '  <main><section class="card">',
  ];

  if (avatar) {
    lines.push(
      `    <img class="avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}">`,
    );
  }

  lines.push(`    <h1>${escapeHtml(name)}</h1>`);
  if (handle) lines.push(`    <p class="handle">@${escapeHtml(handle)}</p>`);
  if (bio) lines.push(`    <p class="bio">${escapeHtml(bio)}</p>`);

  const safeLinks = profile.links
    .map((link) => ({ label: link.label.trim(), url: sanitizeUrl(link.url) }))
    .filter((link) => link.url && (link.label || link.url));

  if (safeLinks.length > 0) {
    lines.push('    <nav class="links">');
    for (const link of safeLinks) {
      const label = escapeHtml(link.label || link.url);
      const href = escapeHtml(link.url);
      const external = /^https?:/.test(link.url);
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      lines.push(`      <a class="link" href="${href}"${target}>${label}</a>`);
    }
    lines.push("    </nav>");
  }

  lines.push(
    "    <footer>Made with the TolaDev Link-in-Bio Generator</footer>",
    "  </section></main>",
    "</body>",
    "</html>",
  );

  return lines.join("\n");
}
