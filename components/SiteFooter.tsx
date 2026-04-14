import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-600">
      <p>QuickTools Hub — lightweight browser tools.</p>
      <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link href="/image-tools" className="text-blue-700 hover:underline">
          Image tools
        </Link>
        <Link href="/pdf-tools" className="text-blue-700 hover:underline">
          PDF tools
        </Link>
        <Link href="/text-tools" className="text-blue-700 hover:underline">
          Text tools
        </Link>
        <Link href="/calculator-tools" className="text-blue-700 hover:underline">
          Calculator tools
        </Link>
      </nav>
    </footer>
  );
}
