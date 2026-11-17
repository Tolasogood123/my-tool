"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export function FavoriteButton({ slug, title, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const active = ready && isFavorite(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-control border border-border bg-surface/90 text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground",
        active && "border-accent/30 bg-accent-soft text-accent-soft-foreground",
        className,
      )}
    >
      <Heart
        className={cn("size-4", active && "fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}
