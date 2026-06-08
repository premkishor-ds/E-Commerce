import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexStore Admin",
  description: "Admin dashboard for ApexStore platform management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
