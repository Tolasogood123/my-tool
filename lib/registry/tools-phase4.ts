import type { Tool } from "@/types/tool";

/**
 * Phase 4 AI tools. These are marked `needs-api`: the secure server route
 * exists, but no provider key is configured on this deployment, so the
 * interface clearly states that they do not work yet.
 */
export const phase4Tools: Tool[] = [
  {
    slug: "ai-writing-assistant",
    title: "AI Writing Assistant",
    description:
      "Rewrite a paragraph more clearly with a hosted language model. Secure server route, rate limits, and no key in the browser — currently needs an API key to work.",
    category: "ai-writing",
    keywords: ["ai writing assistant", "rewrite text ai", "paraphrase tool", "improve writing", "ai editor"],
    icon: "PenLine",
    status: "needs-api",
    popularity: 85,
    addedAt: "2026-11-17",
    related: ["ai-summarizer", "text-case-converter", "word-counter"],
    content: {
      what: "The AI Writing Assistant sends your text to a hosted language model through TolaDev's server route, which keeps the provider key off your device. You can choose a tone and receive a rewritten version. This tool is marked as needing an API because the deployment has no provider key configured yet, so it does not generate results at the moment.",
      howTo: [
        "Check the notice at the top of the tool: it tells you whether the AI service is configured.",
        "Once a key is configured, paste the text you want to improve.",
        "Choose a tone, such as clear, professional, or friendly.",
        "Click Rewrite, review the result, and copy it if useful.",
      ],
      example:
        "A freelancer pastes a rough paragraph about a project, chooses the professional tone, and gets a cleaner version to use in a client email.",
      benefits: [
        "Provider keys stay on the server and never reach the browser.",
        "Rate limits and input caps protect the service from abuse.",
        "Clear status notice instead of a silently broken button.",
        "Your original text stays in the form unless you submit it.",
      ],
      faqs: [
        {
          q: "Why does this tool say it is not working?",
          a: "Hosted AI needs a provider API key. This deployment has no key set, so the tool explains that instead of inventing output. The site owner can enable it by setting OPENAI_API_KEY in the server environment.",
        },
        {
          q: "Is my text uploaded?",
          a: "If you press the generate button while the service is configured, the text you entered is sent to the configured AI provider for processing. TolaDev does not store it. Read the privacy policy before submitting sensitive material.",
        },
        {
          q: "Are there usage limits?",
          a: "Yes. The server route limits each address to a small number of requests per hour and caps input length and output tokens. These limits can be adjusted by the site owner.",
        },
      ],
    },
  },
  {
    slug: "ai-summarizer",
    title: "AI Summarizer",
    description:
      "Condense long text with a hosted language model through a secure, rate-limited server route. Honestly marked needs-api until a provider key is configured.",
    category: "ai-writing",
    keywords: ["ai summarizer", "summarize text ai", "article summarizer", "text summary tool", "ai brief"],
    icon: "Sparkles",
    status: "needs-api",
    popularity: 82,
    addedAt: "2026-11-17",
    related: ["ai-writing-assistant", "word-counter", "keyword-density-checker"],
    content: {
      what: "The AI Summarizer asks a hosted language model for a faithful summary of your text, in the same language you supplied. The request goes through TolaDev's server route with rate limiting and input caps. No provider key is configured here, so the tool is clearly labeled as not working yet rather than returning made-up summaries.",
      howTo: [
        "Read the API notice at the top of the page.",
        "When a key is configured, paste the article or report you want condensed.",
        "Pick a summary length: a few sentences, one paragraph, or detailed bullets.",
        "Generate the summary and check it against the source before sharing.",
      ],
      example:
        "A researcher pastes a two-page article, chooses one paragraph, and gets a short brief to include in a team update.",
      benefits: [
        "Summaries keep the original language and avoid invented facts.",
        "Three length options for different reading contexts.",
        "Server-side key handling and per-address rate limits.",
        "Honest status notice while the service is unavailable.",
      ],
      faqs: [
        {
          q: "Can I summarize very long documents?",
          a: "The tool caps input at 8,000 characters per request. Split longer documents into sections and summarize each one separately.",
        },
        {
          q: "Will the summary be accurate?",
          a: "Language models can make mistakes. Always compare important details with the original text before relying on a summary.",
        },
        {
          q: "Do you store my article?",
          a: "TolaDev does not store submitted text. When the service is configured, the text is sent to the AI provider for that single request only.",
        },
      ],
    },
  },
  {
    slug: "ai-title-generator",
    title: "AI Title Generator",
    description:
      "Get specific, non-clickbait title ideas from a hosted language model. Built on a secure server route with rate limits; needs a provider key to actually run.",
    category: "ai-writing",
    keywords: ["ai title generator", "headline generator", "blog title ideas", "video title generator", "ai headlines"],
    icon: "Type",
    status: "needs-api",
    popularity: 78,
    addedAt: "2026-11-17",
    related: ["ai-writing-assistant", "slug-generator", "keyword-density-checker"],
    content: {
      what: "The AI Title Generator suggests headlines based on a short description of your content, using a hosted language model through TolaDev's protected server route. The provider key never appears in browser code. This deployment has no key configured, so the tool stays in needs-api state with a clear notice and does not fabricate titles.",
      howTo: [
        "Check the status notice on the page first.",
        "Once enabled, describe your article, video, or product in a few sentences.",
        "Choose how many titles you want: 3, 5, or 10.",
        "Generate and pick a title, then create a matching URL slug.",
      ],
      example:
        "A creator describes a guide about compress images for the web and receives several concrete titles to A/B test on a newsletter.",
      benefits: [
        "Titles are specific and avoid exaggerated clickbait.",
        "Choose the number of ideas you want in one request.",
        "Secure server-side key handling and request limits.",
        "No output is shown while the service is unavailable.",
      ],
      faqs: [
        {
          q: "Are the titles SEO optimized?",
          a: "They are descriptive and readable, which helps. For a final URL, pair a chosen title with the Slug Generator and check that the wording matches your content.",
        },
        {
          q: "Can I use the titles commercially?",
          a: "Yes. Review them for accuracy and trademark issues before publishing, just as you would with any draft.",
        },
        {
          q: "Why is generating disabled?",
          a: "The server has no AI provider key. The site owner must set OPENAI_API_KEY in the environment; the browser never holds that secret.",
        },
      ],
    },
  },
];
