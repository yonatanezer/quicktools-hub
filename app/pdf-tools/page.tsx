import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "pdf-tools" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
  alternates: {
    canonical: "/pdf-tools",
  },
};

export default function PdfToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="PDF tools"
      description={seo.description}
      body={seo.body}
      workflows={seo.workflows}
      pitfalls={seo.pitfalls}
      faq={seo.faq}
      tools={list}
      links={[
        { href: "/business-tools", label: "business and time tools" },
        { href: "/text-tools", label: "text tools" },
        { href: "/calculator-tools", label: "basic calculators" },
      ]}
    />
  );
}
