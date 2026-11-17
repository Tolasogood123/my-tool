import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Skeleton } from "@/components/ui/Skeleton";
import { getBlogPost, getSortedBlogPosts, blogPosts } from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/format";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="container-page py-16" aria-label="Loading guide">
      <Skeleton className="h-5 w-52" />
      <Skeleton className="mt-7 h-10 w-full max-w-2xl" />
      <Skeleton className="mt-4 h-16 w-full max-w-xl" />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const morePosts = getSortedBlogPosts().filter((item) => item.slug !== slug);

  return (
    <div className="container-page py-12 lg:py-16">
      <JsonLd
        data={articleJsonLd(post)}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl">
        <PageHeader
          title={post.title}
          intro={post.description}
          meta={post.tags.map((tag) => `#${tag}`).join("  ")}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-subtle-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readingMinutes} min read
          </span>
        </div>

        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-a:text-accent prose-a:font-medium prose-a:underline-offset-4
            prose-code:rounded prose-code:bg-surface-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:hidden prose-code:after:hidden
            prose-pre:bg-surface-muted prose-pre:text-foreground
            prose-strong:font-semibold"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {morePosts.length > 0 ? (
        <aside aria-labelledby="more-guides" className="mx-auto mt-14 max-w-3xl">
          <h2 id="more-guides" className="text-lg font-semibold tracking-tight">
            More guides
          </h2>
          <ul className="mt-4 space-y-3">
            {morePosts.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="flex flex-col gap-1 rounded-card border border-border bg-surface p-5 shadow-soft transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs font-medium text-subtle-foreground">
                    {formatDate(item.date)} · {item.readingMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
