import type { Metadata } from "next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DesignShowcase } from "./DesignShowcase";

export const metadata: Metadata = {
  title: "Design System",
  description: "Internal design token preview for TolaDev.",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Background", className: "bg-background", token: "--background" },
  { name: "Surface", className: "bg-surface", token: "--surface" },
  { name: "Surface muted", className: "bg-surface-muted", token: "--surface-muted" },
  { name: "Foreground", className: "bg-foreground", token: "--foreground" },
  { name: "Muted text", className: "bg-muted-foreground", token: "--muted-foreground" },
  { name: "Border", className: "bg-border", token: "--border" },
  { name: "Accent", className: "bg-accent", token: "--accent" },
  { name: "Accent soft", className: "bg-accent-soft", token: "--accent-soft" },
  { name: "Success", className: "bg-success", token: "--success" },
  { name: "Warning", className: "bg-warning", token: "--warning" },
  { name: "Danger", className: "bg-danger", token: "--danger" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Temporary page
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            TolaDev design system
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Preview of the color tokens, typography, radii, shadows, and spacing
            that power every page. Use the toggle to check both themes.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Section
        title="Color tokens"
        description="One indigo/violet accent, cool neutral surfaces, and clear status colors."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.token}
              className="rounded-card border border-border bg-surface p-3 shadow-soft"
            >
              <div
                className={`h-16 w-full rounded-control border border-border ${color.className}`}
              />
              <p className="mt-3 text-sm font-medium">{color.name}</p>
              <p className="font-mono text-xs text-subtle-foreground">
                {color.token}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="Plus Jakarta Sans for interface text, JetBrains Mono for code."
      >
        <div className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Eyebrow label
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need. One place.
          </h2>
          <h3 className="text-2xl font-semibold tracking-tight">
            Section heading
          </h3>
          <h4 className="text-lg font-semibold">Card heading</h4>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Body copy is set with generous line height for comfortable reading.
            Interface text stays calm and legible on every screen size.
          </p>
          <p className="text-sm text-subtle-foreground">
            Small helper text for hints, captions, and metadata.
          </p>
          <code className="inline-block rounded-control bg-surface-muted px-3 py-1.5 font-mono text-sm">
            const total = price * quantity;
          </code>
        </div>
      </Section>

      <Section
        title="Radii and shadows"
        description="Soft corners and low-contrast elevation keep the interface premium."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "rounded-control", className: "rounded-control" },
            { name: "rounded-card", className: "rounded-card" },
            { name: "rounded-pill", className: "rounded-pill" },
          ].map((radius) => (
            <div
              key={radius.name}
              className={`border border-border bg-surface p-6 shadow-card ${radius.className}`}
            >
              <p className="text-sm font-medium">{radius.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Card surface with shadow
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["shadow-soft", "shadow-card", "shadow-pop"].map((shadow) => (
            <div
              key={shadow}
              className={`rounded-control border border-border bg-surface p-6 ${shadow}`}
            >
              <p className="font-mono text-sm">{shadow}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Spacing"
        description="A 4px base scale with a generous section rhythm."
      >
        <div className="space-y-2">
          {[1, 2, 3, 4, 6, 8, 12, 16].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-14 font-mono text-xs text-muted-foreground">
                {step * 4}px
              </span>
              <div
                className="h-3 rounded-pill bg-accent"
                style={{ width: `${step * 4}px` }}
              />
            </div>
          ))}
        </div>
      </Section>

      <DesignShowcase />
    </div>
  );
}
