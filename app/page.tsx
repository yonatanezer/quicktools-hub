import type { Metadata } from "next";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";
import {
  getSeoTailTools,
  getStandardTools,
  getStarTools,
  tools,
} from "@/data/tools";

export const metadata: Metadata = {
  title: "Free Online Tools for Everyday Tasks | QuickTools Hub",
  description:
    "Free online tools for files, text, and math: image to PDF converter, word counter online, calculator tools, and more. No signup—fast, mobile-friendly productivity tools.",
};

export default function HomePage() {
  const starTools = getStarTools();
  const standardTools = getStandardTools();
  const seoTools = getSeoTailTools();

  return (
    <div>
      {/* Top banner ad slot (structure only — no AdSense script) */}
      <AdBanner placement="top" />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Free Online Tools for Everyday Tasks
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
          Convert files, count words, and calculate instantly — 100% free, no
          signup required.
        </p>
        <a
          href="#tools"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          Start using tools
        </a>
        <p className="mt-4 text-sm text-slate-500">
          Jump to featured tools below, or browse{" "}
          <Link href="/image-tools" className="text-blue-700 hover:underline">
            image
          </Link>
          ,{" "}
          <Link href="/text-tools" className="text-blue-700 hover:underline">
            text
          </Link>
          , and{" "}
          <Link
            href="/calculator-tools"
            className="text-blue-700 hover:underline"
          >
            calculator
          </Link>{" "}
          categories.
        </p>
      </header>

      <section
        id="tools"
        className="mt-14 scroll-mt-24 border-t border-slate-200 pt-10"
      >
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Featured tools
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Start with our most-used free online tools—built for speed on mobile
          and desktop.
        </p>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-800">
            Star tools
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {starTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="star" />
            ))}
          </div>
        </div>

        {standardTools.length > 0 ? (
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              More tools
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Supporting calculator tools and utilities that pair well with our
              featured picks.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {standardTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="standard" />
              ))}
            </div>
          </div>
        ) : null}

        {seoTools.length > 0 ? (
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              More free online tools
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Additional utilities for long-tail tasks and SEO discovery.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {seoTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="compact" />
              ))}
            </div>
          </div>
        ) : null}

        <div
          id="all-tool-pages"
          className="mt-12 rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-6"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            All tool landing pages
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Programmatic SEO index: every tool has a dedicated URL under{" "}
            <code className="rounded bg-white px-1 py-0.5 text-xs">/tools/</code>{" "}
            for Google and sharing.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
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
        </div>
      </section>

      {/* Mid-page ad slot */}
      <AdBanner placement="middle" />

      <section className="mt-12 rounded-xl border border-slate-200 bg-white px-5 py-8 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Why QuickTools Hub
        </h2>
        <ul className="mt-4 space-y-3 text-base text-slate-700">
          <li className="flex gap-3">
            <span className="font-semibold text-green-700">✓</span>
            <span>
              <strong className="text-slate-900">Free to use</strong> — core
              utilities stay free with clear, simple pages.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-green-700">✓</span>
            <span>
              <strong className="text-slate-900">No signup required</strong> —
              open a tool and get results without creating an account.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-green-700">✓</span>
            <span>
              <strong className="text-slate-900">
                Instant browser-based results
              </strong>{" "}
              — mobile-first layouts and large controls for quick tasks.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-base leading-relaxed text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">
          Free online tools for real workflows
        </h2>
        <p>
          QuickTools Hub is a growing collection of{" "}
          <strong className="font-medium text-slate-900">
            free online tools
          </strong>{" "}
          you can use for everyday productivity. If you need to package
          screenshots or photos for school or work, our{" "}
          <Link
            href="/tools/image-to-pdf"
            className="font-medium text-blue-700 hover:underline"
          >
            image to PDF converter
          </Link>{" "}
          merges JPG and PNG files into a downloadable PDF directly in the
          browser. If you are writing or editing, the{" "}
          <Link
            href="/tools/word-counter"
            className="font-medium text-blue-700 hover:underline"
          >
            word counter online
          </Link>{" "}
          helps you track words, characters, and sentences in real time so you
          can hit limits with confidence.
        </p>
        <p>
          For quick math, the hub includes{" "}
          <Link
            href="/calculator-tools"
            className="font-medium text-blue-700 hover:underline"
          >
            calculator tools
          </Link>{" "}
          such as a percentage calculator for discounts, tips, and
          comparisons. Together, these utilities form a lightweight toolkit for
          students, freelancers, and teams who want{" "}
          <strong className="font-medium text-slate-900">
            productivity tools
          </strong>{" "}
          without installing heavy software.
        </p>
        <p>
          Every tool uses a clean URL under{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            /tools/
          </code>{" "}
          so pages are easy to bookmark and share. We prioritize fast load
          times, readable typography, and layouts that work well on phones,
          because most quick tasks happen on the go. Explore the featured
          section above to start with our highest-intent utilities, then browse
          categories when you need a specialized workflow.
        </p>
        <p>
          Whether you need an{" "}
          <strong className="font-medium text-slate-900">
            image to PDF converter
          </strong>{" "}
          for class submissions, a{" "}
          <strong className="font-medium text-slate-900">
            word counter online
          </strong>{" "}
          for tightening a cover letter, or{" "}
          <strong className="font-medium text-slate-900">
            calculator tools
          </strong>{" "}
          for quick comparisons, the goal is the same: fewer steps between you
          and a finished task. That focus on speed and clarity is what makes
          lightweight{" "}
          <strong className="font-medium text-slate-900">
            productivity tools
          </strong>{" "}
          valuable for daily use.
        </p>
      </section>

      {/* Bottom ad slot */}
      <AdBanner placement="bottom" />
    </div>
  );
}
