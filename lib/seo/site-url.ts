/**
 * Canonical site origin for sitemap, robots, and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://quicktoolshub.com).
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  const first = candidates.find((value) => value && value.trim().length > 0);
  if (!first) {
    return "https://quicktools-hub-seven.vercel.app";
  }

  const withProtocol = /^https?:\/\//i.test(first)
    ? first
    : `https://${first}`;

  return withProtocol.replace(/\/$/, "");
}