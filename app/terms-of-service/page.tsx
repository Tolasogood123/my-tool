import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using TolaDev's free online tools: what you may do with the results, what the service does not promise, and how disputes are handled.",
  alternates: { canonical: "/terms-of-service" },
};

const UPDATED = "2026-11-17";

const sections = [
  {
    heading: "Accepting these terms",
    paragraphs: [
      "By using TolaDev you agree to these terms. If you do not agree, please do not use the site. We may update these terms as the service grows; the updated date at the top shows the current version.",
    ],
  },
  {
    heading: "What the service is",
    paragraphs: [
      "TolaDev provides free browser-based tools plus information about them. Most tools process your input entirely on your device. Tools that depend on an external service are labeled before use. The service is provided in English, with other languages planned.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: [
      "Use the tools for lawful purposes only. Do not attempt to disrupt the service, bypass rate limits on server-dependent tools, reverse engineer it into a competing copy through automated scraping, or use it to process content you have no right to process.",
    ],
  },
  {
    heading: "Your content and results",
    paragraphs: [
      "You keep all rights to the files and text you process and to the results the tools produce. There are no watermarks and no license claims from us. You are responsible for making sure you have the rights to any content you feed into a tool.",
    ],
  },
  {
    heading: "No warranty",
    paragraphs: [
      "The tools are provided \u201cas is\u201d and \u201cas available\u201d. We work hard to make calculations and conversions correct, and each tool documents how its results are produced, but we do not promise the output is error-free or fit for a particular purpose. Verify important results before relying on them — for example, check grade, tax, or pricing calculations against your own figures.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, TolaDev and its operators are not liable for indirect, incidental, or consequential damages, loss of data, or loss of profit arising from use of the site, even if advised of the possibility. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    heading: "Availability",
    paragraphs: [
      "The site may be unavailable for maintenance or reasons outside our control, and individual tools may change or be retired. There is no guaranteed service level for a free service.",
    ],
  },
  {
    heading: "Advertising and affiliate relationships",
    paragraphs: [
      "Advertising is planned and will be clearly distinguishable from content. If affiliate links are added in the future, they will be labeled. Advertising never changes how a tool computes results.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `Questions about these terms can be sent to ${SITE.email}.`,
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated={UPDATED}
      intro="Plain-language terms for using TolaDev. The goal is a fair deal: free tools, honest labels, and clear limits of responsibility."
      sections={sections}
    />
  );
}
