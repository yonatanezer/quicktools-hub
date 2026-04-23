import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "QuickTools Hub — Free Online Tools",
  description:
    "Fast, lightweight browser tools for images, text, and everyday calculations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "QuickTools Hub — Free Online Tools",
    description:
      "Fast, lightweight browser tools for images, text, and everyday calculations.",
    siteName: "QuickTools Hub",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickTools Hub — Free Online Tools",
    description:
      "Fast, lightweight browser tools for images, text, and everyday calculations.",
  },

  verification: {
    google: "03vK3FWhMUnyBMYvG_boBKgpXZsdyamE2c6mY0VAphE",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      <Script
  id="gtm-script"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MG49X89Z');
    `,
  }}
/>
      {adsenseClient ? (
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      ) : null}
      <Script
        id="qth-org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "QuickTools Hub",
            url: siteUrl,
            email: "support@quicktools-hub.com",
          }),
        }}
      />
      <Script
        id="qth-website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "QuickTools Hub",
            url: siteUrl,
          }),
        }}
      />
      <body className="flex min-h-screen flex-col antialiased">
      <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-MG49X89Z"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
