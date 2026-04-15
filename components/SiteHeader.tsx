import Link from "next/link";
import { brandIdentity } from "@/lib/brand/identity";

const nav = [
  { href: "/pdf-tools", label: "PDF tools" },
  { href: "/business-tools", label: "Business & time" },
  { href: "/text-tools", label: "Text tools" },
  { href: "/image-tools", label: "Image tools" },
  { href: "/calculator-tools", label: "Basic calculators" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            {brandIdentity.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {brandIdentity.positioning}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav
            aria-label="Main categories"
            className="flex flex-wrap gap-x-1 gap-y-1 text-sm font-medium text-slate-700"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="btn-ghost"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/pdf-tools"
            className="btn-primary min-h-[40px] px-4"
          >
            Explore tools
          </Link>
        </div>
      </div>
    </header>
  );
}
