import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { getSortedBlogPosts } from "@/lib/blog";
import { categories } from "@/lib/registry/categories";
import { publishedTools } from "@/lib/registry/helpers";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");

  // Static pages. lastModified is omitted where there is no meaningful
  // change date instead of inventing one with the current time.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, priority: 1 },
    { url: `${base}/tools`, priority: 0.9 },
    { url: `${base}/blog`, priority: 0.6 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/contact`, priority: 0.4 },
    { url: `${base}/privacy-policy`, priority: 0.3 },
    { url: `${base}/terms-of-service`, priority: 0.3 },
    { url: `${base}/disclaimer`, priority: 0.3 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${base}/category/${category.id}`,
      priority: 0.7,
    }),
  );

  const toolEntries: MetadataRoute.Sitemap = publishedTools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: tool.addedAt,
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = getSortedBlogPosts().map(
    (post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.date,
      priority: 0.5,
    }),
  );

  return [
    ...staticEntries,
    ...categoryEntries,
    ...toolEntries,
    ...blogEntries,
  ];
}
