import type { Metadata } from "next";
import { Clock, Mail, MessageSquare, ShieldQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach the TolaDev team by email: report a bug, suggest a tool, or ask a question about the free online tools.",
  alternates: { canonical: "/contact" },
};

const reasons = [
  {
    icon: MessageSquare,
    title: "Suggest a tool",
    body: "Tell us what you were trying to do and what tool would have helped. Real workflows decide what gets built next.",
  },
  {
    icon: ShieldQuestion,
    title: "Report a problem",
    body: "Describe the tool, what you entered, and what went wrong. A screenshot and the browser you used make bugs much easier to fix.",
  },
  {
    icon: Clock,
    title: "Ask a question",
    body: "Questions about privacy, licensing, or how a tool calculates its results are always welcome.",
  },
];

export default function ContactPage() {
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent("TolaDev feedback")}`;

  return (
    <div className="container-page py-12 lg:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        title="Contact"
        intro="There is no support desk or ticket system here — just a person reading email. Reach out for tool suggestions, bug reports, or anything you are curious about."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="mt-10 max-w-3xl space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-card border border-border bg-surface p-6 shadow-soft"
            >
              <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent-soft-foreground">
                <reason.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-base font-semibold tracking-tight">
                {reason.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {reason.body}
              </p>
            </div>
          ))}
        </div>

        <section
          aria-labelledby="contact-email"
          className="rounded-card border border-border bg-surface p-8 shadow-card"
        >
          <h2 id="contact-email" className="text-xl font-semibold tracking-tight">
            Email is the fastest way
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Write to{" "}
            <a
              href={mailto}
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              {SITE.email}
            </a>{" "}
            and you will normally get a reply within two business days. This
            page intentionally shows no contact form, because a form that only
            pretends to send messages would waste your time.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <Mail className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
            <span>
              When you report a bug, include the tool name, the steps you took,
              and your browser and device. It saves a round trip.
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
