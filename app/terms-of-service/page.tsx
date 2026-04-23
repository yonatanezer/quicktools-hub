import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | QuickTools Hub",
  description:
    "Terms of Service for QuickTools Hub. Usage rules and disclaimers.",
  robots: "index, follow",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold">Terms of Service</h1>

      <div className="space-y-4 text-sm leading-6 text-slate-700">
        <p>
          By using QuickTools Hub, you agree to use the service for lawful purposes
          and in a way that does not abuse, disrupt, or attempt to compromise the platform.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">1) Service scope</h2>
        <p>
          QuickTools Hub provides informational utility tools and workflow guidance.
          Outputs are provided as-is and should be reviewed before legal, medical,
          financial, or safety-critical use.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">2) Availability and changes</h2>
        <p>
          We may add, modify, or remove tools and features over time. We do not
          guarantee uninterrupted availability or compatibility with every device,
          file type, or browser version.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">3) Acceptable use</h2>
        <p>
          You agree not to use automated abuse, scraping patterns that degrade
          service quality, malicious uploads, or attempts to bypass security controls.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">4) Third-party services</h2>
        <p>
          The site may include analytics and advertising integrations (including
          Google services). External providers operate under their own terms and
          policies.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-slate-900">5) Liability limitations</h2>
        <p>
          To the maximum extent permitted by law, QuickTools Hub is not liable for
          indirect or consequential losses resulting from use of the website, tools,
          or linked external resources.
        </p>

        <p className="pt-6 text-xs text-slate-500">
          Last updated: {new Date().toDateString()}
        </p>
      </div>
    </main>
  );
}