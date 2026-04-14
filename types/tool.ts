/**
 * Programmatic SEO entity: one `Tool` = one `/tools/[slug]` landing page (static params).
 * Tiers (`star` | `standard` | `seo`) drive homepage modules and internal link priority.
 */

export type ToolTier = "star" | "standard" | "seo";

export type ToolImplementation =
  | "image-to-pdf"
  | "word-counter"
  | "percentage-calculator"
  | "word-to-pdf"
  | "pdf-to-word"
  | "merge-pdfs"
  | "split-pdf"
  | "compress-pdf";

export type Tool = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  category: string;

  tier: ToolTier;

  introduction: string;
  howToUse: string[];

  seoContent: string;

  faq: {
    question: string;
    answer: string;
  }[];

  relatedSlugs: string[];

  /** Meta & cards */
  seoTitle: string;
  seoDescription: string;
  description: string;
  implementation: ToolImplementation;
};
