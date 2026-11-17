import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/tool/AdSlot";
import { RecordRecentTool } from "@/components/tool/RecordRecentTool";
import { ToolActions } from "@/components/tool/ToolActions";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/search/ToolCard";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/search/FavoriteButton";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { getCategory } from "@/lib/registry/categories";
import { getRelated } from "@/lib/registry/helpers";
import { breadcrumbJsonLd, faqJsonLd, toolJsonLd } from "@/lib/seo/jsonld";
import type { Tool } from "@/types/tool";

interface ToolShellProps {
  tool: Tool;
  children: ReactNode;
}

export function ToolShell({ tool, children }: ToolShellProps) {
  const category = getCategory(tool.category);
  const related = getRelated(tool);

  return (
    <div className="container-page pb-28 pt-10 sm:pb-14 lg:pt-14" data-category={tool.category}>
      <JsonLd
        data={[
          toolJsonLd(tool),
          faqJsonLd(tool.content.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: tool.title, path: `/tools/${tool.slug}` },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: category.name, href: `/category/${category.id}` },
          { label: tool.title },
        ]}
      />

      <RecordRecentTool slug={tool.slug} />

      <header className="mt-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="cat-icon flex size-12 items-center justify-center rounded-card">
            <ToolIcon name={tool.icon} className="size-6" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge category={tool.category} dot>
              {category.name}
            </Badge>
            {tool.status === "needs-api" ? (
              <Badge variant="warning">
                <Radio className="size-3" aria-hidden="true" />
                Needs API
              </Badge>
            ) : (
              <Badge variant="success">Runs in browser</Badge>
            )}
          </div>
          <FavoriteButton
            slug={tool.slug}
            title={tool.title}
            className="ml-auto size-11"
          />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {tool.description}
        </p>
      </header>

      <section aria-label={`${tool.title} workspace`} className="mt-8">
        <div className="rounded-card border border-border bg-surface p-4 shadow-soft sm:p-6">
          {children}
        </div>
      </section>

      <AdSlot
        slotId={tool.slug}
        className="mt-8 min-h-[90px] rounded-card border border-dashed border-border"
        label="Advertisement"
      />

      <div className="mt-12 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          <section aria-labelledby="about-tool">
            <h2 id="about-tool" className="text-xl font-semibold tracking-tight">
              What is {tool.title}?
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {tool.content.what}
            </p>
          </section>

          <section aria-labelledby="how-to">
            <h2 id="how-to" className="text-xl font-semibold tracking-tight">
              How to use it
            </h2>
            <ol className="mt-4 space-y-3">
              {tool.content.howTo.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-soft-foreground">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="example">
            <h2 id="example" className="text-xl font-semibold tracking-tight">
              Example
            </h2>
            <p className="mt-3 rounded-card border border-border bg-surface-muted p-5 text-sm leading-7 text-muted-foreground">
              {tool.content.example}
            </p>
          </section>

          <section aria-labelledby="benefits">
            <h2 id="benefits" className="text-xl font-semibold tracking-tight">
              Why use it
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {tool.content.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-control border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faqs">
            <h2 id="faqs" className="text-xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
              {tool.content.faqs.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside aria-labelledby="related-tools" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 id="related-tools" className="text-lg font-semibold tracking-tight">
              Related tools
            </h2>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              All tools
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {related.length > 0 ? (
            <div className="grid gap-3">
              {related.map((item) => (
                <ToolCard key={item.slug} tool={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-border bg-surface p-5 text-sm text-muted-foreground">
              More tools in this category are being built.
            </p>
          )}
        </aside>
      </div>

      <ToolActions slug={tool.slug} title={tool.title} />
    </div>
  );
}
