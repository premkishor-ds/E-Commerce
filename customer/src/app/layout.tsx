import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import FeedbackWidget from "../components/FeedbackWidget";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexStore - Enterprise E-Commerce SaaS",
  description: "Enterprise grade multi-vendor storefront platform built with Next.js and NestJS.",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ApexStore",
    description: "Enterprise E-Commerce storefront platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Providers>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} ApexStore Inc. All rights reserved. UCP Compliant / SEO Optimized.
            </div>
          </footer>
          <FeedbackWidget />
        </Providers>
      </body>
    </html>
  );
}

