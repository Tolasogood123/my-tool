import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data TolaDev collects (almost nothing), what stays in your browser, and how advertising and third-party services are handled once they are enabled.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "2026-11-17";

const sections = [
  {
    heading: "The short version",
    paragraphs: [
      "The tools on TolaDev run in your browser. Files you compress, text you convert, and passwords you generate are processed on your own device and are never transmitted to us. We do not require accounts, we do not sell data, and we do not build profiles about you.",
    ],
  },
  {
    heading: "What we do not collect",
    paragraphs: [
      "We do not receive, store, or view the files and text you process with the browser-based tools. Uploaded files never leave your device, because there is no upload step. We do not ask for your name, email address, or payment details to use any tool.",
    ],
  },
  {
    heading: "What stays in your browser",
    paragraphs: [
      "Two small pieces of information are stored in your browser's local storage: your saved tool favorites and your light or dark theme preference. This data stays on your device, is never sent to any server, and disappears if you clear your browser storage.",
    ],
  },
  {
    heading: "What web servers normally see",
    paragraphs: [
      "Like almost every website, our hosting provider records standard technical information for each request, such as your IP address, browser type, and the pages you visit. This is used for security and for aggregate traffic statistics, and we do not use it to track you across other websites.",
    ],
  },
  {
    heading: "Advertising",
    paragraphs: [
      "TolaDev plans to display Google AdSense advertising to cover hosting costs. Ad slots are disabled until a publisher account is connected, and no ad scripts load before then. Once advertising is active, Google may use cookies to show personalized ads. You can control ad personalization in your Google settings, and this page will be updated with the exact details before any ad code goes live.",
    ],
  },
  {
    heading: "Third-party services",
    paragraphs: [
      "Some tools genuinely require an external service. Those tools are clearly marked in the interface before you use them, and this policy will describe the specific service and what it receives before such a tool is enabled.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "TolaDev is a general-audience site and is not directed at children under 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If this policy changes in a way that matters — for example, when advertising is switched on — the updated date at the top of this page will change and the changes will be described here.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `Questions about privacy can be sent to ${SITE.email}. A human reads every message.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro="This policy explains what data TolaDev collects and what it deliberately does not. It is written to be read, not to hide behind."
      sections={sections}
    />
  );
}
