import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Hourglass } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolSearch } from "@/components/search/ToolSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { SITE } from "@/constants/site";
import { categoryIds, categories, getCategory, isCategoryId } from "@/lib/registry/categories";
import { getToolsByCategory } from "@/lib/registry/helpers";
import { buttonClassName } from "@/components/ui/Button";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: id } = await params;

  if (!isCategoryId(id)) {
    return {};
  }

  const category = getCategory(id);
  const count = getToolsByCategory(id).length;
  const description =
    count > 0
      ? `Free ${category.name.toLowerCase()} tools on TolaDev. ${category.description} Process in your browser where possible, with no sign-up.`
      : `${category.name} tools are in progress on TolaDev. ${category.description} New tools appear here as soon as they are fully tested.`;

  return {
    title: `${category.name} Tools`,
    description,
    alternates: { canonical: `/category/${category.id}` },
    openGraph: {
      title: `${category.name} Tools | ${SITE.name}`,
      description,
    },
  };
}

function SearchSkeleton() {
  return (
    <div
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-44" />
      ))}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className="container-page py-16" aria-label="Loading category">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="mt-6 size-12 rounded-card" />
      <Skeleton className="mt-5 h-10 w-80 max-w-full" />
      <Skeleton className="mt-4 h-20 w-full max-w-2xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-44" />
        ))}
      </div>
    </div>
  );
}

async function CategoryPageContent({ params }: CategoryPageProps) {
  const { category: id } = await params;

  if (!isCategoryId(id)) {
    notFound();
  }

  const category = getCategory(id);
  const categoryTools = getToolsByCategory(id);
  const count = categoryTools.length;
  const otherCategories = categories.filter((item) => item.id !== category.id);

  return (
    <div className="container-page py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: category.name },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <span className="flex size-12 items-center justify-center rounded-card bg-accent-soft text-accent-soft-foreground">
          <ToolIcon name={category.icon} className="size-6" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {category.name} Tools
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {category.intro}
        </p>
        <p className="mt-3 text-sm font-medium text-subtle-foreground">
          {count === 0
            ? "No tools in this category yet — new tools are added as soon as they are fully tested."
            : `${count} ${count === 1 ? "tool" : "tools"} in this category.`}
        </p>
      </header>

      <div className="mt-8">
        {count > 0 ? (
          <Suspense fallback={<SearchSkeleton />}>
            <ToolSearch fixedCategory={category.id} />
          </Suspense>
        ) : (
          <EmptyState
            className="mt-2"
            icon={Hourglass}
            title="Tools coming soon"
            description={`Nothing in ${category.name} is ready to use yet, so nothing is listed here. The first tools for this category will appear on this page as soon as they pass testing.`}
            action={
              <Link href="/tools" className={buttonClassName({})}>
                Browse all available tools
              </Link>
            }
          />
        )}
      </div>

      <section aria-labelledby="other-categories" className="mt-14">
        <h2
          id="other-categories"
          className="text-lg font-semibold tracking-tight"
        >
          Explore other categories
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {otherCategories.map((item) => (
            <li key={item.id}>
              <Link
                href={`/category/${item.id}`}
                className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
