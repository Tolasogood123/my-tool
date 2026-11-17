import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What TolaDev's free tools are and are not: informational accuracy, professional advice limits, third-party links, and advertising transparency.",
  alternates: { canonical: "/disclaimer" },
};

const UPDATED = "2026-11-17";

const sections = [
  {
    heading: "General information only",
    paragraphs: [
      "All tools and articles on TolaDev are provided for general informational and productivity purposes. They are not a substitute for professional advice. In particular, calculators on this site do not provide financial, tax, legal, medical, or academic-admission advice.",
    ],
  },
  {
    heading: "Accuracy of calculations",
    paragraphs: [
      "Each calculator documents the exact formula it uses so you can verify results by hand. Formulas follow common conventions (for example, standard US-style GPA points and civil age counting), but institutions and countries may use different rules. Always check important figures — a grade, a discount, a deadline — against the official source that applies to you.",
    ],
  },
  {
    heading: "Your files and content",
    paragraphs: [
      "Browser-based tools process files on your device. We never see them, but we also cannot recover a file or a result for you after you leave the page. Keep your own copies, and treat generated passwords and identifiers as things you must save yourself.",
    ],
  },
  {
    heading: "External links",
    paragraphs: [
      "Articles and tool pages may link to external websites. We have no control over their content, availability, or privacy practices, and a link is not an endorsement of everything on the destination site.",
    ],
  },
  {
    heading: "Advertising",
    paragraphs: [
      "When advertising is enabled it will be clearly separated from tool interfaces and editorial content, and sponsored placements will be identified. Ads never influence how a tool works or what a guide recommends.",
    ],
  },
  {
    heading: "Tools marked as needing an external service",
    paragraphs: [
      "Some planned tools depend on external APIs or server capacity. Those are labeled in advance and are not shown as working until they genuinely work. No tool on this site fakes results.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `If something on the site is factually wrong, please tell us at ${SITE.email} and we will correct it.`,
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated={UPDATED}
      intro="What our tools and guides are, what they are not, and where their limits are. Short, specific, and updated as the site grows."
      sections={sections}
    />
  );
}
