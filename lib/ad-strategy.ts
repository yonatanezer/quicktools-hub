import type { Tool } from "@/types/tool";
import { getRevenueSafeAdPlacements } from "@/lib/revenue/adStrategy";

export type ToolIntent = "high_intent" | "medium_intent" | "low_intent";
export type AdPlacement = "top" | "middle" | "bottom";
export type TrafficQualityCategory =
  | "high_quality_user"
  | "normal_user"
  | "suspicious_user"
  | "bot_likely";

export function getToolIntent(tool: Tool): ToolIntent {
  if (tool.category === "pdf" || tool.category === "image") {
    return "high_intent";
  }
  if (tool.category === "text") {
    return "medium_intent";
  }
  return "low_intent";
}

export function getAdPlacementsForTool(tool: Tool): AdPlacement[] {
  const intent = getToolIntent(tool);
  if (intent === "high_intent") return ["top", "middle", "bottom"];
  if (intent === "medium_intent") return ["top", "bottom"];
  return ["middle"];
}

export function getRevenueOptimizedAdPlacementsForTool(
  tool: Tool,
  trafficCategory: TrafficQualityCategory = "normal_user"
): AdPlacement[] {
  const basePlacements = getAdPlacementsForTool(tool);
  return getRevenueSafeAdPlacements({
    basePlacements,
    trafficCategory,
  });
}
