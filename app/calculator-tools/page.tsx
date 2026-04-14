import type { Metadata } from "next";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "calculator" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
};

export default function CalculatorToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <div>
      <AdBanner placement="top" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Calculator tools
      </h1>
      <p className="mt-4 text-lg text-slate-600">{seo.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        Also see{" "}
        <Link href="/image-tools" className="text-blue-700 hover:underline">
          image tools
        </Link>{" "}
        ,{" "}
        <Link href="/text-tools" className="text-blue-700 hover:underline">
          text tools
        </Link>
        , and{" "}
        <Link href="/pdf-tools" className="text-blue-700 hover:underline">
          PDF tools
        </Link>
        .
      </p>

      <AdBanner placement="middle" />

      <section className="mt-8 space-y-4 text-base leading-relaxed text-slate-700">
        {seo.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">
        Tools in this category
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <AdBanner placement="bottom" />
    </div>
  );
}
