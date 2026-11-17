import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { slugify } from "@/lib/utils/slugify";
import { formatDate } from "@/lib/utils/format";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  intro: string;
  /** ISO date (YYYY-MM-DD) of the last update; displayed in US format. */
  updated: string;
  sections: LegalSection[];
  /** Final trailing node, e.g. an extra closing block. */
  after?: ReactNode;
}

/**
 * Shared layout for the legal pages (privacy, terms, disclaimer):
 * breadcrumbs, page header, and labeled sections from a data array.
 */
export function LegalPage({ title, intro, updated, sections, after }: LegalPageProps) {
  return (
    <div className="container-page py-12 lg:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path: `/${slugify(title)}` },
        ])}
      />
      <PageHeader
        title={title}
        meta={`Last updated: ${formatDate(updated)}`}
        intro={intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />

      <div className="mt-10 max-w-3xl space-y-8">
        {sections.map((section) => (
          <section
            key={section.heading}
            aria-labelledby={slugify(section.heading)}
          >
            <h2
              id={slugify(section.heading)}
              className="text-lg font-semibold tracking-tight"
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mt-3 text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        {after}
      </div>
    </div>
  );
}
