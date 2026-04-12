import Link from "next/link";
import type { Tool } from "@/data/tools";

const categoryLabel: Record<Tool["category"], string> = {
  image: "Image",
  text: "Text",
  calculator: "Calculator",
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {categoryLabel[tool.category]}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">{tool.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {tool.description}
      </p>
    </Link>
  );
}
