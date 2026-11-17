import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolSearch } from "@/components/search/ToolSearch";
import { Skeleton } from "@/components/ui/Skeleton";
import { getToolCount } from "@/lib/registry/helpers";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse every free tool on TolaDev: search by name or keyword, filter by category, and sort by popularity. Only finished tools are listed, and browser-based tools never upload your files.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `All Tools | ${SITE.name}`,
    description:
      "Browse every free tool on TolaDev: search by name or keyword, filter by category, and sort by popularity.",
  },
};

function SearchSkeleton() {
  return (
    <div
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-44" />
      ))}
    </div>
  );
}

export default function AllToolsPage() {
  const count = getToolCount();

  return (
    <div className="container-page py-12 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          All Tools
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Every finished tool in the TolaDev collection, in one list. Search by
          name or keyword, filter by category, and sort the way you like. Tools
          that run in your browser keep your files on your device, and tools
          that need an external service are clearly marked.
        </p>
        <p className="mt-3 text-sm font-medium text-subtle-foreground">
          {count === 0
            ? "Tools are being prepared and will appear here as soon as they are ready."
            : `${count} ${count === 1 ? "tool" : "tools"} available, with more in progress.`}
        </p>
      </header>

      <div className="mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <ToolSearch />
        </Suspense>
      </div>
    </div>
  );
}
