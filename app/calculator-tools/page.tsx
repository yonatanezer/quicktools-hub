import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "calculator" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
};

export default function CalculatorToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="Calculator tools"
      description={seo.description}
      body={seo.body}
      tools={list}
      links={[
        { href: "/image-tools", label: "image tools" },
        { href: "/text-tools", label: "text tools" },
        { href: "/pdf-tools", label: "PDF tools" },
      ]}
    />
  );
}
