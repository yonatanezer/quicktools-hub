import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "calculator-tools" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
  alternates: {
    canonical: "/calculator-tools",
  },
};

export default function CalculatorToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="Basic calculators"
      description={seo.description}
      body={seo.body}
      workflows={seo.workflows}
      pitfalls={seo.pitfalls}
      faq={seo.faq}
      tools={list}
      links={[
        { href: "/image-tools", label: "image tools" },
        { href: "/text-tools", label: "text tools" },
        { href: "/business-tools", label: "business and time tools" },
        { href: "/pdf-tools", label: "PDF tools" },
      ]}
    />
  );
}
