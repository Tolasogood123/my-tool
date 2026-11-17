import { isCategoryId } from "./categories";
import { tools } from "./tools";

export function validateRegistry(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const tool of tools) {
    if (slugs.has(tool.slug)) {
      errors.push(`Duplicate slug: ${tool.slug}`);
    }
    slugs.add(tool.slug);

    if (!slugPattern.test(tool.slug)) {
      errors.push(`Slug is not URL-safe: ${tool.slug}`);
    }
    if (!isCategoryId(tool.category)) {
      errors.push(`Invalid category on ${tool.slug}: ${tool.category}`);
    }
    if (!tool.title.trim() || !tool.description.trim()) {
      errors.push(`Missing title or description on ${tool.slug}`);
    }
    if (tool.description.length < 70) {
      errors.push(`Description too short on ${tool.slug}`);
    }
    if (!tool.content.what.trim() || tool.content.howTo.length < 3) {
      errors.push(`Incomplete how-to content on ${tool.slug}`);
    }
    if (tool.content.faqs.length < 2) {
      errors.push(`Needs at least 2 FAQs on ${tool.slug}`);
    }
    if (tool.content.benefits.length < 3) {
      errors.push(`Needs at least 3 benefits on ${tool.slug}`);
    }
  }

  for (const tool of tools) {
    for (const related of tool.related) {
      if (related === tool.slug) {
        errors.push(`Tool ${tool.slug} lists itself as related`);
      } else if (!slugs.has(related)) {
        errors.push(`Tool ${tool.slug} has unknown related slug: ${related}`);
      }
    }
  }

  return errors;
}

if (process.argv[1]?.endsWith("validate.ts")) {
  const errors = validateRegistry();
  if (errors.length > 0) {
    console.error(`Registry validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Registry OK: ${tools.length} tools, all slugs and relations valid.`);
}
