import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { getSiteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/pdf-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/business-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/text-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/image-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/calculator-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const priorityMap = {
    star: 1,
    standard: 0.85,
    seo: 0.7,
  } as const;

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: priorityMap[tool.tier],
  }));

  return [...staticPages, ...toolPages];
}