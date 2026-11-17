/** Convert raw SVG markup into React-friendly JSX. Output never uses dangerouslySetInnerHTML. */

const MAX_SVG_CHARS = 500_000;

const ATTRIBUTE_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  "xml:space": "xmlSpace",
  "xml:lang": "xmlLang",
  "xmlns:xlink": "xmlnsXlink",
  "xlink:href": "xlinkHref",
  "xlink:title": "xlinkTitle",
};

function convertAttributeName(name: string): string {
  if (ATTRIBUTE_MAP[name]) return ATTRIBUTE_MAP[name];
  if (name.startsWith("data-") || name.startsWith("aria-")) return name;
  if (name === "xmlns" || name === "style") return name;
  return name.replace(/[:-]([a-zA-Z])/g, (_, character: string) => character.toUpperCase());
}

/** Removes scripts, event handlers, javascript: URLs and other unsafe/non-JSX nodes. */
export function sanitizeSvg(input: string): string {
  let source = input;
  source = source.replace(/<!--[\s\S]*?-->/g, "");
  source = source.replace(/<\?xml[\s\S]*?\?>/g, "");
  source = source.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
  source = source.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");
  source = source.replace(/<script\b[^>]*\/?>/gi, "");
  source = source.replace(
    /<(foreignObject|iframe|object|embed|link|meta|style)\b[\s\S]*?<\/\1\s*>/gi,
    "",
  );
  source = source.replace(/<(foreignObject|iframe|object|embed|link|meta|style)\b[^>]*\/?>/gi, "");
  source = source.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  source = source.replace(
    /dangerouslySetInnerHTML\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\})/gi,
    "",
  );
  source = source.replace(
    /\b(href|src|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,
    "",
  );
  source = source.replace(/javascript:/gi, "");
  return source;
}

export function validateSvgInput(input: string): string | null {
  if (!input.trim()) return "Paste an SVG first.";
  if (input.length > MAX_SVG_CHARS) {
    return "That SVG is too large (500,000 character limit).";
  }
  if (!/<svg[\s>]/i.test(input)) return "No <svg> root element found. Paste a complete SVG.";
  const sanitized = sanitizeSvg(input);
  if (!/<svg[\s>]/i.test(sanitized)) {
    return "The SVG had nothing convertible left after sanitization.";
  }
  return null;
}

/** Turns a CSS declaration string into a JSX style object literal. */
export function styleToObject(css: string): string {
  const entries = css
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator === -1) return null;
      const rawProperty = declaration.slice(0, separator).trim();
      const value = declaration.slice(separator + 1).trim();
      if (!rawProperty || !value) return null;
      const property = rawProperty
        .replace(/^-ms-/, "ms-")
        .replace(/[:-]([a-zA-Z])/g, (_, character: string) => character.toUpperCase());
      return `${JSON.stringify(property)}: ${JSON.stringify(value)}`;
    })
    .filter((entry): entry is string => entry !== null);

  return `{ ${entries.join(", ")} }`;
}

/** Converts sanitized SVG markup into JSX-safe markup. */
export function svgToJsx(input: string): string {
  const sanitized = sanitizeSvg(input.trim());

  let output = sanitized.replace(
    /style\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
    (_, doubleQuoted: string | undefined, singleQuoted: string | undefined) =>
      `style={${styleToObject(doubleQuoted ?? singleQuoted ?? "")}}`,
  );

  output = output.replace(
    /<([A-Za-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)(\/?)>/g,
    (_, tag: string, attributes: string, selfClose: string) => {
      const converted = attributes.replace(
        /([A-Za-z_:][\w:-]*)\s*=/g,
        (_match, name: string) => `${convertAttributeName(name)}=`,
      );
      return `<${tag}${converted}${selfClose}>`;
    },
  );

  return output.trim();
}

/** Wraps converted JSX in a typed React component with props spread on the SVG root. */
export function wrapInComponent(jsx: string, componentName: string): string {
  const cleaned = componentName.trim().replace(/[^A-Za-z0-9_]/g, "");
  const safeName = /^[A-Za-z]/.test(cleaned) ? cleaned : `Icon${cleaned}`;
  const withProps = jsx.replace(/<svg\b([^>]*)>/, (_match, attributes: string) =>
    `<svg${attributes} {...props}>`,
  );
  const body = withProps
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");

  return [
    'import type { SVGProps } from "react";',
    "",
    `export function ${safeName}(props: SVGProps<SVGSVGElement>) {`,
    "  return (",
    body,
    "  );",
    "}",
  ].join("\n");
}
