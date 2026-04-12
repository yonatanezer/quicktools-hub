import type { Metadata } from "next";
import type { Tool } from "@/data/tools";

/** Consistent metadata for tool detail routes (search + sharing). */
export function buildToolPageMetadata(tool: Tool): Metadata {
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    openGraph: {
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
