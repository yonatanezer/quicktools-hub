import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | QuickTools Hub",
  description:
    "Contact QuickTools Hub for support, feedback, or business inquiries.",
  robots: "index, follow",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold">Contact QuickTools Hub</h1>

      <div className="space-y-6 text-sm leading-6 text-slate-700">
        <p>
          For support, bug reports, feedback, or business inquiries, contact us by
          email. Include the tool URL and a short description of what happened so
          we can reproduce issues quickly.
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="font-medium">Email:</p>
          <a
            href="mailto:support@quicktools-hub.com"
            className="text-blue-600 underline"
          >
            support@quicktools-hub.com
          </a>
        </div>

        <p>
          Typical response time is 24-72 hours depending on request volume.
        </p>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">
            Before contacting support
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Double-check the input format shown on the tool page.</li>
            <li>Try the same task in an updated browser.</li>
            <li>Attach exact steps and expected result if reporting a bug.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">Quick contact form</h2>
          <p className="mt-1 text-sm text-slate-600">
            This form opens your email client with prefilled details.
          </p>
          <form
            className="mt-3 space-y-3"
            action="mailto:support@quicktools-hub.com"
            method="post"
            encType="text/plain"
          >
            <label htmlFor="contact-subject" className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Subject
              </span>
              <input
                id="contact-subject"
                name="subject"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. Issue with PDF conversion"
              />
            </label>
            <label htmlFor="contact-message" className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Message
              </span>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Include tool URL, steps, and expected result."
              />
            </label>
            <button type="submit" className="btn-primary px-4">
              Open email draft
            </button>
          </form>
        </section>

        <p className="text-xs text-slate-500">
          See our{" "}
          <Link href="/how-it-works" className="text-blue-700 hover:underline">
            processing transparency page
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-blue-700 hover:underline">
            privacy policy
          </Link>{" "}
          for data-handling details.
        </p>
      </div>
    </main>
  );
}