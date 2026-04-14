import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import { HowToUseSection } from "@/components/HowToUseSection";
import { ToolPageTracker } from "@/components/ToolPageTracker";
import { ToolPageInternalLinks } from "@/components/ToolPageInternalLinks";
import { ToolSeoSections } from "@/components/ToolSeoSections";
import { getToolBySlug, getToolPageLinkSections, tools } from "@/data/tools";
import { getRevenueOptimizedAdPlacementsForTool } from "@/lib/ad-strategy";
import { ToolImplementationView } from "@/lib/tool-implementations";
import { buildToolPageMetadata } from "@/lib/seo/tool-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Not found" };
  return buildToolPageMetadata(tool);
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const introParagraphs = tool.introduction
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const { allStarTools, relatedTools } = getToolPageLinkSections(tool);
  const adPlacements = getRevenueOptimizedAdPlacementsForTool(tool, "normal_user");

  return (
    <article className="space-y-10 sm:space-y-12">
      <ToolPageTracker
        tool={{
          tool_slug: tool.slug,
          tool_title: tool.title,
          tool_category: tool.category,
          tool_tier: tool.tier,
        }}
      />
      {adPlacements.includes("top") ? <AdBanner placement="top" /> : null}

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Free professional online tool
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {tool.h1}
        </h1>
        <div className="mt-4 max-w-3xl space-y-3 text-lg leading-relaxed text-slate-600">
          {introParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-labelledby="tool-ui-heading"
      >
        <h2
          id="tool-ui-heading"
          className="text-lg font-semibold text-slate-900"
        >
          Use this tool now
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No signup required. Upload or enter your data and get instant results.
        </p>
        <div className="mt-4">
          <ToolImplementationView
            implementation={tool.implementation}
            toolSlug={tool.slug}
          />
        </div>
      </section>

      {adPlacements.includes("middle") ? <AdBanner placement="middle" /> : null}

      <section className="space-y-10 rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
        <HowToUseSection steps={tool.howToUse} />
        <ToolSeoSections tool={tool} />
        <ToolPageInternalLinks
          currentSlug={tool.slug}
          allStarTools={allStarTools}
          relatedTools={relatedTools}
        />
      </section>

      {adPlacements.includes("bottom") ? <AdBanner placement="bottom" /> : null}
    </article>
  );
}
