import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QuickTools Hub",
  description:
    "Privacy Policy for QuickTools Hub. Learn how we collect, use, and protect your data.",
  robots: "index, follow",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-4 text-sm leading-6">
        <p>
          QuickTools Hub uses Google Analytics and Google Tag Manager to
          understand how users interact with the website and improve our tools.
        </p>

        <p>
          We may use Google AdSense in the future to display advertisements.
          These services may use cookies and similar tracking technologies.
        </p>

        <p>
          We do not sell, trade, or store personal identifiable information.
          Any analytics data is anonymized where possible.
        </p>

        <p>
          Third-party vendors, including Google, may use cookies to serve ads
          based on prior visits to this website or other websites.
        </p>

        <p>
          Users can disable cookies through browser settings at any time.
        </p>

        <p className="text-xs text-gray-500 pt-6">
          Last updated: {new Date().toDateString()}
        </p>
      </div>
    </main>
  );
}