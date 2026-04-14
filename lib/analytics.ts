type EventName =
  | "tool_open"
  | "tool_action"
  | "tool_engagement"
  | "ad_slot_rendered";

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

type ClientSignalState = {
  openCount: number;
  actionCount: number;
  engagementCount: number;
  lastEventAt: number;
  prevEventAt: number;
};

const CLIENT_SIGNAL_KEY = "qth_client_signal_state_v1";

function readClientSignals(): ClientSignalState {
  if (typeof window === "undefined") {
    return {
      openCount: 0,
      actionCount: 0,
      engagementCount: 0,
      lastEventAt: 0,
      prevEventAt: 0,
    };
  }
  try {
    const raw = window.sessionStorage.getItem(CLIENT_SIGNAL_KEY);
    if (!raw) throw new Error("missing");
    const parsed = JSON.parse(raw) as ClientSignalState;
    return {
      openCount: parsed.openCount ?? 0,
      actionCount: parsed.actionCount ?? 0,
      engagementCount: parsed.engagementCount ?? 0,
      lastEventAt: parsed.lastEventAt ?? 0,
      prevEventAt: parsed.prevEventAt ?? 0,
    };
  } catch {
    return {
      openCount: 0,
      actionCount: 0,
      engagementCount: 0,
      lastEventAt: 0,
      prevEventAt: 0,
    };
  }
}

function writeClientSignals(next: ClientSignalState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CLIENT_SIGNAL_KEY, JSON.stringify(next));
}

function markClientSignal(kind: "open" | "action" | "engagement"): void {
  const current = readClientSignals();
  const now = Date.now();
  const next: ClientSignalState = {
    ...current,
    prevEventAt: current.lastEventAt,
    lastEventAt: now,
  };
  if (kind === "open") next.openCount += 1;
  if (kind === "action") next.actionCount += 1;
  if (kind === "engagement") next.engagementCount += 1;
  writeClientSignals(next);
}

export function getClientUsageSignals(): {
  usageDepth: number;
  interActionMs: number;
} {
  const state = readClientSignals();
  let usageDepth = 0;
  if (state.openCount > 0) usageDepth += 1;
  if (state.actionCount > 0) usageDepth += 1;
  if (state.engagementCount > 0) usageDepth += 1;
  const interActionMs =
    state.prevEventAt > 0 ? Math.max(0, state.lastEventAt - state.prevEventAt) : 0;
  return { usageDepth, interActionMs };
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
  markClientSignal("open");
}

export function trackToolAction(
  tool_slug: string,
  action_type:
    | "copy"
    | "download"
    | "upload"
    | "open_tool_card"
    | "conversion_complete"
): void {
  pushDataLayerEvent({
    event: "tool_action",
    tool_slug,
    action_type,
  });
  markClientSignal("action");
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
  markClientSignal("engagement");
}
