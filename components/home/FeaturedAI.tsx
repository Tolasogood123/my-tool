import { ToolCard } from "@/components/search/ToolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getFeaturedTools } from "@/lib/registry/helpers";
import { SectionHeading } from "./SectionHeading";

export function FeaturedAI() {
  const tools = getFeaturedTools(3);

  return (
    <section className="border-y border-border bg-surface/60">
      <div className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Writing helpers"
          title="Featured AI & writing tools"
          description="Writing utilities that run locally and keep your drafts private. AI-powered tools will be added with a secure server-side API and clear labeling."
          action={{ label: "Browse writing tools", href: "/category/ai-writing" }}
        />
        {tools.length === 0 ? (
          <EmptyState
            className="mt-8"
            title="Writing tools are on the way"
            description="AI features require a server-side API and careful rate limits. They will not appear until they work safely."
          />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
