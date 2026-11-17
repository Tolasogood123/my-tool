import { Download, Search, MousePointerClick } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    icon: Search,
    title: "Find the right tool",
    description:
      "Search by name or browse a category. Every listing is a real, finished tool.",
  },
  {
    icon: MousePointerClick,
    title: "Work in your browser",
    description:
      "Paste text or choose a file. Local tools process everything on your device.",
  },
  {
    icon: Download,
    title: "Copy or download",
    description:
      "Take the result with you. No account is needed to save or reuse your output.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface/60">
      <div className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Simple by default"
          title="How it works"
          description="Three steps, no onboarding, no email capture."
        />
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="card-modern relative rounded-card border border-border bg-surface p-6 shadow-soft"
              >
                <span className="absolute right-5 top-5 font-mono text-xs text-subtle-foreground">
                  0{index + 1}
                </span>
                <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent-soft-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
