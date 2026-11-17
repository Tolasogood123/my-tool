import type { Metadata } from "next";
import { SITE } from "@/constants/site";

interface PageMetadataInput {
  /** Page title without the site-name suffix. */
  title: string;
  description: string;
  /** Absolute path starting with "/", or "/" for the home page. */
  path?: string;
}

/**
 * Builds consistent page metadata (title, description, canonical,
 * Open Graph, Twitter) on top of the root layout defaults.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
}: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: path === "/" ? title : `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: path === "/" ? title : `${title} | ${SITE.name}`,
      description,
    },
  };
}
