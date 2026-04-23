import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QuickTools Hub",
  description:
    "Privacy Policy for QuickTools Hub. Learn how we collect, use, and protect your data.",
  robots: "index, follow",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <div className="space-y-4 text-sm leading-6 text-slate-700">
        <p>
          QuickTools Hub is designed as a utility product, and this policy explains
          how data is handled when you use our pages and tools.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">1) Tool input and file handling</h2>
        <p>
          Depending on the tool, processing may happen in your browser (client-side)
          or through a server route (server-assisted). We do not intentionally use
          your tool content for advertising profiles. For sensitive workflows, review
          the specific tool instructions before uploading or processing files.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">2) Analytics and diagnostics</h2>
        <p>
          We use analytics technologies such as Google Analytics and Google Tag
          Manager to understand product usage and improve reliability. These systems
          may collect device, browser, page, and interaction data.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">3) Advertising technologies</h2>
        <p>
          We may use Google AdSense or similar advertising providers. Third-party
          vendors can use cookies to serve and measure ads based on prior visits.
          You can manage cookie preferences through your browser controls and
          relevant provider settings.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">4) Data retention and sharing</h2>
        <p>
          We do not sell personal information. Data may be shared with infrastructure
          and analytics providers only as needed to operate and improve the service,
          subject to their policies and legal obligations.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">5) Contact and policy updates</h2>
        <p>
          If you have questions about this policy, contact us at
          support@quicktools-hub.com. We may revise this policy as the product
          evolves. Material updates are reflected by the date below.
        </p>

        <p className="pt-6 text-xs text-slate-500">
          Last updated: {new Date().toDateString()}
        </p>
      </div>
    </main>
  );
}