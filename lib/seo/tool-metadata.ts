import type { Metadata } from "next";
import type { Tool } from "@/types/tool";
import { getSiteUrl } from "@/lib/seo/site-url";

/** Consistent metadata for tool detail routes (search + sharing). */
export function buildToolPageMetadata(tool: Tool): Metadata {
  const canonical = `${getSiteUrl()}/tools/${tool.slug}`;
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}
