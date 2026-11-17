/** Turns a heading into a URL-safe id string, e.g. "No warranty" → "no-warranty". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
