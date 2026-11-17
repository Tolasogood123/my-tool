"use client";

import { Clock3, Heart, X } from "lucide-react";
import Link from "next/link";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyUsed } from "@/hooks/useRecentlyUsed";
import { getPublishedTool } from "@/lib/registry/helpers";
import type { Tool } from "@/types/tool";

interface PersonalRowProps {
  kind: "recent" | "favorites";
}

/** Hidden entirely when there is nothing to show. Never renders fake items. */
export function PersonalRow({ kind }: PersonalRowProps) {
  const { recent, ready: recentReady } = useRecentlyUsed();
  const { favorites, toggleFavorite, ready: favReady } = useFavorites();
  const slugs = kind === "recent" ? recent : favorites;
  const ready = kind === "recent" ? recentReady : favReady;
  const tools: Tool[] = ready
    ? slugs
        .map((slug) => getPublishedTool(slug))
        .filter((tool): tool is Tool => Boolean(tool))
        .slice(0, 8)
    : [];

  if (tools.length === 0) return null;

  const isRecent = kind === "recent";

  return (
    <section className="container-page py-6" aria-labelledby={`personal-${kind}`}>
      <h2
        id={`personal-${kind}`}
        className="flex items-center gap-2 text-sm font-semibold"
      >
        {isRecent ? (
          <Clock3 className="size-4 text-accent" aria-hidden="true" />
        ) : (
          <Heart className="size-4 text-accent" aria-hidden="true" />
        )}
        {isRecent ? "Recently used" : "Your favorites"}
        <span className="rounded-pill bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          on this device
        </span>
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <li
            key={tool.slug}
            data-category={tool.category}
            className="card-lift flex items-center gap-2 rounded-control border border-border bg-surface py-1.5 pl-1.5 pr-2 shadow-soft"
          >
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-2 rounded-control text-sm font-medium"
            >
              <span className="cat-icon flex size-7 items-center justify-center rounded-[0.5rem]">
                <ToolIcon name={tool.icon} className="size-3.5" />
              </span>
              {tool.title}
            </Link>
            {!isRecent ? (
              <button
                type="button"
                onClick={() => toggleFavorite(tool.slug)}
                aria-label={`Remove ${tool.title} from favorites`}
                className="inline-flex size-6 items-center justify-center rounded-control text-subtle-foreground hover:bg-surface-muted hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
