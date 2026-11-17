import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  intro?: string;
  /** Small factual line under the intro, e.g. "Last updated: 2026-11-17". */
  meta?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  intro,
  meta,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {intro}
        </p>
      ) : null}
      {meta ? (
        <p className="mt-3 text-sm font-medium text-subtle-foreground">
          {meta}
        </p>
      ) : null}
    </header>
  );
}
