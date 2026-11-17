import type { Tool } from "@/types/tool";

/** Stage 3, Round 7: PDF Merge and PDF Split already exist; this is the remaining tool. */
export const stage3Round7Tools: Tool[] = [
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF",
    description:
      "Turn JPG or PNG photos into a single PDF in your browser. Reorder pages, check file sizes and download the result without uploading images.",
    category: "pdf-documents",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf converter", "photos to pdf", "convert image to pdf"],
    icon: "FileText",
    status: "ready",
    popularity: 90,
    addedAt: "2026-11-20",
    related: ["pdf-merger", "pdf-splitter", "image-format-converter"],
    content: {
      what: "The JPG to PDF tool embeds each image as one page of a new PDF document. You can add up to ten JPG or PNG files, reorder them, and download the PDF. Image files are read in the browser with the File API and assembled with pdf-lib, so nothing is uploaded.",
      howTo: [
        "Choose up to ten JPG or PNG images, 20 MB each.",
        "Use the arrow buttons to set the page order.",
        "Click Create PDF and wait for the download to start.",
        "Open the PDF to confirm the pages and order are correct.",
      ],
      example:
        "A student scans five signed pages as separate JPGs, orders them 1 through 5, and downloads one PDF to submit to the school portal.",
      benefits: [
        "Combine phone photos into a single shareable document.",
        "Page order is under your control before export.",
        "No upload, watermark, or sign-up.",
        "Clear errors for unsupported files and oversized images.",
      ],
      faqs: [
        {
          q: "Can I mix JPG and PNG files?",
          a: "Yes. Both formats are embedded as separate pages. Other formats such as WebP or GIF are rejected with a clear message.",
        },
        {
          q: "How many images can I add?",
          a: "Up to ten images per PDF, each no larger than 20 MB. This keeps browser memory use reasonable.",
        },
        {
          q: "Will the PDF be searchable text?",
          a: "No. The PDF contains images, not recognized text. OCR would be a separate tool and is not performed here.",
        },
        {
          q: "What page size does the PDF use?",
          a: "Each page matches the image's pixel dimensions scaled down if extremely large. This avoids distortion and keeps viewers responsive.",
        },
      ],
    },
  },
];
