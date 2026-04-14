import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import { HowToUseSection } from "@/components/HowToUseSection";
import { ToolPageTracker } from "@/components/ToolPageTracker";
import { ToolPageInternalLinks } from "@/components/ToolPageInternalLinks";
import { ToolSeoSections } from "@/components/ToolSeoSections";
import { getToolBySlug, getToolPageLinkSections, tools } from "@/data/tools";
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

  return (
    <article>
      <ToolPageTracker
        tool={{
          tool_slug: tool.slug,
          tool_title: tool.title,
          tool_category: tool.category,
          tool_tier: tool.tier,
        }}
      />
      <AdBanner placement="top" />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {tool.h1}
      </h1>
      <div className="mt-4 max-w-2xl space-y-3 text-lg leading-relaxed text-slate-600">
        {introParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <section
        className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-labelledby="tool-ui-heading"
      >
        <h2
          id="tool-ui-heading"
          className="text-lg font-semibold text-slate-900"
        >
          Use the tool
        </h2>
        <div className="mt-4">
          <ToolImplementationView
            implementation={tool.implementation}
            toolSlug={tool.slug}
          />
        </div>
      </section>

      <AdBanner placement="middle" />

      <HowToUseSection steps={tool.howToUse} />
      <ToolSeoSections tool={tool} />
      <ToolPageInternalLinks
        currentSlug={tool.slug}
        allStarTools={allStarTools}
        relatedTools={relatedTools}
      />

      <AdBanner placement="bottom" />
    </article>
  );
}
