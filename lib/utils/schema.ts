/** Pure JSON-LD schema builder for common page types. */

export type SchemaType = "website" | "organization" | "article" | "faq";

export interface SchemaInput {
  type: SchemaType;
  name: string;
  url: string;
  description: string;
  author: string;
  questions: string;
}

export function buildSchema(input: SchemaInput): { json: string; error: string | null } {
  if (!input.name.trim()) return { json: "", error: "Enter a name or headline." };

  const base = {
    "@context": "https://schema.org",
    url: input.url.trim() || undefined,
    name: input.name.trim(),
    description: input.description.trim() || undefined,
  };

  let data: Record<string, unknown>;

  if (input.type === "website") {
    data = { ...base, "@type": "WebSite", inLanguage: "en" };
  } else if (input.type === "organization") {
    data = { ...base, "@type": "Organization" };
  } else if (input.type === "article") {
    data = {
      ...base,
      "@type": "BlogPosting",
      headline: input.name.trim(),
      author: input.author.trim()
        ? { "@type": "Person", name: input.author.trim() }
        : undefined,
    };
  } else {
    const lines = input.questions
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const entities: {
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }[] = [];
    let question = "";

    for (const line of lines) {
      if (/^Q:/i.test(line)) {
        question = line.replace(/^Q:/i, "").trim();
      } else if (/^A:/i.test(line) && question) {
        entities.push({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: line.replace(/^A:/i, "").trim(),
          },
        });
        question = "";
      }
    }
    if (entities.length === 0 || entities.some((item) => !item.name || !item.acceptedAnswer.text)) {
      return {
        json: "",
        error: "Enter one question per line, followed by its answer on the next line.",
      };
    }
    data = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities };
  }

  const clean = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
  return { json: JSON.stringify(clean, null, 2).replace(/</g, "\\u003c"), error: null };
}
