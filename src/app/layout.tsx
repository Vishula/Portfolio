import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import TankCanvas from "@/components/tank/TankCanvas";
import Cat from "@/components/cat/Cat";
import Companion from "@/components/companion/Companion";
import GlassNav from "@/components/chrome/GlassNav";
import ResumeButton from "@/components/chrome/ResumeButton";
import CatchBurst from "@/components/chrome/CatchBurst";
import CalmToggle from "@/components/chrome/CalmToggle";
import Reveal from "@/components/chrome/Reveal";
import { bootScript } from "@/lib/motion";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Cloud & Systems Engineer`, template: `%s — ${SITE.name}` },
  description: SITE.pitch,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="glass sr-only left-4 top-4 focus:fixed z-[60] rounded-full px-5 py-3 text-[15px] font-medium focus:not-sr-only"
        >
          Skip to content
        </a>
        <TankCanvas />
        <ResumeButton />
        <div className="relative z-10">
          <main id="main">{children}</main>
          <footer className="wrap flex pb-40 pt-16 text-[15px] text-ink-2 sm:justify-end">
            <CalmToggle />
          </footer>
        </div>
        <Cat />
        <Companion />
        <CatchBurst />
        <GlassNav />
        <Reveal />
        <Analytics />
      </body>
    </html>
  );
}
