import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { FavoriteButton } from "@/components/search/FavoriteButton";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { getCategory } from "@/lib/registry/categories";
import { cn } from "@/lib/utils/cn";
import type { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const category = getCategory(tool.category);

  return (
    <div
      className={cn(
        "group card-modern relative rounded-card border border-border bg-surface shadow-soft hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="flex h-full flex-col p-5"
        aria-label={`Open ${tool.title}`}
      >
        <div className="flex items-start justify-between gap-3 pr-10">
          <span className="icon-tile flex size-11 items-center justify-center rounded-[0.9rem] transition-transform duration-300 group-hover:scale-105">
            <ToolIcon name={tool.icon} />
          </span>
          {tool.status === "needs-api" ? (
            <span className="inline-flex items-center gap-1 rounded-pill border border-warning/30 bg-warning-soft px-2 py-1 text-[11px] font-semibold text-warning">
              <Radio className="size-3" aria-hidden="true" />
              Needs API
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 flex items-center gap-1.5 text-base font-semibold tracking-tight">
          {tool.title}
          <ArrowUpRight
            className="size-4 text-accent opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {tool.description}
        </p>
        <p className="mt-auto pt-5">
          <span className="inline-flex rounded-pill bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-subtle-foreground">
            {category.name}
          </span>
        </p>
      </Link>
      <div className="absolute right-4 top-4 z-10">
        <FavoriteButton slug={tool.slug} title={tool.title} />
      </div>
    </div>
  );
}
