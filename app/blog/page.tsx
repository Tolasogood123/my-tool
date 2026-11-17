import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSortedBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides from the TolaDev team: compressing images, working with text and data, and getting more out of free online tools.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getSortedBlogPosts();

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        title="Blog"
        intro="Short, practical guides for the tasks these tools solve. Every guide is written for the site and tested against real workflows — no filler, no scraped content."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      {posts.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No guides published yet"
          description="Guides appear here as soon as they are written and checked. Nothing is listed before it exists."
        />
      ) : (
        <ul className="mt-10 max-w-3xl space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-card border border-border bg-surface p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-subtle-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {post.readingMinutes} min read
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill border border-border px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {post.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read the guide
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
