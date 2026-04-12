import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import { HowToUseSection } from "@/components/HowToUseSection";
import { ToolPageInternalLinks } from "@/components/ToolPageInternalLinks";
import { ToolSeoSections } from "@/components/ToolSeoSections";
import { getToolBySlug, tools } from "@/data/tools";
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
    .filter(Boolean);

  return (
    <article>
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
        aria-label="Tool"
      >
        <h2 className="sr-only">{tool.title}</h2>
        <ToolImplementationView implementation={tool.implementation} />
      </section>

      <AdBanner placement="middle" />

      <HowToUseSection steps={tool.howToUse} />
      <ToolSeoSections tool={tool} />
      <ToolPageInternalLinks
        currentSlug={tool.slug}
        relatedSlugs={tool.relatedSlugs}
      />

      <AdBanner placement="bottom" />
    </article>
  );
}
