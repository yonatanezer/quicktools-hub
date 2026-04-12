import Link from "next/link";
import type { Tool } from "@/types/tool";

type Props = {
  currentSlug: string;
  allStarTools: Tool[];
  relatedTools: Tool[];
};

/**
 * Programmatic SEO footer: STAR tools always appear (hub); related slugs add spokes.
 * Current page star is labeled without a duplicate link.
 */
export function ToolPageInternalLinks({
  currentSlug,
  allStarTools,
  relatedTools,
}: Props) {
  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">
        More free online tools
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        QuickTools Hub links high-intent utilities together so you can finish
        related tasks in one session—no signup required.
      </p>

      {allStarTools.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-800">
            Featured tools
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Our most-used utilities: image to PDF and word counter online.
          </p>
          <ul className="mt-4 space-y-3">
            {allStarTools.map((t) => (
              <li key={t.slug}>
                {t.slug === currentSlug ? (
                  <div>
                    <span className="text-base font-semibold text-slate-900">
                      {t.title}
                    </span>
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      (you are here)
                    </span>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {t.description}
                    </p>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="text-base font-semibold text-blue-700 hover:underline"
                    >
                      {t.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {t.description}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {relatedTools.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Related tools
          </h3>
          <ul className="mt-3 space-y-2">
            {relatedTools.map((t) => (
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
