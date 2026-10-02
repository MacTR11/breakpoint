import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { siteName } from "@/lib/config";
import "./globals.css";

// Downloaded at build time and served from this site, so nothing is fetched
// from Google when a student opens a page.
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
  description: "Python challenges for A Level Computer Science: write it, fix it, read it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
