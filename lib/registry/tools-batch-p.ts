import type { Tool } from "@/types/tool";

/** Batch P: PDF stamping, colour sampling, passport photos and SVG conversion. */
export const batchPTools: Tool[] = [
  {
    slug: "pdf-page-numbering",
    title: "PDF Page Numbering",
    description:
      "Stamp page numbers anywhere on a PDF. Choose decimal, roman or letter formats, set the position, margin, start number and color, then download the result locally.",
    category: "pdf-documents",
    keywords: [
      "pdf page numbering",
      "add page numbers to pdf",
      "number pdf pages",
      "pdf page number format",
      "roman numeral page numbers",
      "pdf footer numbering",
    ],
    icon: "FileText",
    status: "ready",
    popularity: 81,
    addedAt: "2026-11-22",
    related: ["pdf-watermark", "pdf-merger", "pdf-splitter"],
    content: {
      what: "PDF Page Numbering adds a page label to every page of a document directly in your browser. You can place the number in any corner or centered at the top or bottom, and choose between decimal, roman, alphabetic, or 'page / total' numbering. Prefixes, suffixes, font size, edge margin, text color, a custom start number, and skipping the cover page are all supported. The PDF is opened with pdf-lib, modified locally, and never uploaded to a server.",
      howTo: [
        "Choose a standard, unprotected PDF up to 20 MB.",
        "Pick a position and a numbering format, such as decimal or roman numerals.",
        "Adjust font size, margin, color, start number, prefix and suffix to suit your layout.",
        "Click Add page numbers, preview the output details, then download the numbered PDF.",
      ],
      example:
        "A 12-page report needs a cover without a number and a footer reading 'Page 1 / 11' from page two onward. Set the format to '1 / 10 (page of total)', prefix 'Page ', start number 1, enable 'Skip numbering on the first page', choose bottom center, and download.",
      benefits: [
        "Numbering works entirely offline, so confidential documents stay private.",
        "Multiple numbering styles cover reports, books and legal documents.",
        "Fine control over position, margin and size prevents overlap with existing footers.",
        "Prefix and suffix fields let you build labels like 'Chapter 1 – 3' or 'i / iv'.",
      ],
      faqs: [
        {
          q: "Can I skip the cover page?",
          a: "Yes. Enable 'Skip numbering on the first page'. Numbering still starts from the start value you set, so the second page can be 1 or 2 depending on your preference.",
        },
        {
          q: "Will the numbers overwrite content already on the page?",
          a: "The label is drawn in the margin area you choose. If your PDF has a full-width footer, increase the edge margin or move the label to the top so it does not collide.",
        },
        {
          q: "Does it work with scanned or image-only PDFs?",
          a: "Yes. The number is drawn as a new text layer on top of each page, so it does not matter whether the page contains text or a scanned image.",
        },
        {
          q: "Why can't I open my PDF?",
          a: "Password-protected, encrypted, or damaged PDFs cannot be read by the browser library. Decrypt the file first, or re-save it from your PDF viewer, then try again.",
        },
        {
          q: "What do the prefix and suffix fields do?",
          a: "They are literal text placed before and after the generated number. For example, prefix 'Page ' with the '1 / 10' format produces 'Page 1 / 10'.",
        },
      ],
    },
  },
  {
    slug: "pdf-watermark",
    title: "PDF Watermark",
    description:
      "Overlay a custom text watermark on every PDF page. Adjust opacity, rotation, font size, color, weight and placement — centered, diagonal, repeated or in a corner.",
    category: "pdf-documents",
    keywords: [
      "pdf watermark",
      "add watermark to pdf",
      "diagonal pdf watermark",
      "confidential pdf stamp",
      "tiled watermark pdf",
      "pdf opacity text",
    ],
    icon: "FileText",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["pdf-page-numbering", "jpg-to-pdf", "pdf-merger"],
    content: {
      what: "PDF Watermark draws a translucent text stamp across the pages of a PDF using pdf-lib. The watermark is real vector text, not a flattened image, so it stays crisp at any zoom. You control the message, opacity, rotation angle, font size, color, bold weight and placement. Choose a single diagonal stamp, a centered label, a corner mark, or a repeating tiled pattern. Processing happens locally in your browser.",
      howTo: [
        "Choose an unprotected PDF up to 20 MB.",
        "Type the watermark text and choose a placement style.",
        "Tune opacity, rotation, font size and color until the preview looks right.",
        "Click Apply watermark, then download the stamped PDF.",
      ],
      example:
        "A law firm marks a draft contract with 'CONFIDENTIAL' at 25% opacity, rotated -45 degrees, in gray. They set placement to diagonal, keep the font size at 48 pt, and download a PDF whose text remains readable underneath.",
      benefits: [
        "Mark drafts, samples and previews without expensive desktop software.",
        "Vector text stays sharp when printed or zoomed.",
        "Opacity and color controls keep the underlying content legible.",
        "Tiled mode makes a strong deterrent for unofficial copies.",
      ],
      faqs: [
        {
          q: "Is a watermark a secure way to protect a document?",
          a: "No. A watermark is a visual notice, not encryption or DRM. It discourages misuse and marks ownership, but determined users can still remove or obscure it.",
        },
        {
          q: "What opacity should I use?",
          a: "Around 15–35% keeps background text readable while making the watermark obvious. Higher values are better for short drafts that do not need the underlying content to stand out.",
        },
        {
          q: "Can I use non-Latin characters?",
          a: "The built-in Helvetica fonts support standard Latin characters only. Characters outside that range may render incorrectly, so stick to Latin text for reliable results.",
        },
        {
          q: "Why did the watermark land off the page?",
          a: "Very long text or a large font size can extend past the page edges, especially with rotation. Shorten the text or reduce the font size and try again.",
        },
        {
          q: "Does this work on encrypted PDFs?",
          a: "No. Password-protected or corrupted PDFs cannot be opened by the browser library. Remove the protection first, then watermark the file.",
        },
      ],
    },
  },
  {
    slug: "image-color-picker",
    title: "Image Color Picker",
    description:
      "Click any pixel of an uploaded image to read its HEX, RGB and HSL values. Save sampled swatches, extract a dominant-color palette and copy or download the results.",
    category: "image-design",
    keywords: [
      "image color picker",
      "eyedropper tool online",
      "get hex color from image",
      "pixel color detector",
      "extract color palette from image",
      "rgb hsl converter image",
    ],
    icon: "Palette",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-22",
    related: ["color-contrast-checker", "passport-photo-maker", "image-compressor"],
    content: {
      what: "Image Color Picker reads pixel colors from a picture you upload. Click anywhere on the preview (or focus it and use the arrow keys) to sample that pixel and instantly see its HEX, RGB and HSL values. You can save individual swatches to a palette, automatically extract the six most common color buckets from the image, copy any value to the clipboard, and download a plain-text palette. All decoding happens with the browser canvas API and the file is never uploaded.",
      howTo: [
        "Upload a JPG, PNG or WebP image up to 20 MB.",
        "Click a pixel on the preview, or focus the image and move with the arrow keys.",
        "Read the HEX, RGB and HSL values and copy the ones you need.",
        "Use Extract palette or Add to palette, then download the swatch list.",
      ],
      example:
        "A designer uploads a brand photo, clicks the blue background, and gets #2F6FB1 / rgb(47, 111, 177) / hsl(210, 58%, 44%). They save the swatch, extract six dominant colors from the photo, download the palette and paste the values into a design system.",
      benefits: [
        "Get exact color codes without installing image software.",
        "See HEX, RGB and HSL at once for different workflows.",
        "Build a palette from sampled points or auto-detected dominant colors.",
        "Keyboard-accessible sampling and fully local processing protect your files.",
      ],
      faqs: [
        {
          q: "Does the image leave my device?",
          a: "No. The image is decoded in your browser with a temporary object URL, drawn to a canvas, and that URL is revoked immediately. Nothing is uploaded.",
        },
        {
          q: "Why does the sampled color differ from what I see?",
          a: "Screens, color profiles and browser scaling can shift appearance slightly. The values reported are the exact stored pixel values of the decoded image.",
        },
        {
          q: "How does the automatic palette work?",
          a: "It samples pixels across the image, groups similar colors into buckets, and returns the average of the six most frequent buckets as distinct HEX swatches.",
        },
        {
          q: "Can I sample transparent pixels?",
          a: "Fully transparent pixels are ignored by the palette extractor. Sampling a transparent area directly still returns its stored RGB values, which may be arbitrary.",
        },
        {
          q: "Which image formats are supported?",
          a: "JPG, PNG and WebP, up to 20 MB. Very large images are scaled down for the preview to keep sampling responsive, but this does not change the colors of individual pixels.",
        },
      ],
    },
  },
  {
    slug: "passport-photo-maker",
    title: "Passport Photo Maker",
    description:
      "Crop a portrait to common passport photo sizes and arrange copies on an A4 or Letter print sheet. Adjust zoom and border, then download a print-ready PNG locally.",
    category: "image-design",
    keywords: [
      "passport photo maker",
      "passport photo cropper",
      "passport photo print sheet",
      "visa photo size",
      "35x45 mm photo",
      "2x2 passport photo",
    ],
    icon: "Image",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["image-color-picker", "image-resizer", "image-cropper"],
    content: {
      what: "Passport Photo Maker crops a portrait to common photo sizes such as US 2 × 2 inches, Schengen/EU 35 × 45 mm, Canada 50 × 70 mm and several 35 × 45 mm national variants. Each size is rendered at 300 DPI, and you can fine-tune the framing with zoom and an optional colored border. A print sheet arranges multiple copies on A4 or US Letter paper with optional dashed cut guides. Everything is generated in your browser, and no image is uploaded.",
      howTo: [
        "Upload a clear, front-facing JPG, PNG or WebP portrait up to 20 MB.",
        "Choose the photo size required for your application.",
        "Adjust zoom and border, then set the print sheet columns, rows and paper size.",
        "Download the single photo or the print sheet, and check official rules before submitting.",
      ],
      example:
        "An applicant uploads a portrait, selects 'Schengen / EU 35 × 45 mm', sets zoom to 1.2 to frame the head correctly, keeps a white border, and generates a 2 × 4 grid on A4 with cut guides for eight identical photos.",
      benefits: [
        "Produces 300 DPI images suitable for home printing.",
        "Covers several frequently requested passport and visa sizes.",
        "Print sheet layout saves paper and makes cutting straightforward.",
        "No account, upload or photo service required — your image stays private.",
      ],
      faqs: [
        {
          q: "Is the result guaranteed to be accepted?",
          a: "No. Passport photo rules vary by country and change over time, including head size, background shade, expression and lighting. Check your government's official requirements before printing or submitting.",
        },
        {
          q: "What is 300 DPI and why does it matter?",
          a: "DPI means dots per inch. Printing at 300 DPI keeps the photo sharp. The preset pixel sizes are chosen so the image prints at the target physical dimensions at that density.",
        },
        {
          q: "Can I change the background to blue or gray?",
          a: "The border fill color applies to the optional border around the crop. The tool does not replace the photo's background or remove shadows; use a correctly lit photo to begin with.",
        },
        {
          q: "How do I avoid a stretched face?",
          a: "The crop always preserves the preset aspect ratio, so the image is never distorted. Use the zoom slider to reframe without changing proportions.",
        },
        {
          q: "Do I need special photo paper?",
          a: "Matte or glossy photo paper gives the best result, but ordinary white printer paper works for a draft. Always use the paper size you selected in the tool when printing the sheet.",
        },
      ],
    },
  },
  {
    slug: "svg-to-jsx",
    title: "SVG to JSX",
    description:
      "Convert SVG markup into clean React JSX. Class, hyphenated attributes, inline styles and xlink references are transformed correctly, with unsafe markup stripped out.",
    category: "developer",
    keywords: [
      "svg to jsx",
      "svg to react component",
      "convert svg attributes react",
      "class to className converter",
      "svg style object converter",
      "clean svg markup online",
    ],
    icon: "Code2",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: ["regex-tester", "json-formatter", "base64-encoder-decoder"],
    content: {
      what: "SVG to JSX takes pasted SVG markup and rewrites it so React accepts it. The converter turns class into className and for into htmlFor, changes hyphenated and colon-prefixed attributes into camelCase (stroke-width to strokeWidth, xlink:href to xlinkHref), and converts inline style strings into JSX style objects. It also removes scripts, event handlers, javascript: URLs, foreignObject and other unsafe nodes before conversion, and can wrap the result in a typed React component. The output is plain JSX — no dangerouslySetInnerHTML is used.",
      howTo: [
        "Paste a complete <svg> element into the input box, or load the example.",
        "Optionally enable 'Wrap in a typed React component' and set a component name.",
        "Click Convert to JSX to sanitize and transform the markup.",
        "Copy the result or download it as a .tsx file for your project.",
      ],
      example:
        'An icon with class="icon", stroke-width="2" and style="fill: #fff; stroke-width: 1.5px" becomes className="icon", strokeWidth="2" and style={{ "fill": "#fff", "strokeWidth": "1.5px" }}, ready to paste into a React component.',
      benefits: [
        "Avoids manual, error-prone attribute renaming.",
        "Produces style objects that React accepts without warnings.",
        "Sanitization strips scripts and event handlers from untrusted SVG input.",
        "Optional typed component wrapper saves setup time in a React codebase.",
      ],
      faqs: [
        {
          q: "Why does React reject my original SVG?",
          a: "JSX uses camelCase attribute names and JavaScript objects for inline styles, while SVG files use hyphenated names and CSS strings. class also becomes className. The converter handles these differences for you.",
        },
        {
          q: "Does the tool sanitize untrusted SVG?",
          a: "Yes. It removes script blocks, on* event handlers, javascript: URLs, foreignObject, iframe, object, embed, link, meta and style nodes before conversion. Still review output before shipping artwork from an untrusted source.",
        },
        {
          q: "Will data-* and aria-* attributes be changed?",
          a: "No. Attributes beginning with data- or aria- are left intact because React supports them as written.",
        },
        {
          q: "Why don't I see dangerouslySetInnerHTML in the output?",
          a: "The converter emits markup as literal JSX elements so React renders real DOM nodes. It never injects raw HTML strings, which avoids that unsafe escape hatch entirely.",
        },
        {
          q: "Can I convert an entire icon set at once?",
          a: "The tool expects one <svg> root per conversion. Convert icons one at a time, or split a sprite into its individual <svg> elements first.",
        },
      ],
    },
  },
];
