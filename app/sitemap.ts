import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { getSiteUrl } from "@/lib/seo/site-url";

/** Static discovery for all programmatic SEO tool routes + hub pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/image-tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/text-tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/calculator-tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:
      tool.tier === "star" ? 1 : tool.tier === "standard" ? 0.85 : 0.7,
  }));

  return [...staticPages, ...toolPages];
}
