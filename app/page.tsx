import type { Metadata } from "next";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";
import { getStandardTools, getStarTools, tools } from "@/data/tools";
import { brandIdentity } from "@/lib/brand/identity";
import type { ToolCategory } from "@/types/tool";

export const metadata: Metadata = {
  title: "Free Online Tools for Everyday Productivity | QuickTools Hub",
  description:
    "QuickTools Hub is an SEO-first platform for free online tools: PDF workflows, business and time calculators, text utilities, image helpers, and everyday math tools.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const starTools = getStarTools();
  const standardTools = getStandardTools();
  const categoryOrder: ToolCategory[] = [
    "pdf-tools",
    "business-tools",
    "text-tools",
    "image-tools",
    "calculator-tools",
  ];
  const standardToolsByCategory = categoryOrder
    .map((category) => ({
      category,
      tools: standardTools
        .filter((tool) => tool.category === category)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((group) => group.tools.length > 0);

  const categoryLabels: Record<ToolCategory, string> = {
    "pdf-tools": "PDF",
    "business-tools": "Business & time",
    "text-tools": "Text",
    "image-tools": "Image",
    "calculator-tools": "Basic calculators",
  };
  const categoryCards = [
    {
      title: "PDF Tools",
      description: "Convert, merge, split, and compress PDF files in practical flows.",
      href: "/pdf-tools",
    },
    {
      title: "Business & Time Tools",
      description: "Run ROI, loan, and SLA calculations for high-value decisions.",
      href: "/business-tools",
    },
    {
      title: "Text Tools",
      description: "Count words, refine copy, and handle writing workflows quickly.",
      href: "/text-tools",
    },
    {
      title: "Image Tools",
      description: "Convert color values and handle quick visual formatting tasks.",
      href: "/image-tools",
    },
    {
      title: "Basic Calculators",
      description: "Solve percentage, unit, and everyday calculation tasks quickly.",
      href: "/calculator-tools",
    },
  ] as const;

  const featureCards = [
    {
      title: "Fast tools",
      description:
        "Open a tool and finish the job in a few steps with performance-focused pages.",
    },
    {
      title: "SEO optimized",
      description:
        "Every tool has a structured landing page that is indexable and easy to discover.",
    },
    {
      title: "Mobile friendly",
      description:
        "Readable layouts, large controls, and responsive spacing across all devices.",
    },
    {
      title: "Free to use",
      description:
        "Core utilities are free forever with no account creation required.",
    },
  ] as const;

  return (
    <div className="space-y-14 sm:space-y-16">
      <AdBanner placement="top" />

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          {brandIdentity.positioning}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Free Online Tools for Everyday Productivity
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          A modern utility SaaS for document conversion, business workflows, text
          cleanup, and practical calculations. Fast, simple, and built for real work
          with no signup.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={brandIdentity.primaryCta.href}
            className="btn-primary min-h-[46px]"
          >
            {brandIdentity.primaryCta.label}
          </a>
          <a
            href={brandIdentity.secondaryCta.href}
            className="btn-secondary min-h-[46px]"
          >
            {brandIdentity.secondaryCta.label}
          </a>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
        {brandIdentity.trustSignals.map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-800">{item}</p>
          </div>
        ))}
      </section>

      <section id="tools-section">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Explore categories
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Each category is a focused entry point to help users go from search
            intent to completed task with fewer clicks.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categoryCards.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {category.description}
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-blue-700">
                Browse category →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner placement="middle" />

      <section>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Built like a product, not a tool dump
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            QuickTools Hub follows a clean SaaS design system: modern cards,
            consistent interactions, and friction-free flows for repeated use.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="popular-tools">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Start with the most-used tools that convert best from organic search
            and repeat usage.
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {starTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} variant="star" />
          ))}
        </div>
        {standardTools.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Additional tools
            </h3>
            <div className="mt-4 space-y-8">
              {standardToolsByCategory.map((group) => (
                <section key={group.category}>
                  <h4 className="text-sm font-semibold text-slate-700">
                    {categoryLabels[group.category]} tools
                  </h4>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} variant="standard" />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Free online productivity tools with a professional UX
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
          <p>
            QuickTools Hub is a premium-style utility platform built for people
            who need reliable free online tools without signup barriers. Whether
            you need an image to PDF converter, a word counter online, PDF tools,
            or calculator utilities, each page is designed for speed, clarity,
            and search intent alignment.
          </p>
          <p>
            The site architecture is SEO-first and scales for 100+ tools with
            consistent metadata, semantic headings, and crawlable internal links.
            Every tool page sits under{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              /tools/
            </code>{" "}
            for discoverability and clean indexing.
          </p>
          <p>
            Our focus is simple: help users complete real tasks quickly while
            keeping the interface trustworthy, minimal, and mobile friendly.
            Browse categories, open a tool, and get results instantly.
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {tools.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tools/${t.slug}`}
                className="font-medium text-blue-700 hover:underline"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Start with one tool. Finish the task in minutes.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
          Choose a category and use professional online tools that are free, fast,
          and designed for real workflows.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pdf-tools"
            className="btn-primary min-h-[46px]"
          >
            Open PDF tools
          </Link>
          <Link
            href="/image-tools"
            className="btn-secondary min-h-[46px]"
          >
            Browse image tools
          </Link>
        </div>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}
