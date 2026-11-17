"use client";

import { RotateCcw, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/search/ToolCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { categories } from "@/lib/registry/categories";
import { searchTools } from "@/lib/registry/helpers";
import type { SortKey } from "@/lib/registry/helpers";
import type { CategoryId } from "@/types/category";

interface ToolSearchProps {
  fixedCategory?: CategoryId;
}

export function ToolSearch({ fixedCategory }: ToolSearchProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [category, setCategory] = useState<CategoryId | "all">(
    fixedCategory ?? "all",
  );
  const [sort, setSort] = useState<SortKey>("popular");
  const debouncedQuery = useDebounce(query, 200);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const results = useMemo(
    () =>
      searchTools({
        query: debouncedQuery,
        category: fixedCategory ?? category,
        sort,
      }),
    [debouncedQuery, category, fixedCategory, sort],
  );

  const hasFilters = query.trim() !== "" || (!fixedCategory && category !== "all");

  const reset = () => {
    setQuery("");
    if (!fixedCategory) setCategory("all");
    setSort("popular");
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="tool-search" className="sr-only">
            Search tools
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground"
            aria-hidden="true"
          />
          <Input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or keyword, for example: json, image, password"
            className="h-11 pl-10 pr-10"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {!fixedCategory ? (
          <div className="flex items-center gap-3">
            <label htmlFor="tool-category" className="sr-only">
              Filter by category
            </label>
            <Select
              id="tool-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryId | "all")
              }
              className="h-11 min-w-44"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <label htmlFor="tool-sort" className="sr-only">
            Sort tools
          </label>
          <Select
            id="tool-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-11 min-w-40"
          >
            <option value="popular">Most popular</option>
            <option value="az">A to Z</option>
            <option value="newest">Newest</option>
          </Select>
          {hasFilters ? (
            <Button variant="ghost" onClick={reset} className="h-11">
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-muted-foreground">
        {results.length === 0
          ? "No tools found"
          : `Showing ${results.length} ${results.length === 1 ? "tool" : "tools"}`}
      </p>

      {results.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="No tools match that search"
          description="Try a different keyword, choose another category, or reset the filters. Only finished tools are shown."
          action={
            <Button variant="outline" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
