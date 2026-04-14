type UserCategory =
  | "high_quality_user"
  | "normal_user"
  | "suspicious_user"
  | "bot_likely";

type LimitTier = "general" | "heavy";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;

function baseLimit(tier: LimitTier): number {
  return tier === "heavy" ? 5 : 20;
}

function adjustedLimit(limit: number, category: UserCategory): number {
  if (category === "high_quality_user") return limit + 1;
  if (category === "suspicious_user") return Math.max(2, limit - 2);
  if (category === "bot_likely") return Math.max(1, limit - 3);
  return limit;
}

export function applyRateLimit(params: {
  key: string;
  tier: LimitTier;
  category: UserCategory;
}): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInMs: number;
} {
  const now = Date.now();
  const k = `${params.tier}:${params.key}`;
  const existing = buckets.get(k);
  const limit = adjustedLimit(baseLimit(params.tier), params.category);

  let bucket: Bucket;
  if (!existing || existing.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
  } else {
    bucket = existing;
  }

  bucket.count += 1;
  buckets.set(k, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const allowed = bucket.count <= limit;
  return {
    allowed,
    limit,
    remaining,
    resetInMs: Math.max(0, bucket.resetAt - now),
  };
}
