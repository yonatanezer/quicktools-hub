import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "text-tools" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
  alternates: {
    canonical: "/text-tools",
  },
};

export default function TextToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="Text tools"
      description={seo.description}
      body={seo.body}
      workflows={seo.workflows}
      pitfalls={seo.pitfalls}
      faq={seo.faq}
      tools={list}
      links={[
        { href: "/image-tools", label: "image tools" },
        { href: "/business-tools", label: "business and time tools" },
        { href: "/calculator-tools", label: "basic calculators" },
        { href: "/pdf-tools", label: "PDF tools" },
      ]}
    />
  );
}
