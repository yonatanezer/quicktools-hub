import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About QuickTools Hub | Our Product Principles",
  description:
    "Learn what QuickTools Hub is, who it is for, and how we build privacy-first utility tools with practical educational content.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12 text-slate-800">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          About QuickTools Hub
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          QuickTools Hub is a productivity platform focused on practical utility
          workflows: document handling, business calculations, text cleanup, and
          lightweight conversions. We build tools for real tasks and pair them
          with educational guidance so users can make better decisions, not just
          click a button.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">What we optimize for</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed text-slate-700">
          <li>Clear workflows that reduce avoidable errors.</li>
          <li>Practical explanations for non-technical users.</li>
          <li>Privacy-conscious processing and transparent data handling.</li>
          <li>Fast pages that work on mobile and low-power devices.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Editorial and product approach</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Every category and tool page is written as a problem-solving resource.
          We explain use cases, limitations, and common mistakes so visitors can
          evaluate outputs responsibly. Pages are updated over time as new tools,
          workflows, and user feedback are added.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          If you need legal, tax, medical, or regulated financial advice, use
          professional guidance in addition to these utilities.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Transparency links</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/how-it-works" className="text-blue-700 hover:underline">
            How tools work
          </Link>
          <Link href="/privacy-policy" className="text-blue-700 hover:underline">
            Privacy policy
          </Link>
          <Link href="/terms-of-service" className="text-blue-700 hover:underline">
            Terms of service
          </Link>
          <Link href="/contact" className="text-blue-700 hover:underline">
            Contact
          </Link>
        </div>
      </section>
    </main>
  );
}
