import Link from "next/link";
import { getStarTools, getToolBySlug } from "@/data/tools";

type Props = {
  currentSlug: string;
  relatedSlugs: string[];
};

export function ToolPageInternalLinks({ currentSlug, relatedSlugs }: Props) {
  const stars = getStarTools().filter((t) => t.slug !== currentSlug);
  const related = relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t) => t && t.slug !== currentSlug);


const relatedDeduped = related
  .filter((t): t is NonNullable<typeof t> => t != null)
  .filter(
    (t) => !stars.some((s) => s.slug === t.slug)
  );

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">
        Explore more free online tools
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        QuickTools Hub groups productivity tools you can run in the browser—no
        signup required.
      </p>

      {stars.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Popular tools
          </h3>
          <ul className="mt-3 space-y-3">
            {stars.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="text-base font-semibold text-blue-700 hover:underline"
                >
                  {t.title}
                </Link>
                <p className="mt-0.5 text-sm text-slate-600">{t.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {relatedDeduped.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Related tools
          </h3>
          <ul className="mt-3 space-y-2">
            {relatedDeduped.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="font-medium text-blue-700 hover:underline"
                >
                  {t.title}
                </Link>
                <span className="text-slate-600"> — {t.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-8 text-sm text-slate-600">
        Browse by category:{" "}
        <Link href="/image-tools" className="text-blue-700 hover:underline">
          image tools
        </Link>
        ,{" "}
        <Link href="/text-tools" className="text-blue-700 hover:underline">
          text tools
        </Link>
        , or{" "}
        <Link
          href="/calculator-tools"
          className="text-blue-700 hover:underline"
        >
          calculator tools
        </Link>
        .
      </p>
    </section>
  );
}
