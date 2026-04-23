import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How QuickTools Hub Tools Work | Data Handling & Processing",
  description:
    "Technical transparency page describing client-side vs server-side tool processing, file handling, retention, and privacy practices.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12 text-slate-800">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          How QuickTools Hub tools work
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          This page explains how files and inputs are processed so you can choose
          the right workflow for your privacy and compliance requirements.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Client-side processing</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Many tools run directly in your browser. In those cases, your content
          is processed on your device and is not uploaded to our servers as part
          of the core tool action.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Server-assisted processing</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Some tools may use server routes when browser-only execution is not
          practical. When server processing is used, data is handled only for the
          requested operation and is not intended for long-term storage.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Operational logging</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          We use analytics and performance telemetry to improve reliability and
          user experience. This can include aggregate interaction signals and page
          usage events. We do not intentionally use tool content as marketing data.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">What this means for users</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-slate-700">
          <li>Review tool-specific instructions before processing sensitive data.</li>
          <li>For regulated data, follow your internal policy controls.</li>
          <li>Download and store outputs in systems you trust and control.</li>
        </ul>
      </section>
    </main>
  );
}
