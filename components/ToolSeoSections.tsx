import type { Tool } from "@/types/tool";

export function ToolSeoSections({ tool }: { tool: Tool }) {
  const faqItems = tool.faq.slice(0, 4);
  const benefits = [
    "Fast workflow designed for mobile and desktop users.",
    "Clear steps and practical guidance for repeat tasks.",
    "Focused UI with minimal clutter for better completion rates.",
  ];

  return (
    <>
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Why use this tool</h2>
        <ul className="mt-4 list-disc space-y-2 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8 text-base leading-relaxed text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">
          About this free online tool
        </h2>
        {tool.seoContent.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {faqItems.length > 0 ? (
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
          <dl className="mt-4 space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
