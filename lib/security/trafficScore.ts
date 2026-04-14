type TrafficCategory =
  | "high_quality_user"
  | "normal_user"
  | "suspicious_user"
  | "bot_likely";

type SecurityEventType =
  | "request"
  | "tool_open"
  | "tool_action"
  | "tool_engagement";

type SecurityEvent = { ts: number; type: SecurityEventType; endpoint?: string };

type SessionState = {
  events: SecurityEvent[];
  lastTs: number;
};

const sessionByKey = new Map<string, SessionState>();
const WINDOW_MS = 10 * 60 * 1000;

function now() {
  return Date.now();
}

function getOrCreateState(key: string): SessionState {
  const existing = sessionByKey.get(key);
  if (existing) return existing;
  const created: SessionState = { events: [], lastTs: now() };
  sessionByKey.set(key, created);
  return created;
}

function trimWindow(state: SessionState, ts: number) {
  const minTs = ts - WINDOW_MS;
  state.events = state.events.filter((e) => e.ts >= minTs);
}

function isLikelyCrawler(ua: string): boolean {
  return /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot)/i.test(ua);
}

export function recordSecurityEvent(params: {
  key: string;
  type: SecurityEventType;
  endpoint?: string;
}): void {
  const ts = now();
  const state = getOrCreateState(params.key);
  trimWindow(state, ts);
  state.events.push({ ts, type: params.type, endpoint: params.endpoint });
  state.lastTs = ts;
}

export function scoreTraffic(params: {
  key: string;
  userAgent: string;
  endpoint?: string;
  clientUsageDepth?: number;
  interActionMs?: number;
}): { score: number; category: TrafficCategory } {
  const ts = now();
  const state = getOrCreateState(params.key);
  trimWindow(state, ts);

  const events = state.events;
  const requestCount = events.filter((e) => e.type === "request").length;
  const heavyCount = events.filter(
    (e) => e.type === "request" && e.endpoint?.includes("word-to-pdf")
  ).length;
  const openCount = events.filter((e) => e.type === "tool_open").length;
  const actionCount = events.filter((e) => e.type === "tool_action").length;
  const engagementCount = events.filter(
    (e) => e.type === "tool_engagement"
  ).length;

  if (isLikelyCrawler(params.userAgent)) {
    return { score: 90, category: "high_quality_user" };
  }

  let score = 55;
  if (requestCount <= 8) score += 10;
  if (requestCount > 20) score -= 12;
  if (heavyCount > 5) score -= 16;

  const depthFromClient = Math.max(0, Math.min(3, params.clientUsageDepth ?? 0));
  score += depthFromClient * 8;

  if (openCount > 0 && actionCount > 0) score += 6;
  if (actionCount > 0 && engagementCount > 0) score += 8;

  if (params.interActionMs !== undefined && params.interActionMs < 500) score -= 15;
  if (params.interActionMs !== undefined && params.interActionMs > 4000) score += 4;

  const gap = ts - state.lastTs;
  if (gap < 300) score -= 10;
  if (gap > 1500) score += 2;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let category: TrafficCategory = "normal_user";
  if (score >= 80) category = "high_quality_user";
  else if (score < 25) category = "bot_likely";
  else if (score < 45) category = "suspicious_user";

  return { score, category };
}
