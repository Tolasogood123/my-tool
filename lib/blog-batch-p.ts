import type { BlogPost } from "@/lib/blog";

/** Batch P guide with internal links to the five tools in this batch. */
export const batchPBlogs: BlogPost[] = [
  {
    slug: "five-browser-file-tricks-pdf-color-photo-svg",
    title:
      "Five Browser-Based File Tricks: Page Numbers, Watermarks, Color Palettes, Passport Photos and SVG to JSX",
    description:
      "A practical guide to numbering and watermarking PDFs, sampling colors from images, printing passport photos and converting SVG markup into clean React JSX — all without uploads.",
    date: "2026-11-22",
    readingMinutes: 9,
    tags: ["PDF", "Design", "Images", "React", "Productivity"],
    content: `Most people reach for a desktop app or an online service the moment they need to touch a file. But modern browsers can handle a surprising amount of document and image work locally. This guide walks through five everyday tasks that you can complete without installing software or uploading anything: numbering a PDF, watermarking it, sampling colors from a photo, printing passport photos and converting SVG markup to React JSX.

## Why local processing matters

When a file stays on your device, three good things happen. First, it is faster — there is no upload queue and no waiting for a remote server. Second, private documents remain private. Third, the results are deterministic: you can repeat the same steps and get the same output. The tools described below all use browser APIs such as Canvas and pdf-lib, and none of them send your data anywhere.

## 1. Number the pages of a PDF

Page numbers are easy to take for granted until a document arrives without them. The [PDF Page Numbering](/tools/pdf-page-numbering) tool opens a PDF, draws a label on each page and saves a new copy. You can place the number at the top or bottom, on the left, right or center, and pick a style that suits the document.

Use decimal numbers (1, 2, 3) for reports, roman numerals (i, ii, iii) for front matter, or letters for appendices. The "1 / 10" format is excellent when readers need to know both the current page and the total. A prefix and suffix let you build labels like "Page 1 / 10" without editing every page by hand.

A few practical tips:

- Enable "skip first page" for reports with a cover, so the numbering begins on page two.
- Increase the edge margin if the PDF already has a footer, otherwise the new number may overlap it.
- Keep the font size modest — 10 or 11 points is usual for a footer.

If you need to assemble the document first, combine files with the [PDF Merger](/tools/pdf-merger) or pull out a range with the [PDF Splitter](/tools/pdf-splitter) before numbering.

## 2. Add a watermark to protect drafts

A watermark is a visual signal: it says "draft", "confidential" or "sample" without changing the underlying content. [PDF Watermark](/tools/pdf-watermark) draws a translucent text stamp on every page using real vector text, so it stays sharp when printed or zoomed.

The most common setup is a diagonal gray stamp at roughly 25% opacity. That is strong enough to be noticed but light enough that body text remains readable. If you are sharing a preview of a paid product, a repeated tiled pattern is harder to crop away. For a quick corner mark, use one of the corner placements with a smaller font.

Remember what a watermark is not: it is not encryption and it does not stop someone determined to remove it. It is a clear notice of status and ownership. For actual access control, use password protection or a rights-management system instead.

## 3. Sample exact colors from an image

Designers often need the precise color of a logo, a fabric or a background. The [Image Color Picker](/tools/image-color-picker) lets you click any pixel of an uploaded image and see its HEX, RGB and HSL values immediately. Focus the image and use the arrow keys for pixel-precise sampling without a mouse.

There are two ways to build a palette. You can click several points and add each swatch to your saved list, or press "Extract palette" to find the six most frequent color groups automatically. The first approach is best when you care about specific brand colors; the second is useful for discovering the dominant tones of a photograph. Either way, you can copy a single value or download the whole palette as text.

A note on accuracy: the values come from the decoded image file, not from how your monitor displays it. Color profiles and screen calibration can make a color look slightly different on another device. When exact matching matters, share the HEX value rather than a screenshot.

If you are choosing text colors, pair this tool with the [Color Contrast Checker](/tools/color-contrast-checker) to confirm that your foreground and background meet accessibility standards.

## 4. Print passport photos at home

Passport and visa applications are one of the few places where a few millimetres can matter. [Passport Photo Maker](/tools/passport-photo-maker) crops a portrait to common sizes — US 2 × 2 inches, Schengen and EU 35 × 45 mm, Canada 50 × 70 mm and several national 35 × 45 mm variants — at 300 DPI, which is the normal resolution for photo printing.

Start with a clear, front-facing photo in even light. Choose the size your application requires, then use the zoom slider to frame the head properly. The crop always preserves the preset aspect ratio, so the face will not be stretched. The optional border and fill color are useful when a specification asks for a small margin around the image.

The print sheet is where the tool saves real time. Set the number of columns and rows, choose A4 or US Letter, and download a grid of identical photos with optional dashed cut lines. Print at 100% scale — never "fit to page" — or the physical dimensions will be wrong.

Here is the important caveat: **country rules vary, and they change.** Head size, background shade, expression and even paper type can differ between applications. This tool crops and arranges an image; it cannot verify that the result meets a specific authority's rules. Always check the official government guidance before you print or submit.

## 5. Convert SVG markup to React JSX

SVG files and React do not speak exactly the same language. An SVG uses \`class\`, \`stroke-width\` and \`style="fill: red"\`; React expects \`className\`, \`strokeWidth\` and \`style={{ fill: "red" }}\`. Hand-converting an icon set is tedious and easy to get wrong.

[SVG to JSX](/tools/svg-to-jsx) does the translation for you. It renames attributes to camelCase, converts inline CSS strings into style objects, preserves \`data-*\` and \`aria-*\` attributes, and rewrites \`xlink:href\` to \`xlinkHref\`. You can wrap the output in a typed React component with props spread onto the root \`<svg>\`, then copy it or download a \`.tsx\` file.

The converter also sanitizes input. Scripts, event handlers, \`javascript:\` URLs and elements such as \`foreignObject\` are stripped before conversion. The output is ordinary JSX elements, so there is no \`dangerouslySetInnerHTML\` — React renders real DOM nodes. If the artwork comes from an untrusted source, still review the result before shipping it.

## Bringing it together

These five tasks share a pattern: upload, adjust a few options, download. Because the work happens in the browser, you can iterate quickly and keep sensitive files close. A typical workflow might be: assemble and split a PDF, add page numbers and a "DRAFT" watermark, sample your brand color from a reference image, print a passport photo for a trip, and convert a set of icons for the app you are building. None of it requires a subscription, and all of it is reversible — keep your original files and regenerate whenever you need a different variant.

The next time you are tempted to install a one-off utility or paste a confidential document into a random website, check whether a local browser tool can do the job. Often it can, and the result is faster, safer and entirely under your control.`,
  },
];
