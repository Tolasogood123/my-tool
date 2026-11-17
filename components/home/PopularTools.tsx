import { ToolCard } from "@/components/search/ToolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPopularTools } from "@/lib/registry/helpers";
import { SectionHeading } from "./SectionHeading";

export function PopularTools() {
  const tools = getPopularTools(8);

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Most used"
        title="Popular tools, ready right now"
        description="The tools people reach for most often. Every one runs in your browser and works without an account."
        action={{ label: "Explore all tools", href: "/tools" }}
      />
      {tools.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Tools are being finished"
          description="The first batch of tools is in final testing. Nothing is listed until it actually works."
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
