import { getToolCount } from "@/lib/registry/helpers";
import { categories } from "@/lib/registry/categories";
import { publishedTools } from "@/lib/registry/helpers";

/** All numbers are computed from the real registry — no fabricated stats. */
export function StatsStrip() {
  const totalTools = getToolCount();
  const categoryCount = categories.length;
  const browserBased = publishedTools.filter((tool) => tool.status === "ready").length;

  const stats = [
    { label: "Free tools", value: totalTools },
    { label: "Categories", value: categoryCount },
    { label: "Run in your browser", value: browserBased },
  ];

  return (
    <section aria-label="TolaDev at a glance" className="border-y border-border/70 bg-surface/60">
      <div className="container-page">
        <dl className="grid divide-y divide-border/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-8 text-center">
              <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-widest text-subtle-foreground sm:order-1">
                {stat.label}
              </dt>
              <dd className="order-1 text-3xl font-bold tabular-nums tracking-tight text-accent sm:order-2 sm:mt-1">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
