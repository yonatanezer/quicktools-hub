import { recordSecurityEvent } from "@/lib/security/trafficScore";

type AbuseResult = {
  suspicious: boolean;
  shouldSoftThrottle: boolean;
  reason?: string;
};

type DetectParams = {
  key: string;
  endpoint: string;
  score: number;
  category: "high_quality_user" | "normal_user" | "suspicious_user" | "bot_likely";
};

const hitMap = new Map<string, number[]>();
const WINDOW_MS = 60_000;

function now() {
  return Date.now();
}

function recentHits(key: string): number[] {
  const ts = now();
  const list = hitMap.get(key) ?? [];
  const filtered = list.filter((n) => ts - n <= WINDOW_MS);
  hitMap.set(key, filtered);
  return filtered;
}

export function detectAbuse(params: DetectParams): AbuseResult {
  const key = `${params.key}:${params.endpoint}`;
  const hits = recentHits(key);
  hits.push(now());
  hitMap.set(key, hits);

  recordSecurityEvent({
    key: params.key,
    type: "request",
    endpoint: params.endpoint,
  });

  const rapidBurst = hits.length >= 8;
  const heavyEndpoint = /word-to-pdf/i.test(params.endpoint);
  const suspicious = params.category === "bot_likely" || params.category === "suspicious_user";

  if ((rapidBurst && heavyEndpoint) || (suspicious && hits.length >= 5)) {
    const reason = rapidBurst
      ? "rapid repeated heavy endpoint calls"
      : "suspicious repeated endpoint pattern";
    console.warn("[abuse-detection]", {
      reason,
      key: params.key,
      endpoint: params.endpoint,
      score: params.score,
      category: params.category,
      hitsLastMinute: hits.length,
    });
    return { suspicious: true, shouldSoftThrottle: true, reason };
  }

  return { suspicious: false, shouldSoftThrottle: false };
}
