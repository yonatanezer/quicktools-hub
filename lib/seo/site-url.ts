/**
 * Canonical site origin for sitemap, robots, and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://quicktoolshub.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}
