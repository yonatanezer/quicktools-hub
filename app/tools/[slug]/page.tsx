import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSeoSections } from "@/components/ToolSeoSections";
import { getToolBySlug, tools } from "@/data/tools";
import { ToolImplementationView } from "@/lib/tool-implementations";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Not found" };
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <article>
      <AdBanner placement="top" />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {tool.title}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{tool.description}</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <ToolImplementationView implementation={tool.implementation} />
      </div>

      <AdBanner placement="middle" />

      <ToolSeoSections tool={tool} />
      <RelatedTools slugs={tool.relatedSlugs} />

      <AdBanner placement="bottom" />
    </article>
  );
}
