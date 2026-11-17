import { ToolCard } from "@/components/search/ToolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getRecentTools } from "@/lib/registry/helpers";
import { SectionHeading } from "./SectionHeading";

export function RecentTools() {
  const tools = getRecentTools(4);

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Fresh additions"
        title="Recently added"
        description="New tools appear here after they pass testing. No placeholder buttons, no fake results."
      />
      {tools.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Nothing new to show yet"
          description="New tools will appear here as soon as they are finished and checked."
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
