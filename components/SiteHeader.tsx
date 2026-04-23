"use client";

import Link from "next/link";
import { useState } from "react";
import { brandIdentity } from "@/lib/brand/identity";

const nav = [
  { href: "/pdf-tools", label: "PDF Tools", featured: true },
  { href: "/business-tools", label: "Business & Time Tools", featured: true },
  { href: "/text-tools", label: "Text Tools", featured: false },
  { href: "/image-tools", label: "Image Tools", featured: false },
  { href: "/calculator-tools", label: "Calculators", featured: false },
] as const;

const mobileNav = [
  ...nav,
  { href: "/#tools-section", label: "Explore Tools", featured: true },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
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

          <nav
            aria-label="Main categories"
            className="hidden flex-1 items-center justify-center gap-1 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`btn-ghost ${item.featured ? "font-semibold text-slate-900" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/#tools-section" className="btn-primary min-h-[40px] px-4">
              Explore Tools
            </Link>
          </div>

          <button
            type="button"
            className="btn-ghost md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-main-nav"
            className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3 md:hidden"
          >
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 ${item.featured ? "font-semibold text-slate-900" : "font-medium"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
