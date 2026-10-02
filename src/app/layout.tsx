import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { siteName } from "@/lib/config";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

// Downloaded at build time and served from this site, so nothing is fetched
// from Google when a student opens a page.
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
// The rounded face for headings and numbers on devices without one of their own.
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["700", "800"] });

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
  description: "Python challenges for A Level Computer Science: write it, fix it, read it.",
};

// "cover" lets the phone tab bar sit in the safe area above the home indicator.
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script sets the dark class before React loads, so the server's
    // markup and the browser's can differ on that one attribute.
    <html lang="en" className={`${jetbrainsMono.variable} ${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
