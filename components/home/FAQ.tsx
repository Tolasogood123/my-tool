import { homeFaqs } from "@/lib/faq";
import { SectionHeading } from "./SectionHeading";

export function FAQ() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked"
          description="Straight answers about privacy, pricing, and what is actually available today."
        />
        <div className="divide-subtle rounded-card border border-border bg-surface shadow-soft">
          {homeFaqs.map((faq) => (
            <details key={faq.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-lg leading-none text-subtle-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
