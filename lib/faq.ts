export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaqs: FaqItem[] = [
  {
    q: "Is TolaDev really free?",
    a: "Yes. Every tool listed as ready is free to use with no account, no watermark, and no daily limit. The site is supported by unobtrusive advertising once AdSense is enabled, and optional premium features may be added later without removing the free tools.",
  },
  {
    q: "Do you upload my files or text?",
    a: "No. Tools are built to run in your browser whenever the format allows. Images, text, JSON, and passwords are processed locally. If a tool needs an external service, it is clearly marked as requiring an API instead of silently uploading your data.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required. Favorites are stored in your browser's local storage, so they stay on your device and are never tied to an email address.",
  },
  {
    q: "Do the tools work on mobile?",
    a: "Yes. Pages are responsive and the tools are tested on narrow screens. Some heavy file operations are limited by your device's memory, so the interface reports clear errors instead of freezing.",
  },
  {
    q: "Can I use the results commercially?",
    a: "You own what you create with the tools. There are no watermarks or license traps. Check the terms of any third-party content you process, since that is outside our control.",
  },
  {
    q: "Will more tools be added?",
    a: "Yes. New tools are added as they are fully built and tested. Planned tools are not listed with fake buttons, and empty categories say so honestly.",
  },
];
