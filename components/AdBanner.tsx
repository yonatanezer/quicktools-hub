import { AdSlot } from "@/components/AdSlot";

type Placement = "top" | "middle" | "bottom";

const placementLabels: Record<Placement, string> = {
  top: "Ad slot — top",
  middle: "Ad slot — middle",
  bottom: "Ad slot — bottom",
};

const SLOT_CONFIG: Record<
  Placement,
  { slot: string | undefined; minHeight: number }
> = {
  top: { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP, minHeight: 100 },
  middle: { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE, minHeight: 120 },
  bottom: { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM, minHeight: 100 },
};

export function AdBanner({ placement }: { placement: Placement }) {
  const cfg = SLOT_CONFIG[placement];
  const isProduction = process.env.NODE_ENV === "production";
  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT) && Boolean(cfg.slot);
  const shouldRenderLiveAd = isProduction && hasEnv;

  return (
    <aside
      className="my-4 w-full sm:my-6"
      aria-label={`Advertisement ${placement}`}
    >
      {shouldRenderLiveAd ? (
        <AdSlot
          placement={placement}
          adSlotId={cfg.slot!}
          minHeight={cfg.minHeight}
          className="border border-transparent"
        />
      ) : (
        <div
          className="mx-auto flex max-w-3xl items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100/80 px-4 py-6 text-center text-sm text-slate-500"
          style={{ minHeight: cfg.minHeight }}
        >
          {placementLabels[placement]}
        </div>
      )}
    </aside>
  );
}
