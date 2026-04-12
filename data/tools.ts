/**
 * Single source of truth for all tools in QuickTools Hub (routes, SEO, categories, related links).
 *
 * - Adding a tool that reuses an existing `implementation` only requires a new object in `tools`.
 * - Introducing a brand-new capability requires adding a `ToolImplementation` value here and
 *   registering its UI once in `lib/tool-implementations.tsx` (same pattern as scaling to many tools).
 */

export type ToolCategory = "image" | "text" | "calculator";

/**
 * Maps each tool to its UI implementation. Reuse an existing key for multiple SEO pages that share the same tool.
 */
export type ToolImplementation =
  | "image-to-pdf"
  | "word-counter"
  | "percentage-calculator";

export interface ToolFAQItem {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  slug: string;
  title: string;
  category: ToolCategory;
  seoTitle: string;
  seoDescription: string;
  description: string;
  implementation: ToolImplementation;
  /** 200–400 words for tool detail pages */
  seoContent: string;
  /** Up to 2 items; rendered on the tool page */
  faq: ToolFAQItem[];
  /** Internal links to related tool slugs */
  relatedSlugs: string[];
}

export const tools: Tool[] = [
  {
    id: "image-to-pdf",
    slug: "image-to-pdf",
    title: "Image to PDF",
    category: "image",
    seoTitle: "Free Image to PDF Converter (JPG & PNG) | QuickTools Hub",
    seoDescription:
      "Turn JPG or PNG images into a downloadable PDF in your browser. No uploads to a server—fast, private, and free.",
    description:
      "Convert JPG or PNG files to a single PDF document locally in your browser.",
    implementation: "image-to-pdf",
    seoContent: `Converting images to PDF is a common need for school projects, invoices, portfolios, and email attachments. This tool runs entirely in your browser: your files are not uploaded to our servers, which helps keep your content private and speeds up the workflow when you only need a quick merge or export.

You can use it for scanned pages, screenshots, photos of documents, or design exports. The interface focuses on a simple upload, a clear preview path, and a one-click download so you can move on without installing desktop software.

For best results, use clear images with readable text and consistent orientation. If you need multiple pages, add images in the order you want them to appear in the final PDF. Because processing happens locally, performance depends on your device and image size—very large photos may take a few seconds to encode.

This page is part of QuickTools Hub, a collection of lightweight utilities designed to stay fast and easy to use. If you also work with text metrics or quick math, explore our related tools for counting words and calculating percentages from the links below.`,
    faq: [
      {
        question: "Are my images uploaded to your servers?",
        answer:
          "No. Conversion uses JavaScript in your browser. Files stay on your device unless you choose to download the PDF.",
      },
      {
        question: "Which image formats are supported?",
        answer:
          "You can convert JPG and PNG images. Use high-quality sources for sharper text in the exported PDF.",
      },
    ],
    relatedSlugs: ["word-counter", "percentage-calculator"],
  },
  {
    id: "word-counter",
    slug: "word-counter",
    title: "Word Counter",
    category: "text",
    seoTitle: "Word Counter Online — Words, Characters & Sentences | QuickTools Hub",
    seoDescription:
      "Count words, characters, and sentences in real time. Paste or type your text for instant stats—free and private.",
    description:
      "Paste or type text to see words, characters, and sentence counts update instantly.",
    implementation: "word-counter",
    seoContent: `A reliable word counter helps writers, students, and professionals stay within limits for essays, social posts, job applications, and reporting. This tool updates in real time as you type or paste, so you can edit with immediate feedback instead of running a separate check after each change.

Beyond a simple total, seeing characters and sentences together helps tune tone and pacing. Character counts matter for SMS-style limits, meta descriptions, and UI copy, while sentence counts can highlight whether a paragraph is dense or easy to scan.

Use this page when you are drafting offline notes and want a quick tally, when you are adapting content between platforms with different limits, or when you want a lightweight alternative to a full word processor. Your text is processed in the browser session and is not stored by QuickTools Hub.

For longer documents, consider breaking review into sections so you can spot where wording expands. Pair this tool with our percentage calculator when you need quick numeric context, or use the image-to-PDF tool when you need to share a clean, portable document.`,
    faq: [
      {
        question: "Does this store my text?",
        answer:
          "No server-side storage is used for the word counter. Text stays in your browser while you use the page.",
      },
      {
        question: "How are words detected?",
        answer:
          "Words are split on whitespace after trimming. Numbers and hyphenated tokens are counted as part of words depending on spacing.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "image-to-pdf"],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    category: "calculator",
    seoTitle: "Percentage Calculator — Find X% of Y & Percent Change | QuickTools Hub",
    seoDescription:
      "Calculate what is X percent of Y and find percent increase or decrease between two values. Clear inputs and instant results.",
    description:
      "Find X% of Y and compute percent increase or decrease between two numbers.",
    implementation: "percentage-calculator",
    seoContent: `Percentages appear everywhere in discounts, tips, growth metrics, grades, and budgets. This calculator focuses on two practical patterns: finding a portion of a whole (what is X percent of Y) and measuring change between two numbers (percent increase or decrease).

For portion calculations, enter the percent and the base value to see the result without mental arithmetic. For change, enter an old and new value to understand relative movement, which is useful when comparing prices, traffic, or performance over time.

The layout uses large inputs and readable labels so you can use it on a phone without zooming. Results update as you adjust values, which makes it easy to explore scenarios such as tiered discounts or incremental improvements.

QuickTools Hub keeps utilities lightweight. If you are also drafting explanations or reports, combine this page with the word counter for concise copy, or convert supporting screenshots to PDF using our image-to-PDF tool when you need a tidy attachment.`,
    faq: [
      {
        question: "How is percent change calculated?",
        answer:
          "Percent change uses (new − old) ÷ old × 100. A negative result means a decrease; a positive result means an increase.",
      },
      {
        question: "Can I use decimals?",
        answer:
          "Yes. Enter decimal percentages and decimal bases as needed; the tool evaluates using standard floating-point math.",
      },
    ],
    relatedSlugs: ["word-counter", "image-to-pdf"],
  },
];

export const toolsBySlug: Map<string, Tool> = new Map(
  tools.map((t) => [t.slug, t])
);

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsBySlug.get(slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

/** 200–300 words per category landing page */
export const categorySeo: Record<
  ToolCategory,
  { title: string; description: string; body: string }
> = {
  image: {
    title: "Image Tools — Quick, Browser-Based Utilities | QuickTools Hub",
    description:
      "Explore image utilities on QuickTools Hub. Convert formats and prepare files without heavy installs.",
    body: `Image tools should feel immediate: you have a file in hand, and you want a clean result without signing up for another service. QuickTools Hub focuses on utilities that run in the browser when possible, so you can complete quick tasks and move on with your day.

This section highlights tools that help you prepare images for sharing, documentation, and archiving. Whether you are combining screenshots, packaging photos for a client, or exporting a lightweight PDF, the goal is a simple path from upload to download.

Because workflows vary, we keep pages readable and fast. Large tap targets and clear instructions matter on phones, where many quick edits happen. We also aim to avoid clutter so you can find the next step without hunting through unrelated features.

As the catalog grows, you will find additional image utilities listed here. Each tool page includes guidance, a short FAQ, and links to related utilities across text and calculator categories. Bookmark the hub if you want a single place to return for small, repeatable tasks.

Browse the cards below to open a tool. Every listing pulls from the same central directory, which helps us keep titles, descriptions, and routes consistent as new utilities are added.`,
  },
  text: {
    title: "Text Tools — Writing & Counting Utilities | QuickTools Hub",
    description:
      "Text utilities for drafting, counting, and quick checks. Lightweight tools with clear results.",
    body: `Text tools support everyday writing work: checking length, tuning clarity, and preparing content for different channels. QuickTools Hub organizes these utilities so you can jump in, complete a task, and return to your draft without switching contexts for long.

Writers often need counts that match platform rules. Character limits appear in product listings, messaging apps, and SEO snippets, while word limits show up in academic prompts and newsletters. A focused counter gives you feedback while you edit, which is more convenient than running a separate audit after each revision.

Accessibility and speed matter. The pages are designed to load quickly and read well on small screens, with straightforward typography and minimal distractions. That approach keeps attention on your content rather than the interface.

This category will expand over time with additional text-focused utilities. Each tool is linked from this hub page so you can discover related options without searching elsewhere. Consistent metadata also helps you understand what a page does before you click.

Pick a tool from the list below to get started. Related links on each page point to calculators and image utilities when a workflow spans more than one step.`,
  },
  calculator: {
    title: "Calculator Tools — Percentages & Quick Math | QuickTools Hub",
    description:
      "Practical calculators for percentages and common comparisons. Clear inputs and readable outputs.",
    body: `Calculator tools are most helpful when they match real questions: what is a percentage of a total, and how much did a value change between two measurements? QuickTools Hub emphasizes those practical patterns with large inputs and readable results you can copy into notes or messages.

Percentages are easy to misread under pressure. A dedicated calculator reduces mistakes when you compare discounts, estimate tips, or interpret month-over-month changes. By keeping the interface minimal, you can re-run scenarios quickly until the numbers make sense.

We keep performance in mind. Lightweight pages load fast on mobile networks, and the layout avoids unnecessary animation so the experience stays calm and predictable. That matters when you are checking figures during a meeting or while traveling.

Additional calculator utilities will appear here as the site grows. Each listing uses the same structured data source, which keeps navigation and descriptions consistent. Tool pages also link to text and image utilities when your workflow needs supporting steps.

Choose a calculator from the cards below. If you are writing up findings afterward, consider pairing results with our text tools for concise explanations.`,
  },
};
