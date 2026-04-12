import Link from "next/link";
import { getToolBySlug } from "@/data/tools";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  if (!items.length) return null;

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">Related tools</h2>
      <ul className="mt-4 space-y-2">
        {items.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tools/${t.slug}`}
              className="text-base font-medium text-blue-700 hover:underline"
            >
              {t.title}
            </Link>
            <span className="text-slate-600"> — {t.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
