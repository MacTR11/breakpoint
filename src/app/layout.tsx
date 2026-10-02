import type { Metadata } from "next";
import { siteName } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
  description: "Practise Python, solve computational thinking puzzles and compete.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
