export type CategoryId =
  | "ai-writing"
  | "pdf-documents"
  | "image-design"
  | "developer"
  | "student-education"
  | "business-finance"
  | "web-seo"
  | "video-audio"
  | "productivity"
  | "e-commerce"
  | "social-media"
  | "security-privacy"
  | "language-accessibility";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  intro: string;
  icon: string;
}
