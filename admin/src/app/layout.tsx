import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "./AdminContext";

export const metadata: Metadata = {
  title: "ApexStore Admin",
  description: "Admin dashboard for ApexStore platform management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollbarGutter: 'stable' }}>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased">
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
