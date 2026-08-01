import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.github }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", geist.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen">
        {/* Skip-to-content — first focusable element for keyboard users */}
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground focus-visible:ring-ring absolute top-4 left-4 z-50 -translate-y-20 rounded-md px-4 py-2 text-sm font-medium shadow-md transition-transform focus-visible:translate-y-0 motion-safe:transition-transform"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
