import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why TolaDev exists, how the tools work, and how the project grows. Free online tools that run in your browser, respect your privacy, and never ask you to sign up.",
  alternates: { canonical: "/about" },
};

const facts = [
  {
    title: "Everything starts in the browser",
    body: "Whenever a task can be done with standard browser APIs, it is done there. Your images, text, and passwords are processed on your device, which keeps them private and keeps the site fast and cheap to run.",
  },
  {
    title: "No accounts, ever",
    body: "There is nothing to sign up for. Your saved favorites and theme choice live in your own browser's local storage, so you can clear them at any time.",
  },
  {
    title: "Honest status labels",
    body: "A tool only appears on this site once it is fully built and tested. Work-in-progress ideas are never shown as clickable buttons, and tools that genuinely need an external service are clearly marked.",
  },
  {
    title: "Sustainable by design",
    body: "The free tools stay free. The project plans to cover its costs with unobtrusive advertising and optional paid extras later, without ever putting the core tools behind a paywall.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        title="About TolaDev"
        intro="TolaDev is a free, all-in-one collection of online tools for students, developers, freelancers, creators, and business owners. The idea is simple: when you need to compress an image, format JSON, count words, or generate a password, you should not have to hunt across sketchy websites, watch ads before the tool loads, or create yet another account."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="mt-10 max-w-3xl space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-card border border-border bg-surface p-6 shadow-soft"
            >
              <h2 className="text-base font-semibold tracking-tight">
                {fact.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {fact.body}
              </p>
            </div>
          ))}
        </div>

        <section aria-labelledby="about-story">
          <h2
            id="about-story"
            className="text-xl font-semibold tracking-tight"
          >
            How the project grows
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            TolaDev starts with fifteen priority tools covering images,
            developer utilities, calculators, and text work. After that, the
            collection expands into documents, business, web and SEO,
            social media, and accessibility. Language support starts in English,
            with Khmer and other languages planned.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Every tool follows the same rules: it validates your input, shows
            clear errors, works on mobile, and keeps your data on your device
            unless the task genuinely requires a server — in which case the
            tool says so up front.
          </p>
        </section>
      </div>
    </div>
  );
}
