/**
 * Canonical site origin for sitemap, robots, and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://quicktoolshub.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  return "https://quicktools-hub-seven.vercel.app";
}