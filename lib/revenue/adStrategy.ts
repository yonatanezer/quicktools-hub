import type { AdPlacement } from "@/lib/ad-strategy";

type TrafficCategory =
  | "high_quality_user"
  | "normal_user"
  | "suspicious_user"
  | "bot_likely";

export function getRevenueSafeAdPlacements(params: {
  basePlacements: AdPlacement[];
  trafficCategory: TrafficCategory;
}): AdPlacement[] {
  const { basePlacements, trafficCategory } = params;
  if (trafficCategory === "high_quality_user") return basePlacements;
  if (trafficCategory === "normal_user") {
    return basePlacements.includes("middle")
      ? ["top", "middle"]
      : basePlacements.slice(0, 2);
  }
  if (trafficCategory === "suspicious_user") return ["top"];
  return ["top"];
}
