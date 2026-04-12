/**
 * Programmatic SEO registry: each entry is one indexable landing page at `/tools/[slug]`.
 * Slugs = intent keywords (hyphenated). Tiers drive homepage placement and internal link graph.
 *
 * Hub-and-spoke: all tool pages surface STAR tools in the footer; `relatedSlugs` add spokes.
 * For `tier: "seo"`, keep `relatedSlugs` pointing only to `star` or `standard` tools (link upward).
 */

import type { Tool, ToolTier } from "@/types/tool";

export const tools: Tool[] = [
  {
    id: "image-to-pdf",
    slug: "image-to-pdf",
    title: "Image to PDF",
    tier: "star",
    category: "image",
    seoTitle:
      "Free Online Image to PDF Converter – Merge JPG & PNG into One PDF | QuickTools Hub",
    seoDescription:
      "Convert JPG and PNG to PDF online for free. Merge multiple images into one PDF in your browser—private, fast, no signup.",
    description:
      "Turn JPG or PNG images into a single PDF—runs locally in your browser.",
    h1: "Free Online Image to PDF Converter",
    introduction:
      "Use this free online image to PDF converter to merge JPG or PNG files into one downloadable PDF in seconds. Everything runs in your browser, so your images are not uploaded to our servers.\n\nPerfect for homework, invoices, screenshots, and sharing clean PDF attachments without installing software.",
    implementation: "image-to-pdf",
    seoContent: `People search for an image to PDF converter when they need a fast way to turn photos or scans into a single document. This page is built for that exact intent: pick your files, build the PDF, and download it. Because the process runs locally in the browser, it works well when you want to avoid uploading sensitive screenshots or personal photos to a third party.

If you are comparing options, look for tools that keep steps obvious—upload, order your pages, export—and that behave predictably on mobile. Many workflows start on a phone: a photo of a receipt, a classroom handout, or a signed form. A lightweight PDF makes those files easier to email or upload to a portal without losing quality.

You can also pair this utility with other free online tools when your task spans formats. For example, after you finalize text in a draft, a word counter online can help you hit limits before you export supporting images to PDF. When you need quick math around discounts or growth, calculator tools on the same hub keep you from context-switching into spreadsheets.

QuickTools Hub is designed as a set of standalone SEO landing pages: each tool targets a specific query and explains real use cases in plain language. Whether you call it a JPG to PDF converter, PNG to PDF merge, or simply “print to PDF from images,” the outcome is the same—a portable document you can share confidently.`,
    howToUse: [
      "Tap “Choose files” and select one or more JPG or PNG images from your device.",
      "Images become PDF pages in the order you select them—re-pick files if you need a different order.",
      "Wait briefly while your browser builds the PDF; very large photos may take a few extra seconds.",
      "Download the PDF when your browser prompts you, then save or share it as needed.",
      "Run the flow again anytime you need a separate PDF file for a new batch.",
    ],
    faq: [
      {
        question: "Is this JPG to PDF converter free?",
        answer:
          "Yes. QuickTools Hub offers this image to PDF converter as a free online tool with no signup required for basic use.",
      },
      {
        question: "Are my images uploaded to your server?",
        answer:
          "No. Conversion uses JavaScript in your browser. Files stay on your device unless you choose to share the PDF elsewhere.",
      },
      {
        question: "Can I merge multiple images into one PDF?",
        answer:
          "Yes. Select multiple JPG or PNG files and download a single merged PDF.",
      },
      {
        question: "What image formats work best?",
        answer:
          "JPG and PNG are supported. Clear, high-contrast images usually produce sharper text in the exported PDF.",
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
      "Free Online Word Counter – Count Words, Characters & Sentences Instantly | QuickTools Hub",
    seoDescription:
      "Count words, characters, and sentences online instantly. Free word counter for essays, posts, and SEO—paste or type, real-time results, no signup.",
    description:
      "Count words, characters, and sentences live as you type or paste.",
    h1: "Free Online Word Counter — Words, Characters & Sentences",
    introduction:
      "This free online word counter shows words, characters, and sentence totals as you type or paste. It is built for students, writers, and marketers who need accurate counts without opening a heavy editor.\n\nUse it for essays, applications, social posts, and meta descriptions—everything updates instantly in your browser.",
    implementation: "word-counter",
    seoContent: `A word counter online is one of the most searched free online tools because writing happens everywhere: email, school papers, product pages, and social captions. This landing page targets that intent with a simple workflow—paste, edit, and read live stats—so you can stay focused on the message instead of the mechanics.

Character counts matter when platforms enforce hard limits. Word counts matter when prompts ask for a specific length. Sentence counts are a quick sanity check when a paragraph feels long on mobile. Together, these metrics help you tune clarity and pacing without exporting to another app.

Searchers often look for variations like “character counter,” “word count tool,” or “how many words is this paragraph.” The same underlying need is speed and trust: you want the numbers to update immediately as you revise. That is why this tool keeps the interface minimal and the typography readable on small screens.

QuickTools Hub also connects related workflows. If you need to package screenshots after editing copy, an image to PDF converter can turn those images into a tidy attachment. If you need quick numeric context—discounts, tips, or percent change—calculator tools round out a lightweight productivity set. Each page is written to stand alone in Google while still linking to the hub’s strongest utilities, which helps users discover the next step naturally.`,
    howToUse: [
      "Paste your text into the large text area, or start typing from scratch.",
      "Watch words, characters (with and without spaces where shown), and sentences update automatically.",
      "Edit freely; counts reflect the current text on the page at all times.",
      "Copy your finished text out when you are done—nothing is stored on our servers.",
      "Open a related tool from the links below if you also need PDF export or percentage math.",
    ],
    faq: [
      {
        question: "Is this word counter free?",
        answer:
          "Yes. It is a free online word counter and does not require an account for basic counting.",
      },
      {
        question: "Do you save my text?",
        answer:
          "No server-side storage is used. Your text stays in your browser session while you use the page.",
      },
      {
        question: "How are words counted?",
        answer:
          "Words are split on whitespace after trimming. Punctuation usually stays attached to the word it follows unless separated by a space.",
      },
      {
        question: "Is this accurate for SEO meta descriptions?",
        answer:
          "Character counts are useful as a guide, but always confirm the exact limit in your CMS or search console previews.",
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
      "Free Percentage Calculator Online – X% of Y & Percent Increase or Decrease | QuickTools Hub",
    seoDescription:
      "Calculate percentages online: what is X% of Y, and percent change between two numbers. Free, fast, mobile-friendly—no signup.",
    description:
      "Find X% of Y and measure percent increase or decrease between two numbers.",
    h1: "Free Online Percentage Calculator",
    introduction:
      "Solve two common percentage questions in one place: find a percent of a number (X% of Y) and measure percent increase or decrease between an old and new value.\n\nLarge inputs and clear labels make it easy to use on a phone when you are comparing prices, tips, or quick estimates.",
    implementation: "percentage-calculator",
    seoContent: `Percentage calculator searches usually come from a practical moment: you are checking a discount, estimating a tip, or comparing last month’s numbers to this month’s. This page is structured for that intent—two focused calculators with immediate results—so you can get an answer and move on without spreadsheet setup.

When someone asks “what is 15 percent of 200,” they want a reliable result and a layout that does not hide the inputs. When someone asks “what percent increase is this,” they are often translating a story into a headline number. Showing both patterns on one page reduces pogo-sticking between multiple tabs.

Calculator tools work best when they feel trustworthy on mobile: big fields, readable output, and no noisy clutter. That is the same standard we apply across QuickTools Hub, whether you are converting images to PDF or counting words in a draft. The goal is fast pages that match the query and explain the use case in natural language.

If you are writing up your findings afterward, a word counter online can help you keep explanations tight. If you need to attach evidence as a single file, an image to PDF converter can package screenshots cleanly. These internal links are intentional: they connect related tasks and help visitors discover the hub’s strongest utilities after they finish their first job.`,
    howToUse: [
      "For “What is X% of Y?”, enter the percentage and the base amount.",
      "Read the result below; it updates as you change either value.",
      "For percent change, enter the original value and the new value.",
      "Interpret a positive result as an increase and a negative result as a decrease.",
      "Try a few scenarios—like stacked discounts or stepwise growth—to compare outcomes quickly.",
    ],
    faq: [
      {
        question: "How is percent change calculated?",
        answer:
          "We use (new − old) ÷ old × 100. If the old value is zero, percent change is undefined.",
      },
      {
        question: "Can I enter decimals?",
        answer:
          "Yes. Decimal percentages and decimal bases are supported.",
      },
      {
        question: "Is this percentage calculator free?",
        answer:
          "Yes. It is part of QuickTools Hub’s free online calculator tools and does not require signup.",
      },
      {
        question: "Does this work on mobile?",
        answer:
          "Yes. The layout uses large inputs and spacing suited to phones.",
      },
    ],
    relatedSlugs: ["image-to-pdf", "word-counter"],
  },
];

export const toolsBySlug: Map<string, Tool> = new Map(
  tools.map((t) => [t.slug, t])
);

/** Route / metadata boundary — returns undefined for unknown slugs. */
export function getToolBySlug(slug: string): Tool | undefined {
  return toolsBySlug.get(slug);
}

/**
 * Resolves slugs from the registry. Throws if any slug is missing — keeps UI free of undefined checks.
 */
export function getToolsForSlugs(slugs: readonly string[]): Tool[] {
  return slugs.map((slug) => {
    const tool = toolsBySlug.get(slug);
    if (tool === undefined) {
      throw new Error(`Unknown relatedSlugs entry: "${slug}"`);
    }
    return tool;
  });
}

export function getToolsByCategory(category: string): Tool[] {
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

export function getSeoTailTools(): Tool[] {
  return tools.filter((t) => t.tier === "seo");
}

const isHubTier = (t: Tool) => t.tier === "star" || t.tier === "standard";

/**
 * Hub-and-spoke internal links for tool footers.
 * - `allStarTools`: always every STAR tool (UI links to siblings; marks current page).
 * - `relatedTools`: from `relatedSlugs`, excludes stars and current; SEO-tier pages only link upward.
 */
export function getToolPageLinkSections(current: Tool): {
  allStarTools: Tool[];
  relatedTools: Tool[];
} {
  const allStarTools = getStarTools();
  let related = getToolsForSlugs(current.relatedSlugs).filter(
    (t) => t.slug !== current.slug
  );
  if (current.tier === "seo") {
    related = related.filter(isHubTier);
  }
  const relatedTools = related.filter(
    (t) => !allStarTools.some((s) => s.slug === t.slug)
  );
  return { allStarTools, relatedTools };
}

const categoryKeys = ["image", "text", "calculator"] as const;
export type CategoryPageId = (typeof categoryKeys)[number];

export const categorySeo: Record<
  CategoryPageId,
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
