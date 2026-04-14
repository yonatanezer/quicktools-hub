"use client";

import { useEffect, useRef } from "react";

type Placement = "top" | "middle" | "bottom";

type Props = {
  placement: Placement;
  adSlotId: string;
  minHeight?: number;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSlot({
  placement,
  adSlotId,
  minHeight = 100,
  className = "",
}: Props) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      if (!window.adsbygoogle) return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      window.dataLayer?.push({
        event: "ad_slot_rendered",
        placement,
      });
      pushedRef.current = true;
    } catch {
      // Safe fail: do not crash page rendering for ad errors.
    }
  }, [placement]);

  return (
    <div
      className={`mx-auto w-full max-w-3xl overflow-hidden rounded-lg ${className}`}
      style={{ minHeight }}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
