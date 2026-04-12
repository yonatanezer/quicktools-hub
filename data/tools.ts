/**
 * Single source of truth for all tools (routes, tiers, SEO, categories, internal links).
 *
 * Tiers: `star` (primary traffic), `standard` (supporting), `seo` (long-tail listings).
 * Reusing an existing `implementation` only requires a new row in `tools`.
 * New UI kinds: extend `ToolImplementation` and register once in `lib/tool-implementations.tsx`.
 */

export type ToolCategory = "image" | "text" | "calculator";

export type ToolTier = "star" | "standard" | "seo";

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
  /** Homepage / nav emphasis */
  tier: ToolTier;
  category: ToolCategory;
  /** `<title>` / sharing — keyword-led, intent-focused */
  seoTitle: string;
  seoDescription: string;
  /** Short card / list blurb */
  description: string;
  /** Page H1 — readable and SEO-friendly */
  h1: string;
  /** 2–4 lines, shown under H1 */
  introduction: string;
  implementation: ToolImplementation;
  /** 150–300 words for the main SEO article block */
  seoContent: string;
  /** 3–5 steps */
  howToUse: string[];
  /** 2–4 FAQ items */
  faq: ToolFAQItem[];
  /** Related slugs (stars are also surfaced globally on every tool page) */
  relatedSlugs: string[];
}

export const tools: Tool[] = [
  {
    id: "image-to-pdf",
    slug: "image-to-pdf",
    title: "Image to PDF",
    tier: "star",
    category: "image",
    seoTitle:
      "Free Image to PDF Converter Online — JPG & PNG to PDF | QuickTools Hub",
    seoDescription:
      "Use our free image to PDF converter online: merge JPG or PNG files into one PDF in your browser. Private, fast, no signup.",
    description:
      "Turn JPG or PNG images into a single PDF—runs locally in your browser.",
    h1: "Free Image to PDF Converter Online",
    introduction:
      "Upload JPG or PNG files and download a merged PDF in seconds. This free image to PDF converter runs entirely in your browser, so your files are not uploaded to our servers.\n\nIdeal for homework, invoices, screenshots, and quick sharing when you need a tidy PDF attachment.",
    implementation: "image-to-pdf",
    seoContent: `If you need a dependable image to PDF converter for everyday work, browser-based tools can save time because there is nothing to install. QuickTools Hub focuses on a simple flow: choose your images, build the PDF, and download the result. That approach matches how people actually work—fast tasks, clear outcomes, and minimal friction.

Because conversion happens locally, it is a practical choice when privacy matters. School assignments, client screenshots, and personal photos stay on your device while the page does the encoding work. For the best output, prefer sharp images with readable text and add files in the order you want pages to appear.

This utility sits alongside other free online tools on the hub, including a word counter online for drafting and calculator tools for quick math. Together, they form a small productivity toolkit you can return to whenever you need a fast result without creating an account.`,
    howToUse: [
      "Click “Choose files” (or your browser’s equivalent) and select one or more JPG or PNG images.",
      "Images are processed in the order you select them—re-select in a different order if you need a different page sequence.",
      "Wait a moment while your browser builds the PDF; large photos may take slightly longer.",
      "Download the generated PDF when prompted and save it where you need it.",
      "Optional: repeat with a new batch if you want a separate PDF file.",
    ],
    faq: [
      {
        question: "Is this image to PDF converter really free?",
        answer:
          "Yes. QuickTools Hub provides free online tools with no signup required for this converter.",
      },
      {
        question: "Do you upload my images to a server?",
        answer:
          "No. The conversion uses JavaScript in your browser, so your images stay on your device unless you choose to share the PDF elsewhere.",
      },
      {
        question: "Can I combine multiple images into one PDF?",
        answer:
          "Yes. Select multiple JPG or PNG files and the tool merges them into a single downloadable PDF.",
      },
      {
        question: "What formats are supported?",
        answer:
          "Use JPG or PNG images. Higher-resolution sources usually produce clearer text in the PDF.",
      },
    ],
    relatedSlugs: ["percentage-calculator"],
  },
  {
    id: "word-counter",
    slug: "word-counter",
    title: "Word Counter",
    tier: "star",
    category: "text",
    seoTitle:
      "Word Counter Online — Free Character & Sentence Counter | QuickTools Hub",
    seoDescription:
      "Free word counter online: count words, characters, and sentences in real time. Paste or type—no signup, instant results.",
    description:
      "Count words, characters, and sentences live as you type or paste.",
    h1: "Word Counter Online — Words, Characters & Sentences",
    introduction:
      "Use this free word counter online to see words, characters, and sentence totals update instantly. It is built for essays, posts, applications, and any draft where limits matter.\n\nEverything runs in your session in the browser—paste text, edit, and watch the stats change in real time.",
    implementation: "word-counter",
    seoContent: `A word counter online is one of the most common free online tools because writing happens everywhere: email, school papers, product pages, and social updates. QuickTools Hub keeps the experience direct—large text area, readable totals, and no account gate—so you can focus on tightening your message.

Character counts matter for SEO snippets, SMS-style limits, and form fields, while word counts help with assignments and editorial guidelines. Seeing sentences alongside words gives a quick sense of rhythm, especially when you are trimming long paragraphs.

Pair this page with calculator tools when you need quick numeric context, or use our image to PDF converter when you want to share a polished document. The hub is designed as a lightweight productivity toolkit: fast pages, mobile-friendly controls, and clear outcomes.`,
    howToUse: [
      "Paste your text into the box, or start typing directly.",
      "Watch the word, character, and sentence counts update automatically as you edit.",
      "Use “characters” for hard limits and “words” for editorial or academic targets.",
      "Copy your text out when you are finished—nothing is saved on our servers.",
      "Open a related tool if you also need PDF export or percentage math.",
    ],
    faq: [
      {
        question: "Is this word counter free to use?",
        answer:
          "Yes. It is a free online tool and does not require signup for basic counting.",
      },
      {
        question: "Do you store my text?",
        answer:
          "No server-side storage is used for counting. Your text remains in your browser while you use the page.",
      },
      {
        question: "How are words counted?",
        answer:
          "Words are split on whitespace after trimming empty edges. Punctuation stays attached to words unless separated by spaces.",
      },
      {
        question: "How are sentences estimated?",
        answer:
          "Sentences are approximated by splitting on common sentence endings. Very short fragments may be grouped depending on punctuation.",
      },
    ],
    relatedSlugs: ["percentage-calculator"],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    tier: "standard",
    category: "calculator",
    seoTitle:
      "Percentage Calculator — X% of Y & Percent Increase/Decrease | QuickTools Hub",
    seoDescription:
      "Free percentage calculator: find X% of Y and percent change between two values. Clear inputs, instant results, mobile-friendly.",
    description:
      "Find X% of Y and measure percent increase or decrease between two numbers.",
    h1: "Percentage Calculator",
    introduction:
      "Solve two everyday percentage problems in one place: calculate a portion (what is X% of Y?) and measure change between two values (percent increase or decrease).\n\nLarge inputs and simple labels make it easy to use on a phone when you are comparing prices, tips, or quick estimates.",
    implementation: "percentage-calculator",
    seoContent: `Calculator tools are most helpful when they match the questions people actually ask. This percentage calculator focuses on two patterns that show up constantly: finding a part of a whole and understanding relative change. Instead of juggling mental math, you can enter values and read a clear result.

For shopping and budgeting, percent-of calculations help you estimate discounts and allocations. For reporting, percent change helps you compare an old value to a new one without losing the sense of scale. QuickTools Hub keeps the layout minimal so you can iterate quickly.

If you are writing up results, try our word counter online to tighten explanations, or use the free image to PDF converter when you need a neat attachment. These free online tools are meant to work together as a simple productivity workflow.`,
    howToUse: [
      "For “X% of Y,” enter the percent in the first field and the base amount in the second.",
      "Read the computed result below the inputs; it updates as you type.",
      "For percent change, enter the original value and the new value.",
      "Positive change means an increase; negative change means a decrease.",
      "Adjust numbers freely to compare scenarios such as discounts or growth estimates.",
    ],
    faq: [
      {
        question: "How do you calculate percent change?",
        answer:
          "Percent change is (new − old) ÷ old × 100. If old is zero, the change is undefined.",
      },
      {
        question: "Can I use decimals?",
        answer:
          "Yes. Decimal percentages and decimal bases are supported using standard number parsing.",
      },
      {
        question: "Is this calculator free?",
        answer:
          "Yes. It is part of QuickTools Hub’s free online tools and does not require signup.",
      },
    ],
    relatedSlugs: ["image-to-pdf", "word-counter"],
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

export function getToolsByTier(tier: ToolTier): Tool[] {
  return tools.filter((t) => t.tier === tier);
}

export function getStarTools(): Tool[] {
  return tools.filter((t) => t.tier === "star");
}

export function getStandardTools(): Tool[] {
  return tools.filter((t) => t.tier === "standard");
}

/** Long-tail tools: listed for SEO discovery, not homepage heroes */
export function getSeoTailTools(): Tool[] {
  return tools.filter((t) => t.tier === "seo");
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
