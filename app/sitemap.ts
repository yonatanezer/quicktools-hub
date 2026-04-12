import { tools } from "@/data/tools";

export default function sitemap() {
  const baseUrl = "https://quicktools-hub-seven.vercel.app";

  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/image-tools`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/text-tools`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator-tools`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    priority:
      tool.tier === "star" ? 1.0 :
      tool.tier === "standard" ? 0.8 : 0.6,
  }));

  return [...staticPages, ...toolPages];
}