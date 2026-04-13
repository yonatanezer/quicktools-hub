import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | QuickTools Hub",
  description:
    "Terms of Service for QuickTools Hub. Usage rules and disclaimers.",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="space-y-4 text-sm leading-6">
        <p>
          By using QuickTools Hub, you agree to use the website for lawful and
          non-malicious purposes only.
        </p>

        <p>
         All tools are provided {'"'}as is{'"'} without warranties of any kind.
          We do not guarantee accuracy, availability, or suitability for any
          specific purpose.
        </p>

        <p>
          We may display advertisements via Google AdSense. Ads are managed by
          third-party providers and are not controlled by us.
        </p>

        <p>
          We are not responsible for any damages resulting from the use of this
          website or external links.
        </p>

        <p>
          We reserve the right to modify or discontinue any part of the service
          at any time.
        </p>

        <p className="text-xs text-gray-500 pt-6">
          Last updated: {new Date().toDateString()}
        </p>
      </div>
    </main>
  );
}