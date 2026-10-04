import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SiteFooterWrapper } from "@/components/layout/SiteFooterWrapper";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBarWrapper } from "@/components/layout/TopBarWrapper";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/lib/constants/site";
import "./globals.css";

/** Avoid Prisma calls at build time (Hostinger build may run before DB is seeded). */
export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | Premium Hotels & Holiday Packages in India`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfcfa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <TopBarWrapper />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooterWrapper />
        <WhatsAppButton />
      </body>
    </html>
  );
}
