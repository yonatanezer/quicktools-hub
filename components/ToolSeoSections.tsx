import type { Tool } from "@/data/tools";

export function ToolSeoSections({ tool }: { tool: Tool }) {
  const faqItems = tool.faq.filter(Boolean).slice(0, 4);

  return (
    <>
      <section className="mt-10 space-y-4 border-t border-slate-200 pt-8 text-base leading-relaxed text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">
          Why people use this tool
        </h2>
        {tool.seoContent.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {faqItems.length > 0 ? (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
          <dl className="mt-4 space-y-6">
            {faqItems.map((item, i) => (
              <div key={i}>
                <dt className="font-medium text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-slate-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </>
  );
}
