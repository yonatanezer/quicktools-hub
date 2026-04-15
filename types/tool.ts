/**
 * Programmatic SEO entity: one `Tool` = one `/tools/[slug]` landing page (static params).
 * Tiers (`star` | `standard` | `seo`) drive homepage modules and internal link priority.
 */

export type ToolTier = "star" | "standard" | "seo";
export type ToolCategory =
  | "pdf-tools"
  | "business-tools"
  | "text-tools"
  | "image-tools"
  | "calculator-tools";

export type ToolImplementation =
  | "image-to-pdf"
  | "word-counter"
  | "percentage-calculator"
  | "word-to-pdf"
  | "pdf-to-word"
  | "merge-pdfs"
  | "split-pdf"
  | "compress-pdf"
  | "bmi-calculator"
  | "age-calculator"
  | "loan-emi-calculator"
  | "gpa-calculator"
  | "calorie-calculator"
  | "date-difference-calculator"
  | "celsius-to-fahrenheit"
  | "inches-to-cm"
  | "mpg-to-kpl"
  | "km-to-miles"
  | "miles-to-km"
  | "pounds-to-kg"
  | "kg-to-pounds"
  | "liters-to-gallons"
  | "gallons-to-liters"
  | "hex-to-rgb"
  | "rgb-to-hex"
  | "case-converter"
  | "remove-duplicate-lines"
  | "text-to-slug"
  | "mortgage-calculator"
  | "compound-interest-calculator"
  | "savings-goal-calculator"
  | "simple-interest-calculator"
  | "credit-card-payoff-calculator"
  | "auto-loan-calculator"
  | "debt-to-income-calculator"
  | "refinance-calculator"
  | "down-payment-calculator"
  | "amortization-calculator"
  | "apr-calculator"
  | "retirement-savings-calculator"
  | "inflation-calculator"
  | "roi-calculator"
  | "break-even-calculator"
  | "sla-calculator"
  | "business-hours-calculator"
  | "response-time-calculator"
  | "resolution-time-calculator"
  | "sla-remaining-time";

export type Tool = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  category: ToolCategory;

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
