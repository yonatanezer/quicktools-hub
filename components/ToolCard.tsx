import Link from "next/link";
import type { Tool } from "@/data/tools";

const categoryLabel: Record<Tool["category"], string> = {
  image: "Image",
  text: "Text",
  calculator: "Calculator",
};

const tierLabel: Record<Tool["tier"], string> = {
  star: "Featured",
  standard: "Tool",
  seo: "More tools",
};

export type ToolCardVariant = "star" | "standard" | "compact";

function variantFromTier(tier: Tool["tier"]): ToolCardVariant {
  if (tier === "star") return "star";
  if (tier === "standard") return "standard";
  return "compact";
}

export function ToolCard({
  tool,
  variant: variantProp,
}: {
  tool: Tool;
  variant?: ToolCardVariant;
}) {
  const variant = variantProp ?? variantFromTier(tool.tier);

  const shell =
    variant === "star"
      ? "rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-md ring-1 ring-blue-100 sm:p-8"
      : variant === "standard"
        ? "rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        : "rounded-lg border border-slate-200 bg-white p-4 shadow-sm";

  const titleClass =
    variant === "star"
      ? "mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
      : variant === "standard"
        ? "mt-2 text-lg font-semibold text-slate-900"
        : "mt-1 text-base font-semibold text-slate-900";

  const descClass =
    variant === "star"
      ? "mt-3 text-base leading-relaxed text-slate-600"
      : variant === "standard"
        ? "mt-2 text-sm leading-relaxed text-slate-600"
        : "mt-1 text-sm leading-relaxed text-slate-600";

  const badgeClass =
    variant === "compact"
      ? "text-[10px] font-medium uppercase tracking-wide text-slate-500"
      : "text-xs font-medium uppercase tracking-wide text-slate-500";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`block transition hover:border-blue-300 hover:shadow-md ${shell}`}
    >
      <p className={badgeClass}>
        {categoryLabel[tool.category]}
        {variant === "star" ? ` · ${tierLabel[tool.tier]}` : null}
      </p>
      <h2 className={titleClass}>{tool.title}</h2>
      <p className={descClass}>{tool.description}</p>
      {variant === "star" ? (
        <span className="mt-4 inline-block text-sm font-semibold text-blue-700">
          Open tool →
        </span>
      ) : null}
    </Link>
  );
}
