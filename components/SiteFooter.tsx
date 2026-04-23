import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-sm text-slate-600">
      <div className="mx-auto max-w-5xl space-y-6 px-4">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            QuickTools Hub
          </h2>
          <p>
            Practical browser-based tools for document conversion, text workflows,
            and quick calculations. Built for speed, clarity, and trustworthy
            everyday use.
          </p>
        </div>

        <nav aria-label="Footer tools navigation">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Tool categories
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/pdf-tools" className="text-blue-700 hover:underline">
              PDF tools
            </Link>
            <Link href="/business-tools" className="text-blue-700 hover:underline">
              Business and time tools
            </Link>
            <Link href="/text-tools" className="text-blue-700 hover:underline">
              Text tools
            </Link>
            <Link href="/image-tools" className="text-blue-700 hover:underline">
              Image tools
            </Link>
            <Link
              href="/calculator-tools"
              className="text-blue-700 hover:underline"
            >
              Basic calculators
            </Link>
          </div>
        </nav>

        <nav aria-label="Footer legal navigation">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Legal and trust
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-blue-700 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-blue-700 hover:underline"
            >
              Terms of Service
            </Link>
            <Link href="/contact" className="text-blue-700 hover:underline">
              Contact
            </Link>
            <Link href="/about" className="text-blue-700 hover:underline">
              About
            </Link>
            <Link href="/how-it-works" className="text-blue-700 hover:underline">
              How Tools Work
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
