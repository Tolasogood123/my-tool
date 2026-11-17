import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="eyebrow">{eyebrow}</span>
        ) : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-3 h-px w-16 rounded-full bg-linear-to-r from-accent to-accent-2" aria-hidden="true" />
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-card"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
