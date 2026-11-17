import type { Tool } from "@/types/tool";

/** Stage 3, Round 8 tools. */
export const stage3Round8Tools: Tool[] = [
  {
    slug: "open-graph-generator",
    title: "Open Graph Generator",
    description:
      "Generate Open Graph and Twitter meta tags from a title, description and image URL. Preview the link card and copy the tags into your page head.",
    category: "web-seo",
    keywords: ["open graph generator", "og meta tags", "link preview generator", "twitter card generator", "og tags creator"],
    icon: "Image",
    status: "ready",
    popularity: 83,
    addedAt: "2026-11-21",
    related: ["slug-generator", "schema-markup-generator", "robots-generator"],
    content: {
      what: "The Open Graph Generator turns a few page details into paste-ready meta tags for og:title, og:description, og:url, og:image, og:site_name, og:type and a Twitter card. Values are escaped so quotes in a title cannot break the markup. An approximate preview shows how the link card may look.",
      howTo: [
        "Enter the page title, description and URL.",
        "Add an absolute image URL if you want a large preview image.",
        "Choose the content type and click Generate tags.",
        "Copy the tags into the <head> of your page.",
      ],
      example:
        "A page titled 'A \"quoted\" title' produces content=\"A &quot;quoted&quot; title\" so the tag stays valid HTML.",
      benefits: [
        "Consistent link previews across social platforms.",
        "Attribute escaping prevents broken HTML.",
        "Approximate card preview before publishing.",
        "All generation happens locally with no upload.",
      ],
      faqs: [
        {
          q: "Do I need an absolute image URL?",
          a: "Yes. Most crawlers require a full URL beginning with https://. Relative paths may not render in link previews.",
        },
        {
          q: "Will the preview look exactly like this?",
          a: "No. The preview is approximate. Each platform has its own cropping rules and cache, so test with its sharing debugger after publishing.",
        },
        {
          q: "Do I need both Open Graph and Twitter tags?",
          a: "Not strictly, but including both gives better coverage. This tool emits a basic Twitter card alongside the Open Graph tags.",
        },
        {
          q: "Why are my quotes changed to entities?",
          a: "Quotes and angle brackets are escaped so the generated HTML remains valid even when your text contains special characters.",
        },
      ],
    },
  },
  {
    slug: "robots-generator",
    title: "Robots.txt Generator",
    description:
      "Build a clean robots.txt file with allow and disallow rules, a sitemap URL and an optional crawl delay. Copy or download the generated text.",
    category: "web-seo",
    keywords: ["robots.txt generator", "create robots txt", "crawler directives", "seo robots file", "disallow generator"],
    icon: "Search",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-21",
    related: ["open-graph-generator", "slug-generator", "schema-markup-generator"],
    content: {
      what: "The Robots.txt Generator collects your crawler rules into valid robots.txt syntax. You can list disallowed and explicitly allowed paths, add a sitemap URL, and set a crawl delay. It emits a single User-agent: * group suitable for most small sites.",
      howTo: [
        "List the paths you want to block, one per line.",
        "Add any paths that should be explicitly allowed.",
        "Enter your sitemap URL and, optionally, a crawl delay.",
        "Click Generate and save the text as robots.txt in your site root.",
      ],
      example:
        "Disallowing /private and /design with sitemap https://example.com/sitemap.xml produces a four-line robots.txt that most crawlers will follow.",
      benefits: [
        "Avoid syntax mistakes in a file crawlers read literally.",
        "Separate allow and disallow rules clearly.",
        "Includes the sitemap directive in the right place.",
        "No data leaves your browser.",
      ],
      faqs: [
        {
          q: "Does robots.txt block access?",
          a: "No. It is guidance for well-behaved crawlers. Use server authentication or configuration to actually protect private content.",
        },
        {
          q: "Can I target specific crawlers?",
          a: "Not with this generator. It writes one User-agent: * group, which is correct for most sites. Advanced per-bot rules need manual editing.",
        },
        {
          q: "Is crawl delay widely supported?",
          a: "Only some crawlers honor it. Google ignores crawl-delay. Leave it empty unless you know a crawler that uses it.",
        },
        {
          q: "Where do I put the file?",
          a: "Place it at the root of your domain, for example https://example.com/robots.txt, so crawlers can find it at the standard location.",
        },
      ],
    },
  },
  {
    slug: "schema-markup-generator",
    title: "Schema Markup Generator",
    description:
      "Create JSON-LD structured data for websites, organizations, articles and FAQs. Copy or download safe, paste-ready schema markup.",
    category: "web-seo",
    keywords: ["schema markup generator", "json ld generator", "structured data generator", "faq schema", "article schema"],
    icon: "Braces",
    status: "ready",
    popularity: 81,
    addedAt: "2026-11-21",
    related: ["json-formatter", "open-graph-generator", "robots-generator"],
    content: {
      what: "The Schema Markup Generator builds JSON-LD for four common types: WebSite, Organization, BlogPosting and FAQPage. Fill in only the fields that apply, and the tool omits empty values. Angle brackets in text are escaped so the JSON-LD can be pasted into a script tag safely.",
      howTo: [
        "Choose the schema type that matches your page.",
        "Fill in the name or headline and any optional fields.",
        "For FAQPage, enter Q: and A: lines for each pair.",
        "Click Generate JSON-LD and paste the output into your page.",
      ],
      example:
        "Choosing FAQPage with 'Q: Is it free? / A: Yes.' produces a FAQPage object whose mainEntity contains a Question with an acceptedAnswer.",
      benefits: [
        "Correct JSON structure without memorizing schema.org types.",
        "Only provided fields appear in the output.",
        "Escaped output is safe to paste into a script tag.",
        "Generation is entirely client-side.",
      ],
      faqs: [
        {
          q: "Does structured data guarantee rich results?",
          a: "No. It helps search engines understand your page, but rich results depend on eligibility, quality, and the search engine's policies.",
        },
        {
          q: "Can I generate LocalBusiness data?",
          a: "LocalBusiness with addresses and opening hours is not in this version. The four supported types are WebSite, Organization, BlogPosting and FAQPage.",
        },
        {
          q: "Should the markup match visible content?",
          a: "Yes. Only describe information that is actually visible on the page. Mismatched markup can be ignored or treated as spam.",
        },
        {
          q: "How do I validate the result?",
          a: "Check the JSON with the JSON Validator on this site, then test it in your search engine's structured data validation tool before publishing.",
        },
      ],
    },
  },
];
