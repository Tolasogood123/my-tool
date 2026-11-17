import type { CategoryId } from "@/types/category";
import type { Tool } from "@/types/tool";
import { categories } from "./categories";
import { tools } from "./tools";

export type SortKey = "popular" | "az" | "newest";

export const isPublished = (tool: Tool): boolean => tool.status !== "planned";

export const publishedTools: Tool[] = tools.filter(isPublished);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getPublishedTool(slug: string): Tool | undefined {
  const tool = getToolBySlug(slug);
  return tool && isPublished(tool) ? tool : undefined;
}

export function filterByCategory(
  items: Tool[],
  category: CategoryId | "all",
): Tool[] {
  if (category === "all") return items;
  return items.filter((tool) => tool.category === category);
}

export function sortBy(items: Tool[], sort: SortKey): Tool[] {
  const sorted = [...items];
  switch (sort) {
    case "az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "popular":
    default:
      return sorted.sort((a, b) => b.popularity - a.popularity);
  }
}

interface SearchOptions {
  query?: string;
  category?: CategoryId | "all";
  sort?: SortKey;
  includePlanned?: boolean;
}

export function searchTools({
  query = "",
  category = "all",
  sort = "popular",
  includePlanned = false,
}: SearchOptions): Tool[] {
  const base = includePlanned ? tools : publishedTools;
  const trimmed = query.trim().toLowerCase();
  const terms = trimmed.split(/\s+/).filter(Boolean);

  const matches = base.filter((tool) => {
    if (category !== "all" && tool.category !== category) return false;
    if (terms.length === 0) return true;

    const haystack = [
      tool.title,
      tool.description,
      tool.slug.replace(/-/g, " "),
      ...tool.keywords,
      ...tool.related,
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });

  return sortBy(matches, sort);
}

export function getToolsByCategory(category: CategoryId): Tool[] {
  return sortBy(filterByCategory(publishedTools, category), "popular");
}

export function getPopularTools(limit = 8): Tool[] {
  return sortBy(publishedTools, "popular").slice(0, limit);
}

export function getRecentTools(limit = 4): Tool[] {
  return sortBy(publishedTools, "newest").slice(0, limit);
}

export function getFeaturedTools(limit = 3): Tool[] {
  return sortBy(
    filterByCategory(publishedTools, "ai-writing"),
    "popular",
  ).slice(0, limit);
}

export function getRelated(tool: Tool, limit = 3): Tool[] {
  const bySlug = new Map(publishedTools.map((item) => [item.slug, item]));
  const result: Tool[] = [];
  const seen = new Set<string>([tool.slug]);

  for (const slug of tool.related) {
    const related = bySlug.get(slug);
    if (related && !seen.has(related.slug)) {
      seen.add(related.slug);
      result.push(related);
    }
  }

  if (result.length < limit) {
    const sameCategory = getToolsByCategory(tool.category);
    for (const candidate of sameCategory) {
      if (result.length >= limit) break;
      if (seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      result.push(candidate);
    }
  }

  return result.slice(0, limit);
}

export function getCategoriesWithCounts() {
  return categories.map((category) => ({
    ...category,
    count: publishedTools.filter((tool) => tool.category === category.id).length,
  }));
}

export function getToolCount(): number {
  return publishedTools.length;
}
