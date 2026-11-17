import { safeJsonLd } from "@/lib/seo/jsonld";

interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data. Uses a plain script tag (not
 * next/script) as recommended for structured data, and escapes `<`
 * inside the payload before injecting.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // The payload is escaped by safeJsonLd before it reaches the DOM.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
