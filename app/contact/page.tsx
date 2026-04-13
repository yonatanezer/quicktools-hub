import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | QuickTools Hub",
  description:
    "Contact QuickTools Hub for support, feedback, or business inquiries.",
  robots: "index, follow",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>

      <div className="space-y-6 text-sm leading-6">
        <p>
          For support, feedback, or business inquiries, you can contact us
          directly via email.
        </p>

        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="font-medium">Email:</p>
          <a
            href="mailto:support@quicktools-hub.com"
            className="text-blue-600 underline"
          >
            support@quicktools-hub.com
          </a>
        </div>

        <p>
          We typically respond within 24–72 hours depending on request volume.
        </p>

        <p className="text-xs text-gray-500">
          This site uses Google Analytics and may use Google AdSense for
          monetization. By contacting us, you acknowledge this usage.
        </p>
      </div>
    </main>
  );
}