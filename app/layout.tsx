import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-context";
import { DonationWidget } from "@/components/donation-widget";
import { CoffeeWidget } from "@/components/coffee-widget";
import { DonationPopup } from "@/components/donation-popup";
import { SocialSidebar } from "@/components/social-sidebar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ቀላል Link - Modern Amharic URL Shortener",
  description: "Localized URL shortener with Amharic Fidel slugs and Ethiopian heritage design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9122247401478241"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <CoffeeWidget />
            <DonationWidget />
            <DonationPopup />
            <SocialSidebar />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
