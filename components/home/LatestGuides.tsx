import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { getSortedBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils/format";
import { SectionHeading } from "./SectionHeading";

export function LatestGuides() {
  const posts = getSortedBlogPosts().slice(0, 2);

  return (
    <section className="border-t border-border">
      <div className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Learn"
          title="Latest guides"
          description="Practical writing about the tools, formats, and habits behind faster work."
          action={{ label: "Visit the blog", href: "/blog" }}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group card-modern flex flex-col rounded-card border border-border bg-surface p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-subtle-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" aria-hidden="true" />
                  Guide
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {post.readingMinutes} min read
                </span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
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
          ))}
        </div>
      </div>
    </section>
  );
}
