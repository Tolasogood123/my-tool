import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolLoader } from "@/components/tool/ToolLoader";
import { ToolShell } from "@/components/tool/ToolShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { getPublishedTool } from "@/lib/registry/helpers";
import { publishedTools } from "@/lib/registry/helpers";
import { pageMetadata } from "@/lib/seo/metadata";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

/** Only finished tools get a dedicated, indexable page. */
export function generateStaticParams() {
  return publishedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPublishedTool(slug);

  if (!tool) {
    return {};
  }

  return pageMetadata({
    title: tool.title,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}

export default function ToolPage({ params }: ToolPageProps) {
  return (
    <Suspense fallback={<ToolPageSkeleton />}>
      <ToolPageContent params={params} />
    </Suspense>
  );
}

function ToolPageSkeleton() {
  return (
    <div className="container-page py-14" aria-label="Loading tool">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="mt-6 h-10 w-80 max-w-full" />
      <Skeleton className="mt-4 h-16 w-full max-w-2xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

async function ToolPageContent({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getPublishedTool(slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolShell tool={tool}>
      <ToolLoader slug={tool.slug} />
    </ToolShell>
  );
}
