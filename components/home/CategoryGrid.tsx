import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { getCategoriesWithCounts } from "@/lib/registry/helpers";
import { SectionHeading } from "./SectionHeading";

export function CategoryGrid() {
  const categories = getCategoriesWithCounts();

  return (
    <section id="categories" className="relative overflow-hidden border-y border-border/70 bg-surface/50">
      <div className="aurora opacity-40" aria-hidden="true" />
      <div className="container-page relative py-20 lg:py-24">
        <SectionHeading
          eyebrow="Browse"
          title="Find a tool by category"
          description="Thirteen focused categories, from image editing to security. Empty categories are honestly marked as coming soon."
          action={{ label: "View every tool", href: "/tools" }}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              data-category={category.id}
              href={`/category/${category.id}`}
              className="group card-modern flex items-start gap-3 rounded-card border border-border bg-surface p-5 shadow-soft"
            >
              <span className="cat-icon flex size-11 shrink-0 items-center justify-center rounded-[0.9rem] transition-transform duration-300 group-hover:scale-105">
                <ToolIcon name={category.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{category.name}</span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-subtle-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {category.description}
                </span>
                <span className="mt-2 inline-flex rounded-pill bg-surface-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-soft-foreground">
                  {category.count === 0
                    ? "Coming soon"
                    : `${category.count} ${category.count === 1 ? "tool" : "tools"}`}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
