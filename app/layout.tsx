import "../styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-geist'});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../public/fonts/cal-sans-semibold.woff2",
  weight: "600",
  display: "swap",
  variable: "--font-cal-sans",
});

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Custom prod domain
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel-generated
    'http://localhost:3000/';

  // Ensure protocol and trailing slash
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};


export const metadata: Metadata = {
  title: "Apalis - background jobs, tasks and messages processing library for Rust",
  description:
    "Simple, extensible multithreaded background jobs, tasks and messages processing library for Rust",
  openGraph: {
    images: `${getURL()}images/og.png`,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("relative", "dark", inter.variable, calSans.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      <meta name="algolia-site-verification" content="2C97CAF9558A3A92" />
      <body className="relative overflow-x-hidden antialiased font-light bg-background text-zinc-700 dark:text-zinc-300">
        <Providers>
          {children}
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
