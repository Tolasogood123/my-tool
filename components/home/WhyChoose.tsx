import {
  BadgeCheck,
  Gauge,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Privacy first",
    description:
      "Files and text are processed in your browser. Nothing is uploaded, logged, or saved on a server for the tools that run locally.",
  },
  {
    icon: Gauge,
    title: "Fast by design",
    description:
      "No waiting for uploads or a queue. Client-side tools start working the moment you paste or drop a file.",
  },
  {
    icon: BadgeCheck,
    title: "Honest labels",
    description:
      "A tool that needs an external API is marked as such. We never show a working-looking button with a fake result behind it.",
  },
  {
    icon: HeartHandshake,
    title: "Free without tricks",
    description:
      "No sign-up wall, no watermarks, and no daily limit for standard use. The free tools stay free.",
  },
];

export function WhyChoose() {
  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Why TolaDev"
        title="Built for people who get things done"
        description="A small, focused set of tools that behave the way you expect: quickly, privately, and without nagging."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {reasons.map((reason) => {
          const Icon = reason.icon;
          return (
            <div
              key={reason.title}
              className="card-modern rounded-card border border-border bg-surface p-6 shadow-soft"
            >
              <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent-soft-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{reason.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
