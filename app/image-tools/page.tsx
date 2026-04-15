import type { Metadata } from "next";
import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categorySeo, getToolsByCategory } from "@/data/tools";

const cat = "image-tools" as const;

export const metadata: Metadata = {
  title: categorySeo[cat].title,
  description: categorySeo[cat].description,
};

export default function ImageToolsPage() {
  const seo = categorySeo[cat];
  const list = getToolsByCategory(cat);

  return (
    <CategoryLandingPage
      heading="Image tools"
      description={seo.description}
      body={seo.body}
      tools={list}
      links={[
        { href: "/text-tools", label: "text tools" },
        { href: "/business-tools", label: "business and time tools" },
        { href: "/calculator-tools", label: "basic calculators" },
        { href: "/pdf-tools", label: "PDF tools" },
      ]}
    />
  );
}
