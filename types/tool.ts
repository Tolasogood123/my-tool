import type { CategoryId } from "./category";

export type ToolStatus = "ready" | "needs-api" | "planned";

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolContent {
  what: string;
  howTo: string[];
  example: string;
  benefits: string[];
  faqs: ToolFaq[];
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  icon: string;
  status: ToolStatus;
  popularity: number;
  addedAt: string;
  related: string[];
  content: ToolContent;
}
