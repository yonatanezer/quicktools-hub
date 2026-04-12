/**
 * Google AdSense placeholder — swap inner content for your ad unit.
 *
 * Insert AdSense script once in app/layout.tsx <head>, for example:
 *   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
 *     crossOrigin="anonymous" />
 *
 * Then replace the placeholder below with:
 *   <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="YYYYYYYYYY" />
 *   and push to adsbygoogle per Google’s snippet (often via useEffect in a small client wrapper).
 *
 * Layout uses min-height so empty slots do not collapse awkwardly.
 */

type Placement = "top" | "middle" | "bottom";

const placementLabels: Record<Placement, string> = {
  top: "Ad slot — top",
  middle: "Ad slot — middle",
  bottom: "Ad slot — bottom",
};

export function AdBanner({ placement }: { placement: Placement }) {
  return (
    <aside
      className="my-4 w-full sm:my-6"
      aria-label={`Advertisement ${placement}`}
    >
      <div className="mx-auto flex min-h-[90px] max-w-3xl items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100/80 px-4 py-6 text-center text-sm text-slate-500 sm:min-h-[100px]">
        {placementLabels[placement]}
      </div>
    </aside>
  );
}
