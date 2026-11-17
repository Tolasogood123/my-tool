"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { getCategory } from "@/lib/registry/categories";
import { searchTools } from "@/lib/registry/helpers";

export function QuickSearchPalette({ onSelect }: { onSelect: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => searchTools({ query }).slice(0, 20), [query]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      onSelect();
      router.push(`/tools/${results[active].slug}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-control border border-border bg-surface-muted px-3">
        <Search className="size-4 text-accent" aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a tool name or keyword…"
          aria-label="Search tools"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-subtle-foreground"
        />
      </div>

      {results.length === 0 ? (
        <p className="rounded-control border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No published tools match that search.
        </p>
      ) : (
        <ul className="scrollbar-thin max-h-80 space-y-1 overflow-auto" role="listbox">
          {results.map((tool, index) => {
            const category = getCategory(tool.category);
            return (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  onClick={onSelect}
                  role="option"
                  aria-selected={index === active}
                  data-category={tool.category}
                  onMouseEnter={() => setActive(index)}
                  className={`flex items-center gap-3 rounded-control border px-3 py-2 transition-colors ${
                    index === active
                      ? "border-accent/40 bg-accent-soft"
                      : "border-transparent hover:bg-surface-muted"
                  }`}
                >
                  <span className="cat-icon flex size-8 shrink-0 items-center justify-center rounded-[0.6rem]">
                    <ToolIcon name={tool.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {tool.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {category.name}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[11px] text-subtle-foreground">
        Use ↑ ↓ to move and Enter to open. {results.length} of {searchTools({}).length} tools shown.
      </p>
    </div>
  );
}
