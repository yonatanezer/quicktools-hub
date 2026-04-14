export function HowToUseSection({ steps }: { steps: string[] }) {
  if (!steps.length) return null;

  return (
    <section className="border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
      <ol className="mt-4 list-decimal space-y-3 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
