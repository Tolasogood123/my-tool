import type { Category, CategoryId } from "@/types/category";

export const categories: Category[] = [
  {
    id: "ai-writing",
    name: "AI & Writing",
    description: "Writing helpers, text tools, and assisted content workflows.",
    intro:
      "Clear writing takes time. This collection brings together text utilities and writing aids that help you clean up drafts, count words, change case, and shape content faster. Tools that need a hosted AI model are clearly marked so you always know when processing happens in your browser and when it does not.",
    icon: "Sparkles",
  },
  {
    id: "pdf-documents",
    name: "PDF & Documents",
    description: "Everyday document conversions and PDF utilities.",
    intro:
      "Documents should not be a hassle. These tools are planned for converting, merging, splitting, and inspecting PDFs and common document formats. Each one will run in your browser wherever the format allows, so your files stay on your device.",
    icon: "FileText",
  },
  {
    id: "image-design",
    name: "Image & Design",
    description: "Compress, resize, and prepare images for the web.",
    intro:
      "Large images slow down websites, fill up storage, and make sharing painful. These image tools resize and compress files directly in your browser, with no uploads and no waiting on a server. Choose a file, adjust the settings, and download the result.",
    icon: "Image",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Formatters, encoders, generators, and debugging helpers.",
    intro:
      "Small developer tasks can eat a surprising amount of time. This category gathers focused utilities for formatting JSON, encoding data, generating identifiers, and cleaning up text. Everything runs locally in your browser, which keeps private payloads off third-party servers.",
    icon: "Code2",
  },
  {
    id: "student-education",
    name: "Student & Education",
    description: "Calculators and study helpers for school and university.",
    intro:
      "Students need quick, reliable answers without signing up for another account. These tools cover grades, percentages, and study math with transparent formulas so you can check the result yourself. More classroom helpers are on the way.",
    icon: "GraduationCap",
  },
  {
    id: "business-finance",
    name: "Business & Finance",
    description: "Practical calculators for pricing, margins, and planning.",
    intro:
      "Good business decisions start with clear numbers. These calculators help you work through percentages, pricing, and everyday financial math. Results update as you type, and the formulas are simple enough to verify by hand.",
    icon: "Briefcase",
  },
  {
    id: "web-seo",
    name: "Web & SEO",
    description: "Checks and helpers for websites, metadata, and search.",
    intro:
      "Search visibility depends on hundreds of small details. These tools are being built to help with metadata, structured data, and technical checks. Tools that need to crawl a live website are marked as requiring an API rather than pretending to work offline.",
    icon: "Search",
  },
  {
    id: "video-audio",
    name: "Video & Audio",
    description: "Media conversion and preparation tools.",
    intro:
      "Video and audio files are heavy, and browser-based processing has real limits. The tools planned here will handle what the browser can do well and will clearly label anything that needs a server or external service.",
    icon: "Clapperboard",
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Small utilities that remove daily friction.",
    intro:
      "Productivity is less about doing more and more about removing tiny annoyances. These tools handle quick calculations and everyday tasks so you can get back to the work that matters.",
    icon: "CheckSquare",
  },
  {
    id: "e-commerce",
    name: "E-commerce",
    description: "Tools for product listings, pricing, and store operations.",
    intro:
      "Running an online store involves repetitive math and formatting. This category will collect calculators and generators for product data, pricing, and storefront content. New tools are added as they are fully tested.",
    icon: "ShoppingBag",
  },
  {
    id: "social-media",
    name: "Social Media & Creator",
    description: "Utilities for content, campaigns, and sharing.",
    intro:
      "Creators need fast utilities that work on the devices they already carry. These tools help with QR codes, links, and content preparation without another subscription or watermark.",
    icon: "Share2",
  },
  {
    id: "security-privacy",
    name: "Security & Privacy",
    description: "Generators and helpers for safer everyday habits.",
    intro:
      "Security tools should practice what they preach. These utilities generate passwords and identifiers using the browser's cryptographic APIs, and they never send the results anywhere. Nothing is stored on a server.",
    icon: "ShieldCheck",
  },
  {
    id: "language-accessibility",
    name: "Language & Accessibility",
    description: "Text tools for multilingual and accessible content.",
    intro:
      "Content should work for everyone, including readers of different languages and people who use assistive technology. These tools focus on text handling, language-aware counting, and readable formatting. More Khmer-language support is planned.",
    icon: "Languages",
  },
];

export const categoryIds = categories.map((category) => category.id);

export function getCategory(id: CategoryId): Category {
  const category = categories.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Unknown category: ${id}`);
  }
  return category;
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}
