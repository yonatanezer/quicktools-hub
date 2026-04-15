import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "business-tools" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
};

export default function BusinessToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="Business and time tools"
      description={seo.description}
      body={seo.body}
      tools={list}
      links={[
        { href: "/pdf-tools", label: "PDF tools" },
        { href: "/calculator-tools", label: "basic calculators" },
        { href: "/text-tools", label: "text tools" },
      ]}
    />
  );
}
