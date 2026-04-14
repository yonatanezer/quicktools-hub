import Link from "next/link";
import type { Tool } from "@/types/tool";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";

type CategoryLink = { href: string; label: string };

export function CategoryLandingPage({
  heading,
  description,
  body,
  links,
  tools,
}: {
  heading: string;
  description: string;
  body: string;
  links: CategoryLink[];
  tools: Tool[];
}) {
  return (
    <div className="space-y-10 sm:space-y-12">
      <AdBanner placement="top" />

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-8 sm:px-8 sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          {description}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Also explore{" "}
          {links.map((link, idx) => (
            <span key={link.href}>
              {idx > 0 && (idx === links.length - 1 ? ", and " : ", ")}
              <Link href={link.href} className="text-blue-700 hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Why people use these tools
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <AdBanner placement="middle" />

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Popular in this category</h2>
        <p className="mt-2 text-sm text-slate-600">
          Choose a tool below to start instantly with no account required.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Built for fast, professional workflows
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          QuickTools Hub keeps tools free, simple, and privacy-friendly so you can
          complete your task and move on quickly.
        </p>
      </section>

      <AdBanner placement="bottom" />
    </div>
  );
}
