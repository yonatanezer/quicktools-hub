type EventName = "tool_open" | "tool_action" | "tool_engagement";

type DataLayerEvent = {
  event: EventName;
  [key: string]: string | number | boolean | null | undefined;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushDataLayerEvent(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export type ToolEventContext = {
  tool_slug: string;
  tool_title: string;
  tool_category: string;
  tool_tier: string;
};

export function trackToolOpen(ctx: ToolEventContext): void {
  pushDataLayerEvent({
    event: "tool_open",
    ...ctx,
  });
}

export function trackToolAction(
  tool_slug: string,
  action_type: "copy" | "download" | "upload" | "open_tool_card"
): void {
  pushDataLayerEvent({
    event: "tool_action",
    tool_slug,
    action_type,
  });
}

export function trackToolEngagement(
  tool_slug: string,
  event_type:
    | "scroll_25"
    | "scroll_50"
    | "scroll_75"
    | "scroll_100"
    | "time_10s"
    | "time_30s"
    | "time_60s"
): void {
  pushDataLayerEvent({
    event: "tool_engagement",
    tool_slug,
    event_type,
  });
}
