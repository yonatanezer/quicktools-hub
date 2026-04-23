import Link from "next/link";
import type { Tool } from "@/types/tool";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";

type CategoryLink = { href: string; label: string };

export function CategoryLandingPage({
  heading,
  description,
  body,
  workflows,
  pitfalls,
  faq,
  links,
  tools,
}: {
  heading: string;
  description: string;
  body: string;
  workflows: { title: string; description: string }[];
  pitfalls: string[];
  faq: { question: string; answer: string }[];
  links: CategoryLink[];
  tools: Tool[];
}) {
  const sortedTools = [...tools].sort((a, b) => a.title.localeCompare(b.title));
  const featuredTools = sortedTools.filter((tool) => tool.tier === "star");
  const coreTools = sortedTools.filter((tool) => tool.tier === "standard");
  const moreTools = sortedTools.filter((tool) => tool.tier === "seo");
  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

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
          Category guide and real-world use cases
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Practical workflows in this category
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {workflows.map((workflow) => (
            <article
              key={workflow.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {workflow.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {workflow.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Common mistakes and how to avoid them
        </h2>
        <ul className="mt-4 list-disc space-y-2 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
          {pitfalls.map((pitfall) => (
            <li key={pitfall}>{pitfall}</li>
          ))}
        </ul>
      </section>

      <AdBanner placement="middle" />

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Tools in this category
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with featured tools, then explore core and long-tail utilities.
          </p>
        </div>

        {featuredTools.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Featured tools
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="star" />
              ))}
            </div>
          </div>
        ) : null}

        {coreTools.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Core tools
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {coreTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="standard" />
              ))}
            </div>
          </div>
        ) : null}

        {moreTools.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              More tools
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="compact" />
              ))}
            </div>
          </div>
        ) : null}
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

      {faq.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
          <h2 className="text-xl font-semibold text-slate-900">Category FAQ</h2>
          <dl className="mt-4 space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <dt className="font-medium text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      <AdBanner placement="bottom" />
    </div>
  );
}
